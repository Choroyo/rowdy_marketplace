import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductProps } from '../../type';
import { store } from '../lib/store';
import toast from 'react-hot-toast';
import { createTransaction, createNotification } from '../lib/firebaseServices';

interface CartItemProps {
  product: ProductProps & { quantity: number };
  removeFromCart: (productId: string) => void;
}

const CartItem = ({ product, removeFromCart }: CartItemProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center">
        <img 
          src={product.images?.[0] || '/placeholder-image.jpg'} 
          alt={product.title || product.name} 
          className="w-16 h-16 object-cover rounded-md"
        />
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-900">{product.title || product.name}</h3>
          <p className="text-sm text-gray-500">Seller: {product.sellerId}</p>
        </div>
      </div>
      <div className="flex items-center">
        <span className="font-medium text-[#0C2340] mr-4">
          ${product.price.toFixed(2)}
        </span>
        <button 
          onClick={() => removeFromCart(product._id)}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

const CartComponent = () => {
  const { cartProduct, removeFromCart, resetCart, currentUser } = store();
  const [processing, setProcessing] = useState(false);
  
  const totalAmount = cartProduct.reduce((total: number, item: ProductProps & { quantity: number }) => 
    total + (item.price * (item.quantity || 1)), 0);
  
  const handleCheckout = async () => {
    if (!currentUser) {
      toast.error('Please log in to complete your purchase');
      return;
    }
    
    if (cartProduct.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    try {
      setProcessing(true);
      
      // Process each item in the cart as a separate transaction
      for (const item of cartProduct) {
        // Create transaction
        const transaction = await createTransaction({
          productId: item._id,
          buyerId: currentUser.id,
          sellerId: item.sellerId,
          price: item.price,
        });
        
        // Notify seller
        await createNotification({
          userId: item.sellerId,
          type: 'sale',
          message: `Your item "${item.title || item.name}" has been purchased by ${currentUser.firstName} ${currentUser.lastName}`,
          relatedId: transaction.id,
        });
        
        // Notify buyer (current user)
        await createNotification({
          userId: currentUser.id,
          type: 'purchase',
          message: `You have purchased "${item.title || item.name}". The seller will contact you soon.`,
          relatedId: transaction.id,
        });
      }
      
      // Clear the cart after successful checkout
      resetCart();
      
      toast.success('Purchase successful! Check your notifications for contact info.');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to process your purchase');
    } finally {
      setProcessing(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-[#0C2340]">Your Shopping Cart</h2>
      </div>
      
      {cartProduct.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Link 
            to="/products" 
            className="px-4 py-2 bg-[#0C2340] text-white rounded hover:bg-[#0A1E38] transition duration-200"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          <div className="max-h-96 overflow-y-auto">
            {cartProduct.map((item) => (
              <CartItem 
                key={item._id} 
                product={item} 
                removeFromCart={removeFromCart} 
              />
            ))}
          </div>
          
          <div className="p-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">Total:</span>
              <span className="text-lg font-bold text-[#0C2340]">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={processing || cartProduct.length === 0}
              className={`w-full py-2 text-white font-medium rounded-md ${
                processing || cartProduct.length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#F15A22] hover:bg-[#D14C1E]'
              } transition duration-200`}
            >
              {processing ? 'Processing...' : 'Checkout'}
            </button>
            
            <button
              onClick={() => resetCart()}
              disabled={processing || cartProduct.length === 0}
              className="w-full mt-2 py-2 text-gray-600 font-medium rounded-md border border-gray-300 hover:bg-gray-50 transition duration-200"
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartComponent; 