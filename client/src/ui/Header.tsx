import { useEffect, useState } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import { FiShoppingBag, FiStar, FiUser } from "react-icons/fi";
import { IoClose, IoSearchOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { logo } from "../assets";
import Container from "./Container";
import { config } from "../../config";
import { getData } from "../lib";
import { CategoryProps, ProductProps } from "../../type";
import ProductCard from "./ProductCard";
import { store } from "../lib/store";

const utsaColors = {
  navy: "#0C2340",
  orange: "#F15A22",
  white: "#FFFFFF",
};

const bottomNavigation = [
  { title: "Home", link: "/" },
  { title: "Shop", link: "/product" },
  { title: "Cart", link: "/cart" },
  { title: "Orders", link: "/orders" },
  { title: "My Account", link: "/profile" },
  { title: "Blog", link: "/blog" },
];

const Header = () => {
  const [searchText, setSearchText] = useState("");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { cartProduct, favoriteProduct, currentUser } = store();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData(`${config?.baseUrl}/products`);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getData(`${config?.baseUrl}/categories`);
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = products.filter((item: ProductProps) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchText]);

  return (
    <div className="w-full">
      {/* Top Bar */}
      <div className="w-full bg-white shadow-md">
        <div className="max-w-screen-xl mx-auto h-20 flex items-center justify-between px-4">
          <Link to="/">
            <img src={logo} alt="logo" className="h-16 object-contain" />
          </Link>
          <div className="relative w-full max-w-xl mx-4">
            <input
              type="text"
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
              placeholder="Search products..."
              className="w-full px-4 py-2 rounded-full border text-gray-900 focus:outline-none focus:ring-2"
              style={{
                borderColor: searchText ? utsaColors.orange : '#ccc',
                boxShadow: searchText ? `0 0 0 1px ${utsaColors.orange}` : 'none'
              }}
            />
            {searchText ? (
              <IoClose
                onClick={() => setSearchText("")}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-xl cursor-pointer"
                style={{ color: utsaColors.orange }}
              />
            ) : (
              <IoSearchOutline
                className="absolute top-1/2 right-4 -translate-y-1/2 text-xl"
                style={{ color: utsaColors.navy }}
              />
            )}
          </div>
          <div className="flex items-center gap-6 text-2xl">
            <Link to="/profile">
              {currentUser ? (
                <img src={currentUser?.avatar} alt="profile" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <FiUser className="cursor-pointer" style={{ color: utsaColors.navy }} />
              )}
            </Link>
            <Link to="/favorite" className="relative">
              <FiStar className="cursor-pointer" style={{ color: utsaColors.navy }} />
              <span className="absolute -top-1 -right-2 text-xs text-white w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: utsaColors.orange }}>
                {favoriteProduct?.length || 0}
              </span>
            </Link>
            <Link to="/cart" className="relative">
              <FiShoppingBag className="cursor-pointer" style={{ color: utsaColors.navy }} />
              <span className="absolute -top-1 -right-2 text-xs text-white w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: utsaColors.orange }}>
                {cartProduct?.length || 0}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="w-full" style={{ backgroundColor: utsaColors.navy }}>
        <Container className="py-2 max-w-screen-xl mx-auto flex items-center justify-between text-white">
          <Menu>
            <MenuButton className="inline-flex items-center gap-2 rounded-md border border-white/30 hover:border-orange-500 py-1.5 px-3 font-semibold text-white hover:text-orange-400">
              Select Category <FaChevronDown className="text-sm mt-1" />
            </MenuButton>
            <Transition>
              <MenuItems className="w-52 origin-top-right rounded-xl border border-white/10 bg-white p-1 text-sm text-gray-800 z-50">
                {categories.map((item: CategoryProps) => (
                  <MenuItem key={item?._id}>
                    <Link
                      to={`/category/${item?._base}`}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-orange-100 rounded-md"
                    >
                      <img src={item?.image} alt="category" className="w-6 h-6 rounded" />
                      {item?.name}
                    </Link>
                  </MenuItem>
                ))}
              </MenuItems>
            </Transition>
          </Menu>
          <div className="flex gap-4">
            {bottomNavigation.map(({ title, link }) => (
              <Link
                key={title}
                to={link}
                className="uppercase text-sm font-semibold relative group px-2"
                style={{ color: utsaColors.orange }}
              >
                {title}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                      style={{ backgroundColor: utsaColors.orange }}></span>
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Header;


// import React, { useState } from 'react';
// import logo from '../assets/logo.png';
// import { IoClose, IoSearchOutline } from 'react-icons/io5';
// import { FiUser, FiStar, FiShoppingCart } from 'react-icons/fi';
// import Container from './Container';
// import { Link } from 'react-router-dom';
// import { config } from '../../config';
// import { useEffect } from 'react';
// import { getData } from '../lib';
// import { CategoryProps } from '../../type';

// const bottomNavigation = [
//   { title: "Home", link: "/" },
//   { title: "Shop", link: "/product" },
//   { title: "Cart", link: "/cart" },
//   { title: "Orders", link: "/orders" },
//   { title: "My Account", link: "/profile" },
//   { title: "Blog", link: "/blog" },
// ];

// // UTSA Official Colors
// const utsaColors = {
//   navy: "#0C2340", // PMS 289, RGB: 12, 35, 64
//   orange: "#F15A22", // PMS 1665, RGB: 241, 90, 34
// };

// const Header = () => {
//   const [searchText, setSearchText] = useState("");
  
//   return (
//     <div className="w-full bg-white">
//       {/* Top header with logo, search, and icons */}
//       <div className="max-w-screen-xl mx-auto h-20 flex items-center justify-between px-2 lg:px-4">
//         {/* Logo on the left - reduced padding */}
//         <div className="h-14 mr-3">
//           <img 
//             src={logo} 
//             alt="UTSA Rowdy Marketplace" 
//             className="h-full object-contain -mt-4" 
//             style={{ height: "100px", width: "160px" }} 
//           />
//         </div>
        
//         {/* Search bar in the middle - expanded width */}
//         <div className="relative flex-grow mx-2">
//           <input 
//             type="text" 
//             onChange={(e) => setSearchText(e.target.value)}
//             value={searchText}
//             placeholder="Search Products" 
//             className="w-full py-2 px-4 text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500" 
//             style={{ borderColor: searchText ? utsaColors.orange : 'rgb(209, 213, 219)', 
//                     boxShadow: searchText ? `0 0 0 1px ${utsaColors.orange}` : 'none' }}
//           />
//           {searchText ? (
//             <IoClose
//               onClick={() => setSearchText("")}
//               className="absolute top-1/2 right-3 -translate-y-1/2 text-xl cursor-pointer duration-300"
//               style={{ color: utsaColors.orange }}
//             />
//           ) : (
//             <IoSearchOutline 
//               className="absolute top-1/2 right-3 -translate-y-1/2 text-xl cursor-pointer duration-300"
//               style={{ color: utsaColors.navy }}
//             />
//           )}
//         </div>
        
//         {/* MenuBar - reduced spacing */}
//         <div className="flex items-center ml-3 gap-x-6 text-2xl">
//           <Link to={"/profile"}>
//             <FiUser className="duration-300 cursor-pointer hover:text-orange-500" 
//                    style={{ color: utsaColors.navy }} />
//           </Link>
          
//           <Link to={"/favorite"} className="relative">
//             <FiStar className="duration-300 cursor-pointer hover:text-orange-500" 
//                    style={{ color: utsaColors.navy }} />
//             <span className="inline-flex items-center justify-center text-white absolute -top-1 -right-1 text-xs w-4 h-4 rounded-full"
//                   style={{ backgroundColor: utsaColors.orange }}>
//               0
//             </span>
//           </Link>
          
//           <Link to={"/cart"} className="relative">
//             <FiShoppingCart className="duration-300 cursor-pointer hover:text-orange-500" 
//                            style={{ color: utsaColors.navy }} />
//             <span className="inline-flex items-center justify-center text-white absolute -top-1 -right-1 text-xs w-4 h-4 rounded-full"
//                   style={{ backgroundColor: utsaColors.orange }}>
//               0
//             </span>
//           </Link>
//         </div>
//       </div>

//       {/* Bottom navigation bar */}
//       <div className="w-full text-white" style={{ backgroundColor: utsaColors.navy }}>
//         <Container className="py-2 max-w-screen-xl mx-auto relative px-2">
//           <div className="flex items-center justify-center w-full">
//             {bottomNavigation.map(({title, link}) => (
//               <Link 
//                 to={link} 
//                 key={title} 
//                 className="uppercase text-sm font-medium tracking-wide px-6 py-2 relative group mx-2"
//                 style={{ color: utsaColors.orange }}
//               >
//                 {title}
//                 <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
//                 style={{ backgroundColor: utsaColors.orange }}></span>
//               </Link>
//             ))}
//           </div>
//         </Container>
//       </div>
//     </div>
//   );
// };

// export default Header;