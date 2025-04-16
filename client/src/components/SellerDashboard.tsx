import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProductData, updateProductData } from '../lib/firebaseServices';
import { store } from '../lib/store';
import { ProductProps } from '../../type';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

// Defining a common type for user data access
type UserWithId = {
  email: string;
  id?: string;
};

const SellerDashboard = () => {
  // Use auth context for the user
  const { user } = useAuth();
  const { currentUser } = store();
  
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'available' | 'sold'>('available');

  useEffect(() => {
    // If we have a user from auth context, fetch products
    if (user) {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      // Use email as the identifier for products
      const sellerId = user.email;
      const fetchedProducts = await getProducts({ sellerId });
      setProducts(fetchedProducts as ProductProps[]);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load your products');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await deleteProductData(productId);
      setProducts(products.filter(product => product._id !== productId));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleUpdateStatus = async (productId: string, status: string) => {
    try {
      await updateProductData(productId, { status });
      setProducts(products.map(product => 
        product._id === productId ? { ...product, status } : product
      ));
      toast.success(`Product marked as ${status}`);
    } catch (error) {
      console.error('Error updating product status:', error);
      toast.error('Failed to update product status');
    }
  };

  const filteredProducts = products.filter(product => product.status === activeTab);

  // Skip login check - we assume the user is logged in if this component is shown in the modal
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('available')}
              className={`py-2 px-4 text-center font-medium text-sm border-b-2 ${
                activeTab === 'available'
                  ? 'border-[#F15A22] text-[#F15A22]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Available Products
            </button>
            <button
              onClick={() => setActiveTab('sold')}
              className={`py-2 px-4 text-center font-medium text-sm border-b-2 ${
                activeTab === 'sold'
                  ? 'border-[#F15A22] text-[#F15A22]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Sold Products
            </button>
          </nav>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0C2340]"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {activeTab === 'available' 
              ? "You don't have any available products listed yet." 
              : "You haven't sold any products yet."}
          </p>
          {activeTab === 'available' && (
            <button 
              onClick={() => {
                const modal = document.querySelector("[role='dialog']");
                if (modal) {
                  const createTabButton = modal.querySelector("button:nth-child(2)");
                  if (createTabButton) {
                    (createTabButton as HTMLButtonElement).click();
                  }
                }
              }} 
              className="mt-4 inline-block px-4 py-2 bg-[#0C2340] text-white rounded hover:bg-[#0A1E38] transition duration-200"
            >
              Create Your First Listing
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-md object-cover"
                          src={product.images?.[0] || '/placeholder-image.jpg'}
                          alt={product.title}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.title || product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.description?.substring(0, 50)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.status === 'available' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {product.status === 'available' ? (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(product._id, 'sold')}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Mark as Sold
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleUpdateStatus(product._id, 'available')}
                        className="text-green-600 hover:text-green-900"
                      >
                        Mark as Available
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard; 