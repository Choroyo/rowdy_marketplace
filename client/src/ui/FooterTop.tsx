import React from "react";
import Container from "./Container";

const FooterTop = () => {
  const incentives = [
    {
      name: "Free shipping",
      imageSrc:
        "https://cdn-icons-png.flaticon.com/512/6831/6831000.png",
      description:
        "Free shipping within the San Antonio area.",
    },
    {
      name: "10-year warranty",
      imageSrc:
        "https://goodwintek.com/wp-content/uploads/2013/02/1monthwarranty.png",
      description:
        "If it breaks in the first month your money back is guaranteed.",
    },
    {
      name: "Money Back Guarantee",
      imageSrc:
        "https://static.vecteezy.com/system/resources/thumbnails/012/072/548/small_2x/arrow-that-circle-cash-money-floating-on-transparent-mobile-banking-and-online-payment-service-cashback-and-refund-transfer-arrows-icon-and-currency-exchange-online-saving-dollar-3d-render-png.png",
      description:
        "If you don't like it, return it to your buyer with full money back guarantee.",
    },
  ];
  return (
    <Container className="py-0">
      <div className=" rounded-2xl bg-[#f6f6f6] px-6 py-16 sm:p-16">
        <div className="mx-auto max-w-xl lg:max-w-none">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
              We built our business on customer service
            </h2>
          </div>
        </div>
        <div className="mx-auto mt-12 grid max-w-sm grid-cols-1 gap-8 sm:max-w-none lg:grid-cols-3">
          {incentives.map((item) => (
            <div
              key={item?.name}
              className="text-center sm:flex sm:text-left lg:block lg:text-center"
            >
              <div className="sm:flex-shrink-0">
                <div className="flex justify-center">
                  <img
                    src={item?.imageSrc}
                    alt={item?.name}
                    className="h-24 w-24 sm:h-28 sm:w-28 lg:h-32 lg:w-32 object-contain"
                  />
                </div>
              </div>
              <div className="mt-3 sm:ml-6 lg:ml-0">
                <h3 className="text-base font-medium text-gray-900">
                  {item?.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {item?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default FooterTop;