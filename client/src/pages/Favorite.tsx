import React, { useState } from "react";
import Container from "../ui/Container";
import { store } from "../lib/store";
import { Link } from "react-router-dom";
import { ProductProps } from "../../type";
import FormattedPrice from "../ui/FormattedPrice";
import { IoClose } from "react-icons/io5";
import ProductDetailsModal from "../ui/ProductDetailsModal";

// FavoriteProduct component with updated styling and image path
const FavoriteProduct = ({ product }: { product: ProductProps }) => {
  const { removeFromFavorite, addToCart } = store();
  const [imageError, setImageError] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromFavorite(product._id);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await addToCart(product);
  };

  // Function to get the image path with better fallback handling
  const getImagePath = () => {
    // First, try to use the first image from the images array (new approach)
    if (product?.images && product.images.length > 0) {
      return product.images[0];
    }
    
    // Check for mainImage (set by our store helper)
    if (product?.mainImage) {
      return product.mainImage;
    }
    
    // Fallback for legacy products using name-based paths
    if (product?.name) {
      return `/images/products/${product.name}.webp`;
    }
    
    // Last resort fallback using title
    if (product?.title) {
      return `/images/products/${product.title}.webp`;
    }
    
    // No valid image path
    return null;
  };

  const imagePath = getImagePath();
  
  // Handle clicking on the product to show details modal
  const handleProductClick = () => {
    setShowDetailsModal(true);
  };
  
  return (
    <>
      <div 
        className="flex py-6 sm:py-10 border-b border-gray-200 cursor-pointer hover:bg-orange-50 transition-colors rounded-md"
        onClick={handleProductClick}
      >
        <div className="flex-shrink-0 h-24 w-24 sm:h-32 sm:w-32 bg-gray-200 rounded-md overflow-hidden">
          {!imageError && imagePath ? (
            <img
              src={imagePath}
              alt={product.name || product.title || "Product image"}
              className="h-full w-full object-cover object-center"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-gray-500 text-xs text-center px-2">
                {imageError ? "Image failed to load" : "No image available"}
              </p>
            </div>
          )}
        </div>

        <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
          <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
            <div>
              <div className="flex justify-between">
                <h3 className="text-base font-bold text-[#0C2340]">
                  {product.name || product.title || "Product"}
                </h3>
              </div>
              {product.category && (
                <p className="mt-1 text-xs uppercase font-semibold text-[#0C2340]">{product.category}</p>
              )}
              <p className="mt-2 text-lg font-bold text-orange-500">
                <FormattedPrice amount={(product.discountedPrice || product.price || 0)} />
              </p>
            </div>

            <div className="mt-4 sm:mt-0 sm:pr-9">
              <div className="absolute right-0 top-0">
                <button
                  type="button"
                  onClick={handleRemove}
                  className="-m-2 p-2 text-gray-400 hover:text-orange-500 transition-colors"
                >
                  <span className="sr-only">Remove</span>
                  <IoClose className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={handleAddToCart}
              className="w-full sm:w-auto bg-[#0C2340] text-white py-2 px-4 rounded-md hover:bg-orange-500 transition-colors duration-300 font-semibold text-sm"
            >
              ADD TO CART
            </button>
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      <ProductDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        product={product}
      />
    </>
  );
};

// Main Favorite page component
const Favorite = () => {
  const { favoriteProduct } = store();
  
  return (
    <Container>
      {favoriteProduct?.length > 0 ? (
        <div className="max-w-4xl mx-auto">
          <div className="pb-6 mb-6 border-b border-gray-200">
            <h2 className="text-3xl font-bold text-[#0C2340]">
              My Favorites
            </h2>
            <p className="text-gray-600 mt-2">
              Items you've marked as favorites
            </p>
          </div>
          <div className="mt-6 flow-root">
            <div className="divide-y divide-gray-200">
              {favoriteProduct?.map((product) => (
                <FavoriteProduct key={product?._id} product={product} />
              ))}
            </div>
          </div>
        </div>
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
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-[#0C2340]">
            Your favorites list is empty
          </h2>
          <p className="text-gray-600 mb-4">
            Start adding products you love by clicking the star icon
          </p>
          <Link
            to="/product"
            className="inline-block py-3 px-6 bg-[#0C2340] text-white rounded-md hover:bg-orange-500 transition-colors duration-300 font-semibold"
          >
            Explore Products
          </Link>
        </div>
      )}
    </Container>
  );
};

export default Favorite;