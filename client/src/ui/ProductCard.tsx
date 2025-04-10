import { ProductProps } from "../../type";
import AddToCartBtn from "./AddToCartBtn";
import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import FormattedPrice from "./FormattedPrice";
import { useNavigate } from "react-router-dom";
import { MdOutlineStarOutline, MdOutlineStar } from "react-icons/md";

interface Props {
  item: ProductProps;
  setSearchText?: any;
}

const ProductCard = ({ item, setSearchText }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigation = useNavigate();

  // Debug logging
  useEffect(() => {
    console.log("Product data:", item);
    console.log("Image URL:", item?.images?.[0]);
  }, [item]);

  const open = () => {
    setIsOpen(true);
  };
  const close = () => {
    setIsOpen(false);
  };

  const handleProduct = () => {
    navigation(`/product/${item?._id}`);
    setSearchText && setSearchText("");
  };

  // Ensure price is a valid number
  const price = typeof item?.price === 'number' ? item.price : 0;

  return (
    <div className="border border-[#0C2340] rounded-lg p-1 overflow-hidden hover:border-orange-500 duration-200 cursor-pointer bg-white">
      <div className="w-full h-60 relative p-2 group">
        {!imageError && item?.images?.[0] ? (
          <img
            onClick={handleProduct}
            src={item.images[0]}
            alt={item?.name || "Product image"}
            className="w-full h-full rounded-md object-cover group-hover:scale-110 duration-300"
            onError={(e) => {
              console.error("Image failed to load:", item.images[0]);
              setImageError(true);
            }}
          />
        ) : (
          <div className="w-full h-full rounded-md bg-gray-200 flex items-center justify-center" onClick={handleProduct}>
            <p className="text-gray-500 text-center px-4">
              {imageError ? "Image failed to load" : "No image available"}
            </p>
          </div>
        )}
        <div className="absolute top-4 right-4">
          <button 
            className="p-1.5 rounded-full bg-white hover:bg-gray-100 transition-colors shadow-sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
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
        <h2 className="text-lg font-bold line-clamp-2 text-[#0C2340]">{item?.name}</h2>
        <div className="flex items-center gap-2">
          <p className="font-bold text-orange-500">
            <FormattedPrice amount={price} />
          </p>
        </div>
        <button 
          onClick={() => AddToCartBtn({ product: item })}
          className="w-full bg-[#0C2340] text-white py-2 rounded-md hover:bg-orange-500 transition-colors duration-300 font-semibold"
        >
          ADD TO CART
        </button>
      </div>
      <Transition appear show={isOpen}>
        <Dialog
          as="div"
          className="relative z-10 focus:outline-none"
          onClose={close}
        >
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 transform-[scale(95%)]"
                enterTo="opacity-100 transform-[scale(100%)]"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 transform-[scale(100%)]"
                leaveTo="opacity-0 transform-[scale(95%)]"
              >
                <DialogPanel className="w-full max-w-md rounded-xl bg-[#0C2340] backdrop-blur-2xl z-50 p-6">
                  <DialogTitle
                    as="h3"
                    className="text-base/7 font-medium text-white"
                  >
                    Product Details
                  </DialogTitle>
                  <p className="mt-2 text-sm/6 text-orange-200">
                    {item?.description}
                  </p>
                  <div className="mt-4">
                    <Button
                      className="inline-flex items-center gap-2 rounded-md bg-orange-500 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner focus:outline-none hover:bg-orange-600"
                      onClick={close}
                    >
                      Close
                    </Button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default ProductCard;