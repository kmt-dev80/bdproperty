import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'animate.css/animate.min.css';
import '../assets/css/style.css';
import '../App.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingButton from '../components/FloatingButton';
 
function Weblayout({children}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <FloatingButton />
    </>     
     
  )
}

export default Weblayout;