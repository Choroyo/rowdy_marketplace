// src/App.tsx
import "react-multi-carousel/lib/styles.css";
import BannerCategories from "./ui/BannerCategories";
import HomeBanner from "./ui/HomeBanner";
import Highlights from "./ui/Highlights";
import Categories from "./ui/Categories";
import ProductList from "./ui/ProductList";
import DiscountedBanner from "./ui/DiscountedBanner";
import Blog from "./pages/Forum";

function App() {
  return (
    <main>
      {/* <BannerCategories /> */}
      <HomeBanner />
      <Highlights />  
      {/* <Categories /> */}
      <ProductList />
      {/* <DiscountedBanner /> */}
      {/* <Blog /> */}
    </main>
  );
}

export default App;