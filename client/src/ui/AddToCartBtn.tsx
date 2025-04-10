import { twMerge } from "tailwind-merge";
import { ProductProps } from "../../type";
import { store } from "../lib/store";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import FormattedPrice from "../ui/FormattedPrice";

const AddToCartBtn = ({
  className,
  title,
  product,
  showPrice = true,
}: {
  className?: string;
  title?: string;
  product?: ProductProps;
  showPrice?: boolean;
}) => {
  const [existingProduct, setExistingProduct] = useState<ProductProps | null>(
    null
  );
  const { addToCart, cartProduct, decreaseQuantity } = store();

  useEffect(() => {
    const availableItem = cartProduct.find(
      (item) => item?._id === product?._id
    );

    setExistingProduct(availableItem || null);
  }, [product, cartProduct]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast.success(`${product?.name.substring(0, 10)} added successfully!`);
    } else {
      toast.error("Product is undefined!");
    }
  };

  const handleDeleteProduct = () => {
    if (existingProduct?.quantity && existingProduct.quantity > 1) {
      decreaseQuantity(existingProduct._id as string);
      toast.success(
        `${product?.name.substring(0, 10)} decreased successfully`
      );
    } else {
      toast.error("You can not decrease less than 1");
    }
  };

  const newClassName = twMerge(
    "bg-[#f7f7f7] uppercase text-xs py-3 text-center rounded-full font-semibold hover:bg-black hover:text-white hover:scale-105 duration-200 cursor-pointer",
    className
  );

  const getPrice = () => {
    const quantity = existingProduct?.quantity || 1;
    if (existingProduct && product?.price) {
      return product.price * quantity;
    }
    return product?.price || 0;
  };

  return (
    <>
      {showPrice && (
        <div className="flex items-center gap-2">
          <p className="font-bold text-skyText">
            <FormattedPrice amount={getPrice()} />
          </p>
        </div>
      )}
      {existingProduct ? (
        <div className="flex self-center items-center justify-center gap-2">
          <button
            onClick={handleDeleteProduct}
            className="bg-[#f7f7f7] text-black p-2 border-[1px] border-gray-200 hover:border-skyText rounded-full text-sm hover:bg-white duration-200 cursor-pointer"
          >
            <FaMinus />
          </button>
          <p className="text-base font-semibold w-10 text-center">
            {existingProduct?.quantity || 1}
          </p>
          <button
            onClick={handleAddToCart}
            className="bg-[#f7f7f7] text-black p-2 border-[1px] border-gray-200 hover:border-skyText rounded-full text-sm hover:bg-white duration-200 cursor-pointer"
          >
            <FaPlus />
          </button>
        </div>
      ) : (
        <button onClick={handleAddToCart} className={newClassName}>
          {title ? title : "Add to cart"}
        </button>
      )}
    </>
  );
};

export default AddToCartBtn;