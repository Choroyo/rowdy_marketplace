import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const CategoryFilters = ({ id }) => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(999);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const rangeMax = 999;

  // Load existing filter values when component mounts or URL changes
  useEffect(() => {
    const minParam = searchParams.get('minPrice');
    const maxParam = searchParams.get('maxPrice');
    
    if (minParam) {
      setMinPrice(parseInt(minParam));
    }
    
    if (maxParam) {
      setMaxPrice(parseInt(maxParam));
    }
  }, [searchParams]);

  const handleInputChange = (e, type) => {
    const value = e.target.value === '' ? '' : parseInt(e.target.value);
    
    if (value === '') {
      type === 'min' ? setMinPrice(0) : setMaxPrice(rangeMax);
    } else if (!isNaN(value)) {
      if (type === 'min') {
        setMinPrice(value > maxPrice ? maxPrice : (value < 0 ? 0 : value));
      } else {
        setMaxPrice(value < minPrice ? minPrice : (value > rangeMax ? rangeMax : value));
      }
    }
  };

  const applyFilter = () => {
    // Create a new URLSearchParams object based on the current one
    const newParams = new URLSearchParams(searchParams);
    
    // Set the price filter parameters
    newParams.set('minPrice', minPrice.toString());
    newParams.set('maxPrice', maxPrice.toString());
    
    // Update the URL with the new search parameters
    // This will preserve any existing path and just update the query parameters
    setSearchParams(newParams);
  };

  // Add a clear filter function
  const clearFilters = () => {
    // Create a new URLSearchParams object without price filters
    const newParams = new URLSearchParams();
    
    // Keep any other parameters except price filters
    for (const [key, value] of searchParams.entries()) {
      if (key !== 'minPrice' && key !== 'maxPrice') {
        newParams.set(key, value);
      }
    }
    
    // Reset state values
    setMinPrice(0);
    setMaxPrice(rangeMax);
    
    // Update URL
    setSearchParams(newParams);
  };

  // Check if filters are active
  const filtersActive = searchParams.has('minPrice') || searchParams.has('maxPrice');

  return (
    <div className="min-w-[250px] bg-white p-4 rounded-md shadow-md sticky top-4">
      <h2 className="text-xl font-bold mb-4 text-center">Filters</h2>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-orange-500 mb-2 text-center">PRICE RANGE</h3>
        
        {/* Input fields */}
        <div className="flex items-center justify-between mt-4">
          <input
            type="text"
            placeholder="min"
            value={minPrice}
            onChange={(e) => handleInputChange(e, 'min')}
            className="border border-gray-300 rounded-md p-2 w-24 text-center"
          />
          <span className="mx-2">-</span>
          <input
            type="text"
            placeholder="max"
            value={maxPrice}
            onChange={(e) => handleInputChange(e, 'max')}
            className="border border-gray-300 rounded-md p-2 w-24 text-center"
          />
        </div>
        
        <button 
          onClick={applyFilter}
          className="w-full mt-6 bg-[#0c2340] text-white py-2 px-4 rounded hover:bg-blue-900 transition"
        >
          Apply Filter
        </button>
        
        {filtersActive && (
          <button 
            onClick={clearFilters}
            className="w-full mt-2 bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition"
          >
            Clear Filters
          </button>
        )}
        
        <p className="text-xl font-bold mt-12 mb-4 text-center">More Filters Coming Soon</p>
      </div>
    </div>
  );
};

export default CategoryFilters;