import React from "react";
import { Link } from "react-router-dom";

interface NoProductsFoundProps {
  minPrice?: string | null;
  maxPrice?: string | null;
}

const NoProductsFound: React.FC<NoProductsFoundProps> = ({ minPrice, maxPrice }) => {
  const priceRangeText = minPrice && maxPrice 
    ? `$${minPrice}-$${maxPrice}` 
    : "Price range";

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <h2 className="text-5xl font-bold text-gray-800 mb-2">404</h2>
      <h3 className="text-2xl font-semibold mb-4">
        <span className="text-orange-500">{priceRangeText}</span> does not exist
      </h3>
      <p className="text-gray-600 mb-8 text-center">
        Sorry, we couldn't find any products matching your price filter.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-xl w-full">
        <div className="bg-white rounded-lg p-6 flex items-center shadow-md">
          <div className="bg-orange-100 p-3 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Product</h4>
            <p className="text-gray-600 text-sm">You will find all available products here.</p>
          </div>
          <Link to="/product" className="ml-auto text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg p-6 flex items-center shadow-md">
          <div className="bg-orange-100 p-3 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Shop</h4>
            <p className="text-gray-600 text-sm">Maximum collections of shopping products.</p>
          </div>
          <Link to="/shop" className="ml-auto text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NoProductsFound;