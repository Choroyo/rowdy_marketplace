import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { ProductProps } from "../../type";
import FormattedPrice from "./FormattedPrice";
import { store } from "../lib/store";
import ProductDetailsModal from "./ProductDetailsModal";
import toast from "react-hot-toast";

interface Props {
  product: ProductProps;
}

const CartProduct = ({ product }: Props) => {
  const { removeFromCart } = store();
  const [imageError, setImageError] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

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
  const handleProductClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on quantity buttons or delete button
    if ((e.target as Element).closest('button')) {
      return;
    }
    setShowDetailsModal(true);
  };

  const handleRemoveProduct = (e: React.MouseEvent) => {
    // Prevent event bubbling
    e.stopPropagation();
    
    if (product) {
      removeFromCart(product?._id);
      toast.success(`${product?.name || product?.title || "Product"} removed from cart!`);
    }
  };

  return (
    <>
      <div 
        className="flex items-center py-5 sm:py-6 px-4 hover:bg-orange-50 border-b border-gray-200 transition-colors cursor-pointer rounded-lg mb-2 shadow-sm"
        onClick={handleProductClick}
      >
        <div className="flex-shrink-0 h-24 w-24 sm:h-32 sm:w-32 bg-gray-100 rounded-md overflow-hidden border-2 border-[#0C2340]">
          {!imageError && imagePath ? (
            <img
              src={imagePath}
              alt={product.name || product.title || "Product image"}
              className="h-full w-full object-cover object-center"
              onError={(e) => setImageError(true)}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-[#0C2340]/5">
              <p className="text-[#0C2340] text-xs text-center px-2 font-medium">
                {imageError ? "Image failed to load" : "No image available"}
              </p>
            </div>
          )}
        </div>

        <div className="ml-4 flex-1 flex items-center">
          {/* Category and name */}
          <div className="flex-1">
            {product.category && (
              <p className="text-sm text-[#0C2340]/70 uppercase font-semibold tracking-wider">{product.category}</p>
            )}
            <h3 className="text-xl font-bold text-[#0C2340] mt-1">
              {product.name || product.title || "Product"}
            </h3>
          </div>

          {/* Price and delete button aligned right */}
          <div className="flex items-center">
            <p className="text-2xl font-bold text-[#F15A22] mr-4">
              <FormattedPrice
                amount={(product.discountedPrice || product.price) * (product.quantity || 1)}
              />
            </p>
            
            <button
              onClick={handleRemoveProduct}
              className="p-2 text-gray-500 hover:text-[#F15A22] hover:bg-[#F15A22]/10 rounded-full transition-all"
              aria-label="Remove from cart"
            >
              <IoClose className="text-2xl" />
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

export default CartProduct;