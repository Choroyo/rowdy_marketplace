import React from 'react';
import { Link } from 'react-router-dom';

// UTSA Official Colors
const utsaColors = {
  navy: "#0C2340", // PMS 289, RGB: 12, 35, 64
  orange: "#F15A22", // PMS 1665, RGB: 241, 90, 34
};

const priceRanges = [
  { title: "Under $10", range: "0-10", link: "/product?price=0-10" },
  { title: "$10-$20", range: "10-20", link: "/product?price=10-20" },
  { title: "$20-$30", range: "20-30", link: "/product?price=20-30" },
  { title: "$30-$40", range: "30-40", link: "/product?price=30-40" },
  { title: "$40-$50", range: "40-50", link: "/product?price=40-50" },
  { title: "$50+", range: "50-1000", link: "/product?price=50-1000" },
];

const PriceBanner = () => {
  return (
    <div className="w-full bg-gray-100 py-3 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-center flex-wrap gap-4">
          {priceRanges.map((item) => (
            <Link
              key={item.range}
              to={item.link}
              className="px-4 py-2 rounded-full bg-white hover:bg-gray-50 border border-gray-200 transition-all duration-300 text-sm font-medium flex items-center justify-center"
              style={{ 
                color: utsaColors.navy,
                borderColor: utsaColors.orange,
                minWidth: "100px"
              }}
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PriceBanner;