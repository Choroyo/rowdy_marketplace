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
  lightGrey: "#F5F5F5",
};

const navigationItems = [
  { title: "Home", link: "/" },
  { title: "Shop", link: "/product" },
  { title: "Cart", link: "/cart" },
  { title: "Orders", link: "/orders" },
  { title: "My Account", link: "/profile" },
  { title: "Blog", link: "/blog" },
];

const Header = () => {
  const [searchText, setSearchText] = useState("");
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductProps[]>([]);
  const { cartProduct, favoriteProduct, currentUser } = store();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData(`${config?.baseUrl}/products`);
        if (Array.isArray(data)) {
          setProducts(data as ProductProps[]);
        }
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
        if (Array.isArray(data)) {
          setCategories(data as unknown as CategoryProps[]);
        }
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = products.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchText, products]);

  return (
    <header className="w-full shadow-md">
      {/* Top Bar */}
      <div className="w-full bg-white border-b">
        <div className="max-w-screen-xl mx-auto py-4 px-4 lg:px-0 flex items-center justify-between">
          <div className="flex-shrink-0">
            <Link to="/" className="block">
              <img src={logo} alt="UTSA Rowdy Marketplace" className="h-16 object-contain" />
            </Link>
          </div>

          <div className="flex-grow max-w-2xl mx-6">
            <div className="relative w-full">
              <input
                type="text"
                onChange={(e) => setSearchText(e.target.value)}
                value={searchText}
                placeholder="Search products..."
                className="w-full px-5 py-3 rounded-full border text-gray-900 focus:outline-none transition-all duration-300"
                style={{
                  borderColor: searchText ? utsaColors.orange : '#e5e7eb',
                  boxShadow: searchText ? `0 0 0 1px ${utsaColors.orange}` : 'none',
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
          </div>

          <div className="flex items-center gap-6">
            <Link to="/profile" className="relative flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 transition-colors">
              {currentUser ? (
                <img src={currentUser?.avatar} alt="profile" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <FiUser className="text-xl" style={{ color: utsaColors.navy }} />
              )}
            </Link>
            
            <Link to="/favorite" className="relative flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 transition-colors">
              <FiStar className="text-xl" style={{ color: utsaColors.navy }} />
              {(favoriteProduct?.length > 0) && (
                <span className="absolute -top-1 -right-1 text-xs text-white w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: utsaColors.orange }}>
                  {favoriteProduct?.length || 0}
                </span>
              )}
            </Link>
            
            <Link to="/cart" className="relative flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 transition-colors">
              <FiShoppingBag className="text-xl" style={{ color: utsaColors.navy }} />
              {(cartProduct?.length > 0) && (
                <span className="absolute -top-1 -right-1 text-xs text-white w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: utsaColors.orange }}>
                  {cartProduct?.length || 0}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
      {/* Navigation Bar */}
      <nav style={{ backgroundColor: utsaColors.navy, height: "45px" }}>
        <div className="max-w-screen-xl mx-auto flex items-center h-full px-4 justify-between">
          {/* Select Category */}
          <Menu>
            <MenuButton className="inline-flex items-center gap-2 rounded-md border border-gray-400 hover:border-white py-1 px-3 font-semibold text-white hover:text-whiteText text-sm">
              Select Category <FaChevronDown className="text-base mt-1" />
            </MenuButton>
            <Transition
              enter="transition ease-out duration-75"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <MenuItems
                anchor="bottom end"
                className="w-52 origin-top-right rounded-xl border border-white/5 bg-black p-1 text-sm/6 text-gray-300 focus:outline-none hover:text-white z-50"
              >
                {categories.map((item: CategoryProps) => (
                  <MenuItem key={item?._id}>
                    <Link
                      to={`/category/${item?._base}`}
                      className="flex w-full items-center gap-2 rounded-lg py-2 px-3 data-[focus]:bg-white/20 tracking-wide"
                    >
                      <img
                        src={item?.image}
                        alt="categoryImage"
                        className="w-6 h-6 rounded-md"
                      />
                      {item?.name}
                    </Link>
                  </MenuItem>
                ))}
              </MenuItems>
            </Transition>
          </Menu>

          {/* Navigation Links */}
          <div className="flex gap-6 items-center">
            {navigationItems.map(({ title, link }) => (
              <Link
                key={title}
                to={link}
                className="uppercase text-sm font-semibold relative group transition-colors duration-300"
                style={{ color: utsaColors.orange }}
              >
                {title}
                <span 
                  className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                  style={{ backgroundColor: utsaColors.orange }}
                ></span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;