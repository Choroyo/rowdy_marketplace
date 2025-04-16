import { MdClose } from "react-icons/md";
import { ProductProps } from "../../type";
import { store } from "../lib/store";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AddToCartBtn from "./AddToCartBtn";
import FormattedPrice from "./FormattedPrice";
import ProductDetailsModal from "./ProductDetailsModal";
import { useState } from "react";

const FavoriteProduct = ({ product }: { product: ProductProps }) => {
  const { removeFromFavorite } = store();
  const navigate = useNavigate();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Function to get the image path with better fallback handling
  const getImagePath = () => {
    // First, try to use the first image from the images array (new approach)
    if (product?.images && product.images.length > 0) {
      return product.images[0];
    }
    
    // Check for mainImage (set by our store helper)
    if (product.mainImage) {
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
  
  return (
    <>
      <div className="flex py-6" onClick={() => setShowDetailsModal(true)}>
        <div className="min-w-0 flex-1 lg:flex lg:flex-col">
          <div className="lg:flex-1">
            <div className="sm:flex">
              <div>
                <h4 className="font-medium text-gray-900">{product?.name || product?.title || "Product"}</h4>
                <p className="mt-2 hidden text-sm text-gray-500 sm:block">
                  {product?.description}
                </p>
                <p className="text-sm mt-1">
                  Brand: <span className="font-medium">{product?.brand || "N/A"}</span>
                </p>
                <p className="text-sm mt-1">
                  Category:{" "}
                  <span className="font-medium">{product?.category || "Other"}</span>
                </p>
              </div>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromFavorite(product?._id);
                  toast.success("Removed from favorite successfully!");
                }}
                className="text-lg text-gray-600 hover:text-red-600 duration-200 cursor-pointer inline-block mt-4 sm:mt-0"
              >
                <MdClose />
              </span>
            </div>
            <div className="flex text-sm items-center gap-6 font-medium py-4">
              <AddToCartBtn product={product} className="w-32" />
            </div>
          </div>
          <p>
            You are saving{" "}
            <span className="text-sm font-semibold text-green-500">
              <FormattedPrice
                amount={(product?.regularPrice || 0) - (product?.discountedPrice || 0)}
              />
            </span>{" "}
            upon purchase
          </p>
        </div>
        <div
          className="ml-4 flex-shrink-0 h-20 w-20 sm:w-40 sm:h-40 sm:order-first sm:m-0 sm:mr-6 border border-gray-200 rounded-md hover:border-skyText duration-200 cursor-pointer group overflow-hidden"
        >
          {!imageError && imagePath ? (
            <img
              src={imagePath}
              alt={product?.name || product?.title || "Product image"}
              className="h-full w-full rounded-lg object-cover object-center group-hover:scale-110 duration-200"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-100">
              <p className="text-gray-500 text-xs text-center px-2">
                {imageError ? "Image failed to load" : "No image available"}
              </p>
            </div>
          )}
        </div>
      </div>

      <ProductDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        product={product}
      />
    </>
  );
};

export default FavoriteProduct;
