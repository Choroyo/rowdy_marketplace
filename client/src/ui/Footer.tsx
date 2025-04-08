import React from 'react';
import Container from './Container';
import payment from '../assets/payment.webp'
import FooterTop from './FooterTop';

const Footer = () => {
  return <div className="mt-10">
    <FooterTop />
    <Container className="flex flex-col md:flex-row items-center gap-4 justify-between py-4">
      <p>@2025 RowdyMarket Solutions. All rights reserved.</p>
      <img src={payment} alt="payment-img" className='h-auto w-auto object-contain'/>
    </Container>
  </div>;
};

export default Footer;