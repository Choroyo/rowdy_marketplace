// Updated Product.tsx with dual range filtering logic
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ProductProps } from "../../type";
import { getData } from "../lib";
import Loading from "../ui/Loading";
import Container from "../ui/Container";
import _ from "lodash";
import ProductCard from "../ui/ProductCard";
import CategoryFilters from "../ui/CategoryFilters";
import NoProductsFound from "../ui/NoProductsFound"; // You'll need to create this component

const Product = () => {
  const [productData, setProductData] = useState<ProductProps | null>(null);
  const [allProducts, setAllProducts] = useState<ProductProps[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [color, setColor] = useState("");
  const { id } = useParams();
  const [searchParams] = useSearchParams();

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
          setFilteredProducts([]);
        } else {
          setAllProducts(data as ProductProps[]);
          setFilteredProducts(data as ProductProps[]); // Initially, filtered = all
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

  // Apply filtering when searchParams or allProducts change
  useEffect(() => {
    if (allProducts.length > 0) {
      const minPriceParam = searchParams.get('minPrice');
      const maxPriceParam = searchParams.get('maxPrice');
      
      if (minPriceParam && maxPriceParam) {
        const minPrice = parseInt(minPriceParam);
        const maxPrice = parseInt(maxPriceParam);
        
        const filtered = allProducts.filter(product => 
          product.price >= minPrice && product.price <= maxPrice
        );
        setFilteredProducts(filtered);
      } else {
        // If no price filter is applied, show all products
        setFilteredProducts(allProducts);
      }
    }
  }, [searchParams, allProducts]);

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
                <div className="flex-1">
                  <p className="text-4xl font-semibold mb-5 text-center text-[#0c2340]">Products</p>
                  
                  {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                      {filteredProducts.map((item: ProductProps) => (
                        <ProductCard item={item} key={item?._id} />
                      ))}
                    </div>
                  ) : (
                    <NoProductsFound 
                      minPrice={searchParams.get('minPrice')} 
                      maxPrice={searchParams.get('maxPrice')} 
                    />
                  )}
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