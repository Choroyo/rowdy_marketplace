import { homeBanner } from "../assets";
import Container from "./Container";

const HomeBanner = () => {
  return (
    <Container className="relative py-3 overflow-hidden">
      <div className="relative" style={{ maxHeight: "300px" }}>
        <img
          src={homeBanner}
          alt="homeBanner"
          className="w-full object-cover rounded-md"
          style={{ height: "300px" }}
        />
        <div className="w-full h-full absolute top-0 left-0 bg-black/20" />
      </div>
      
    </Container>
  );
};

export default HomeBanner;