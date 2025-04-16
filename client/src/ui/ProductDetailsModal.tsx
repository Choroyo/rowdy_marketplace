import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { ProductProps } from "../../type";
import FormattedPrice from "./FormattedPrice";
import { MdOutlineStarOutline, MdOutlineStar } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { store } from "../lib/store"; // Import your store
import { doc, getDoc } from "firebase/firestore"; // Import Firebase functions
import { db } from "../lib/firebase"; // Import your Firebase config

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductProps | null;
}

const ProductDetailsModal = ({ isOpen, onClose, product }: ProductDetailsModalProps) => {
  const [imageError, setImageError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { addToCart, addToFavorite, favoriteProduct } = store();

  // Check if the product is already in favorites
  const isFavorite = favoriteProduct?.some(p => p._id === product?._id) || false;

  useEffect(() => {
    // Reset states when product changes
    if (product) {
      setQuantity(1);
      setSelectedColor(product.colors?.[0] || "");
      setSelectedImage(getImagePath());
      setImageError(false);
    }
  }, [product]);

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  // Handle favorite toggling
  const handleFavoriteClick = () => {
    if (product) {
      addToFavorite(product);
    }
  };

  // Handle "Add to Cart" button click
  const handleAddToCart = () => {
    if (product) {
      const productWithQuantity = { ...product, quantity };
      addToCart(productWithQuantity);
      onClose();
    }
  };

  // Function to get the image path with better fallback handling
  const getImagePath = () => {
    if (!product) return null;
    
    // First, try to use the first image from the images array (new approach)
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    
    // Fallback for legacy products using name-based paths
    if (product.name) {
      return `/images/products/${product.name}.webp`;
    }
    
    // Last resort fallback using title
    if (product.title) {
      return `/images/products/${product.title}.webp`;
    }
    
    // No valid image path
    return null;
  };

  if (!product) return null;

  // Get all available images for the product
  const availableImages = product.images && product.images.length > 0 
    ? product.images 
    : (getImagePath() ? [getImagePath() as string] : []);

  // Get product display title
  const productTitle = product.title || product.name || "Product";

  // Ensure price is a valid number
  const price = typeof product.price === 'number' 
    ? product.price 
    : (product.discountedPrice || 0);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-all"
                >
                  <IoClose size={24} className="text-gray-500" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Image section */}
                  <div className="space-y-4">
                    <div className="aspect-square rounded-lg border overflow-hidden bg-gray-100">
                      {!imageError && selectedImage ? (
                        <img
                          src={selectedImage}
                          alt={productTitle}
                          className="w-full h-full object-cover"
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <p className="text-gray-500 text-center px-4">
                            {imageError ? "Image failed to load" : "No image available"}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Thumbnail images */}
                    {availableImages.length > 1 && (
                      <div className="flex space-x-2 overflow-x-auto">
                        {availableImages.map((img, index) => (
                          <button
                            key={index}
                            className={`w-16 h-16 rounded border overflow-hidden ${
                              selectedImage === img ? 'border-[#F15A22] border-2' : 'border-gray-200'
                            }`}
                            onClick={() => setSelectedImage(img)}
                          >
                            <img
                              src={img}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/150?text=No+Image';
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Product details */}
                  <div className="flex flex-col space-y-4">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm text-[#0C2340] uppercase font-medium">
                          {product.category || "Uncategorized"}
                        </h3>
                        <button
                          onClick={handleFavoriteClick}
                          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          {isFavorite ? (
                            <MdOutlineStar className="text-orange-500 text-xl" />
                          ) : (
                            <MdOutlineStarOutline className="text-orange-500 text-xl" />
                          )}
                        </button>
                      </div>
                      <h2 className="text-2xl font-bold text-[#0C2340] mt-1">{productTitle}</h2>
                    </div>

                    <p className="text-3xl font-bold text-[#F15A22]">
                      <FormattedPrice amount={price} />
                    </p>

                    <div className="border-t border-b py-4">
                      <p className="text-gray-700">{product.description}</p>
                    </div>

                    {product.colors && product.colors.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-[#0C2340]">Select Color</p>
                        <div className="flex flex-wrap gap-2">
                          {product.colors.map((color) => (
                            <button
                              key={color}
                              className={`w-8 h-8 rounded-full border ${
                                selectedColor === color 
                                  ? 'ring-2 ring-offset-1 ring-[#F15A22]' 
                                  : 'ring-1 ring-gray-300'
                              }`}
                              style={{ backgroundColor: color }}
                              onClick={() => setSelectedColor(color)}
                              aria-label={`Color: ${color}`}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-[#0C2340]">Quantity</p>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={decreaseQuantity}
                          className="w-8 h-8 flex items-center justify-center border rounded-md hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="w-12 text-center">{quantity}</span>
                        <button
                          onClick={increaseQuantity}
                          className="w-8 h-8 flex items-center justify-center border rounded-md hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className="mt-4 w-full py-3 bg-[#0C2340] text-white rounded-md hover:bg-[#F15A22] transition-colors duration-300 font-semibold"
                    >
                      ADD TO CART
                    </button>

                    {/* Additional product info */}
                    {product.brand && (
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Brand:</span> {product.brand}
                      </p>
                    )}
                    {product.status && (
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Status:</span> {product.status}
                      </p>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ProductDetailsModal;