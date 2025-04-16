import { useEffect, useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { store } from "../lib/store";
import CartProduct from "../ui/CartProduct";
import CheckoutBtn from "../ui/CheckoutBtn";
import Container from "../ui/Container";
import FormattedPrice from "../ui/FormattedPrice";
import { doc, getDoc } from "firebase/firestore"; // Import Firebase functions
import { db } from "../lib/firebase"; // Import your Firebase config

const Cart = () => {
  const [totalAmt, setTotalAmt] = useState({ regular: 0, discounted: 0 });
  const [loading, setLoading] = useState(false);
  const { cartProduct, currentUser } = store();
  const [updatedCartProducts, setUpdatedCartProducts] = useState(cartProduct);
  const [showTaxTooltip, setShowTaxTooltip] = useState(false);
  const [showShippingTooltip, setShowShippingTooltip] = useState(false);

  // Shipping is now free
  const shippingAmt = 0;
  // Tax is 8% of the subtotal (0.08 on the dollar as in Texas)
  const taxRate = 0.0825;

  // Fetch updated product details from Firebase
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (cartProduct.length === 0) return;
      
      setLoading(true);
      
      try {
        const updatedProducts = await Promise.all(
          cartProduct.map(async (product) => {
            try {
              // Reference to the product document in Firestore
              const productRef = doc(db, "products", product._id);
              const productSnap = await getDoc(productRef);
              
              if (productSnap.exists()) {
                // Get data from Firestore
                const productData = productSnap.data();
                
                // Update product with Firebase data, maintaining quantity from cart
                return {
                  ...product,
                  price: productData.price || product.price,
                  discountedPrice: productData.discountedPrice || product.discountedPrice || productData.price || product.price,
                  regularPrice: productData.regularPrice || product.regularPrice || productData.price || product.price,
                  description: productData.description || product.description,
                };
              }
              
              return product;
            } catch (error) {
              console.error("Error fetching product details:", error);
              return product;
            }
          })
        );
        
        setUpdatedCartProducts(updatedProducts);
      } catch (error) {
        console.error("Error updating cart products:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [cartProduct]);

  // Calculate totals based on updated product information
  useEffect(() => {
    const totals = updatedCartProducts.reduce(
      (sum, product) => {
        const regularPrice = product?.regularPrice || product?.price || 0;
        const discountedPrice = product?.discountedPrice || product?.price || 0;
        
        sum.regular += regularPrice * product?.quantity;
        sum.discounted += discountedPrice * product?.quantity;
        return sum;
      },
      { regular: 0, discounted: 0 }
    );
    setTotalAmt(totals);
  }, [updatedCartProducts]);

  // Calculate tax amount based on subtotal
  const taxAmt = totalAmt.discounted * taxRate;

  // Handle tooltip toggles
  const toggleTaxTooltip = () => {
    setShowTaxTooltip(!showTaxTooltip);
    if (showShippingTooltip) setShowShippingTooltip(false);
  };

  const toggleShippingTooltip = () => {
    setShowShippingTooltip(!showShippingTooltip);
    if (showTaxTooltip) setShowTaxTooltip(false);
  };

  // Close tooltips when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowTaxTooltip(false);
      setShowShippingTooltip(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Container>
      {cartProduct.length > 0 ? (
        <>
          <div className="pb-6 mb-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-[#0C2340]">
              Shopping Cart
            </h1>
            <p className="text-gray-600 mt-2">
              Review your items and proceed to checkout
            </p>
          </div>

          <div className="mt-8 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            <section className="lg:col-span-7">
              <div className="divide-y divide-gray-200 border-b border-t border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#0C2340] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                    </div>
                    <p className="mt-2 text-gray-600">Updating cart items...</p>
                  </div>
                ) : (
                  updatedCartProducts.map((product) => (
                    <CartProduct product={product} key={product?._id} />
                  ))
                )}
              </div>
            </section>
            <section className="mt-16 rounded-lg bg-white px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-[#0C2340] mb-4">
                Order Summary
              </h2>

              <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Subtotal</dt>
                  <dd className="text-sm font-medium text-[#0C2340]">
                    {loading ? (
                      <div className="h-5 w-20 bg-gray-200 animate-pulse rounded"></div>
                    ) : (
                      <FormattedPrice amount={totalAmt?.discounted} />
                    )}
                  </dd>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-4 relative">
                  <dt className="flex items-center text-sm text-gray-600">
                    <span>Shipping</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleShippingTooltip();
                      }} 
                      className="ml-2 focus:outline-none"
                    >
                      <FaQuestionCircle className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </button>
                    {showShippingTooltip && (
                      <div className="absolute z-10 left-0 -bottom-24 w-64 p-3 bg-white rounded-md shadow-lg border border-gray-200 text-xs">
                        <p className="font-medium mb-1 text-[#0C2340]">Free Local Pickup</p>
                        <p>We do not facilitate shipping. You are expected to meet the seller in person to collect your items.</p>
                      </div>
                    )}
                  </dt>
                  <dd className="text-sm font-medium text-[#0C2340]">
                    <span className="text-green-600 font-medium">Free</span>
                  </dd>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-4 relative">
                  <dt className="flex text-sm text-gray-600">
                    <span>Tax (8.25%)</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTaxTooltip();
                      }} 
                      className="ml-2 focus:outline-none"
                    >
                      <FaQuestionCircle className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </button>
                    {showTaxTooltip && (
                      <div className="absolute z-10 left-0 -bottom-24 w-64 p-3 bg-white rounded-md shadow-lg border border-gray-200 text-xs">
                        <p className="font-medium mb-1 text-[#0C2340]">Texas Sales Tax</p>
                        <p>A standard 8.25% Texas sales tax (0.0825 on the dollar) is applied to all purchases in accordance with state regulations.</p>
                      </div>
                    )}
                  </dt>
                  <dd className="text-sm font-medium text-[#0C2340]">
                    {loading ? (
                      <div className="h-5 w-20 bg-gray-200 animate-pulse rounded"></div>
                    ) : (
                      <FormattedPrice amount={taxAmt} />
                    )}
                  </dd>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="text-base font-bold text-[#0C2340]">
                    Order total
                  </dt>
                  <dd className="text-lg font-bold text-[#F15A22]">
                    {loading ? (
                      <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
                    ) : (
                      <FormattedPrice
                        amount={totalAmt?.discounted + shippingAmt + taxAmt}
                      />
                    )}
                  </dd>
                </div>
              </dl>
              
              <div className="mt-8">
                <CheckoutBtn products={updatedCartProducts} />
              </div>
              
              <div className="mt-4 text-center">
                <Link
                  to="/product"
                  className="text-sm font-medium text-[#0C2340] hover:text-[#F15A22] transition-colors"
                >
                  or continue shopping
                </Link>
              </div>
            </section>
          </div>
        </>
      ) : (
        <div className="mx-auto flex max-w-3xl flex-col gap-6 items-center text-center py-16">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-[#0C2340]">
            Your shopping cart is empty
          </h2>
          <p className="text-gray-600 mb-4">
            Browse our products and find something you like!
          </p>
          <Link
            to="/product"
            className="inline-block py-3 px-6 bg-[#0C2340] text-white rounded-md hover:bg-[#F15A22] transition-colors duration-300 font-semibold"
          >
            Explore Products
          </Link>
        </div>
      )}
    </Container>
  );
};

export default Cart;