import "react-multi-carousel/lib/styles.css";
import BannerCategories from "./ui/BannerCategories";
import HomeBanner from "./ui/HomeBanner";
import Highlights from "./ui/Highlights";  // Corrected spelling here
import Categories from "./ui/Categories";
import ProductList from "./ui/ProductList";
import DiscountedBanner from "./ui/DiscountedBanner";
import Blog from "./ui/Blog";

function App() {
  return (
    <main>
      {/* <BannerCategories /> */}
      <HomeBanner />
      <Highlights />  {/* Corrected spelling here */}
      <Categories />
      <ProductList />
      <DiscountedBanner />
      <Blog />
    </main>
  );
}

export default App;