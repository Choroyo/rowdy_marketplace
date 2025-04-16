import { ProductProps } from "../../type";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineStarOutline, MdOutlineStar } from "react-icons/md";
import { store } from "../lib/store"; // Import your store
import ProductDetailsModal from "./ProductDetailsModal";
import FormattedPrice from "./FormattedPrice";

interface Props {
  item: ProductProps;
  setSearchText?: any;
}

const ProductCard = ({ item, setSearchText }: Props) => {
  const [imageError, setImageError] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const navigation = useNavigate();
  
  // Get store methods and state
  const { addToFavorite, addToCart, favoriteProduct } = store();
  
  // Check if the product is already in favorites
  const isFavorite = favoriteProduct?.some(product => product._id === item._id) || false;

  // Function to get the image path with better fallback handling
  const getImagePath = () => {
    // First, try to use the first image from the images array (new approach)
    if (item?.images && item.images.length > 0) {
      return item.images[0];
    }
    
    // Fallback for legacy products using name-based paths
    if (item?.name) {
      return `/images/products/${item.name}.webp`;
    }
    
    // Last resort fallback using title
    if (item?.title) {
      return `/images/products/${item.title}.webp`;
    }
    
    // No valid image path
    return null;
  };

  const handleProduct = () => {
    // Get current search parameters to preserve filters
    const currentUrl = new URL(window.location.href);
    const searchParams = currentUrl.searchParams.toString();
    
    // Navigate to product details while preserving query parameters
    navigation(`/product/${item?._id}${searchParams ? `?${searchParams}` : ''}`);
    setSearchText && setSearchText("");
  };
  
  // Handle favorite toggling
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToFavorite(item);
  };

  // Handle add to cart - now a dedicated async function like in Favorites
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await addToCart(item);
  };

  // Handle card click to open modal
  const handleCardClick = () => {
    setShowDetailsModal(true);
  };

  // Ensure price is a valid number
  const price = typeof item?.price === 'number' ? item.price : 0;
  
  // Get the image path
  const imagePath = getImagePath();

  // Reset image error state when item changes
  useEffect(() => {
    setImageError(false);
  }, [item]);

  return (
    <>
      <div 
        className="border-2 border-[#0C2340] rounded-lg overflow-hidden hover:border-[#F15A22] transition-all duration-200 cursor-pointer bg-white shadow-sm hover:shadow-md"
        onClick={handleCardClick}
      >
        <div className="w-full h-60 relative p-2 group">
          {!imageError && imagePath ? (
            <img
              src={imagePath}
              alt={item?.name || item?.title || "Product image"}
              className="w-full h-full rounded-md object-cover group-hover:scale-110 duration-300"
              onError={(e) => {
                console.error("Image failed to load:", imagePath);
                setImageError(true);
              }}
            />
          ) : (
            <div className="w-full h-full rounded-md bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500 text-center px-4">
                {imageError ? "Image failed to load" : "No image available"}
              </p>
            </div>
          )}
          <div className="absolute top-4 right-4">
            <button 
              className="p-1.5 rounded-full bg-white hover:bg-gray-100 transition-colors shadow-sm"
              onClick={handleFavoriteClick}
            >
              {isFavorite ? (
                <MdOutlineStar className="text-orange-500 text-xl" />
              ) : (
                <MdOutlineStarOutline className="text-orange-500 text-xl" />
              )}
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2 px-2 pb-2">
          <h3 className="text-xs uppercase font-semibold text-[#0C2340]">
            {item?.category}
          </h3>
          <h2 className="text-lg font-bold line-clamp-2 text-[#0C2340]">
            {item?.title || item?.name}
          </h2>
          <div className="flex items-center gap-2">
            <p className="font-bold text-orange-500">
              <FormattedPrice amount={price} />
            </p>
          </div>
          <button 
            onClick={handleAddToCart}
            className="w-full bg-[#0C2340] text-white py-2 rounded-md hover:bg-orange-500 transition-colors duration-300 font-semibold"
          >
            ADD TO CART
          </button>
        </div>
      </div>

      {/* Modal for product details */}
      <ProductDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        product={item}
      />
    </>
  );
};

export default ProductCard;