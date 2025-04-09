// src/pages/Product.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { config } from "../../config"; // This might not be needed anymore
import { ProductProps } from "../../type";
import { getData } from "../lib";
import Loading from "../ui/Loading";
import Container from "../ui/Container";
import _, { divide } from "lodash";
import PriceTag from "../ui/PriceTag";
import { MdOutlineStarOutline } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";
import FormattedPrice from "../ui/FormattedPrice";
import { IoClose } from "react-icons/io5";
import AddToCartBtn from "../ui/AddToCartBtn";
import { productPayment } from "../assets";
import ProductCard from "../ui/ProductCard";
import CategoryFilters from "../ui/CategoryFilters";
import BannerCategories from "../ui/BannerCategories";

const Product = () => {
  const [productData, setProductData] = useState<ProductProps | null>(null);
  const [allProducts, setAllProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [color, setColor] = useState("");
  const { id } = useParams();

  // Simplified endpoint that works with our getData function
  const endpoint = id ? `/products/${id}` : `/products/`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getData(endpoint);
        
        if (id && data) {
          setProductData(data as ProductProps);
          setAllProducts([]);
        } else {
          setAllProducts(data as ProductProps[]);
          setProductData(null);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, endpoint]);

  useEffect(() => {
    if (productData && productData.images && productData.images.length > 0) {
      setImgUrl(productData.images[0]);
    }
    if (productData && productData.colors && productData.colors.length > 0) {
      setColor(productData.colors[0]);
    }
  }, [productData]);

  return (
    <>
      <BannerCategories />
      <div>
        {loading ? (
          <Loading />
        ) : (
          <Container>
            {!!id && productData && _.isEmpty(allProducts) ? (
              // Single product view - No changes needed here
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Rest of your single product view code */}
                {/* ... */}
              </div>
            ) : (
              // Product list view
              <div className="flex items-start gap-10">
                <CategoryFilters id={id} />
                <div>
                  <p className="text-4xl font-semibold mb-5 text-center">Products Collection</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {allProducts?.map((item: ProductProps) => (
                      <ProductCard item={item} key={item?._id} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Container>
        )}
      </div>
    </>
  );
};

export default Product;