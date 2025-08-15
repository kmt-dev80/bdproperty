import React, { useEffect, useState } from 'react';

function Footer() {
    const [showBackToTop, setShowBackToTop] = useState(false);
    
    // Handle scroll events for Back to Top
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowBackToTop(true);
            } else {
                setShowBackToTop(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Smooth scrolling for Back to Top
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Smooth scrolling for anchor links
    const scrollToSection = (id) => {
        const element = document.querySelector(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 70,
                behavior: 'smooth',
            });
        }
    };

    return (
        <>
            {/* <!-- Footer --> */}
            <footer className="footer bg-dark text-white pt-5 pb-4">
                <div className="container">
                    <div className="row g-4">
                        {/* <!-- Company Info --> */}
                        <div className="col-lg-4 mb-4 mb-lg-0">
                            <div className="footer-brand d-flex align-items-center mb-3">
                                <i className="fas fa-home fa-2x text-warning me-2"></i>
                                <span className="h3 mb-0 fw-bold">BD<span className="text-warning">Properties</span></span>
                            </div>
                            <p className="text-white mb-4">Your trusted partner in finding and managing premium properties since 2010.</p>
                            
                            <div className="social-icons d-flex gap-3 mb-4">
                                <a href="#" className="text-white bg-warning bg-opacity-10 rounded-circle p-2 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                                <a href="#" className="text-white bg-warning bg-opacity-10 rounded-circle p-2 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                                    <i className="fab fa-twitter"></i>
                                </a>
                                <a href="#" className="text-white bg-warning bg-opacity-10 rounded-circle p-2 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                                    <i className="fab fa-instagram"></i>
                                </a>
                                <a href="#" className="text-white bg-warning bg-opacity-10 rounded-circle p-2 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                                    <i className="fab fa-linkedin-in"></i>
                                </a>
                            </div>
                            
                            <div className="contact-info">
                                <div className="d-flex mb-2">
                                    <i className="fas fa-phone-alt text-warning me-2 mt-1"></i>
                                    <span className="text-white">(+880) 1319028680</span>
                                </div>
                                <div className="d-flex">
                                    <i className="fas fa-envelope text-warning me-2 mt-1"></i>
                                    <span className="text-white">info@bdroperties.com</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* <!-- Quick Links --> */}
                        <div className="col-md-4 col-lg-2 mb-4 mb-md-0">
                            <h5 className="text-uppercase text-warning mb-4 position-relative pb-2">
                                Quick Links
                                <span className="position-absolute bottom-0 start-0 bg-warning" style={{width: '40px', height: '2px'}}></span>
                            </h5>
                            <ul className="list-unstyled">
                                <li className="mb-2"><a href="#" className="text-white text-decoration-none hover-warning">Home</a></li>
                                <li className="mb-2"><a href="#properties" onClick={(e) => { e.preventDefault(); scrollToSection('#properties'); }} className="text-white text-decoration-none hover-warning">Properties</a></li>
                                <li className="mb-2"><a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('#services'); }} className="text-white text-decoration-none hover-warning">Services</a></li>
                                <li className="mb-2"><a href="#agents" onClick={(e) => { e.preventDefault(); scrollToSection('#agents'); }} className="text-white text-decoration-none hover-warning">Agents</a></li>
                                <li className="mb-2"><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('#contact'); }} className="text-white text-decoration-none hover-warning">Contact</a></li>
                            </ul>
                        </div>
                        
                        {/* <!-- Property Types --> */}
                        <div className="col-md-4 col-lg-2 mb-4 mb-md-0">
                            <h5 className="text-uppercase text-warning mb-4 position-relative pb-2">
                                Properties
                                <span className="position-absolute bottom-0 start-0 bg-warning" style={{width: '40px', height: '2px'}}></span>
                            </h5>
                            <ul className="list-unstyled">
                                <li className="mb-2"><a href="#" className="text-white text-decoration-none hover-warning">Apartments</a></li>
                                <li className="mb-2"><a href="#" className="text-white text-decoration-none hover-warning">Villas</a></li>
                                <li className="mb-2"><a href="#" className="text-white text-decoration-none hover-warning">Townhouses</a></li>
                                <li className="mb-2"><a href="#" className="text-white text-decoration-none hover-warning">Offices</a></li>
                                <li className="mb-2"><a href="#" className="text-white text-decoration-none hover-warning">Commercial</a></li>
                            </ul>
                        </div>
                        
                        {/* <!-- Newsletter --> */}
                        <div className="col-md-4 col-lg-4">
                            <h5 className="text-uppercase text-warning mb-4 position-relative pb-2">
                                Newsletter
                                <span className="position-absolute bottom-0 start-0 bg-warning" style={{width: '40px', height: '2px'}}></span>
                            </h5>
                            <p className="text-white mb-4">Subscribe to get updates on new properties and real estate news.</p>
                            
                            <form className="mb-4">
                                <div className="input-group">
                                    <input type="email" className="form-control bg-light border-secondary text-white" placeholder="Your Email" aria-label="Your Email"/>
                                    <button className="btn btn-warning" type="button">
                                        <i className="fas fa-paper-plane"></i>
                                    </button>
                                </div>
                            </form>
                            
                            <div className="payment-methods">
                                <p className="text-white mb-2">We accept:</p>
                                <div className="d-flex gap-2 justify-content-center justify-content-md-start justify-content-lg-start">
                                    <img src="assets/img/logo-1.png" alt="bkash" className="img-fluid"/>
                                    <img src="assets/img/logo-2.png" alt="Mastercard" className="img-fluid"/>
                                    <img src="assets/img/logo-4.png" alt="Gpay" className="img-fluid"/>
                                    <img src="assets/img/logo-5.png" alt="Amex" className="img-fluid"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <hr className="my-4 bg-secondary"/>
                    
                    <div className="row align-items-center">
                        <div className="col-md-6 mb-3 mb-md-0">
                            <p className="text-white mb-0">&copy; 2025 BDProperties. All rights reserved.</p>
                        </div>
                        <div className="col-md-6 text-md-end">
                            <ul className="list-inline mb-0">
                                <li className="list-inline-item"><a href="#" className="text-white text-decoration-none hover-warning">Privacy Policy</a></li>
                                <li className="list-inline-item mx-2">•</li>
                                <li className="list-inline-item"><a href="#" className="text-white text-decoration-none hover-warning">Terms of Service</a></li>
                                <li className="list-inline-item mx-2">•</li>
                                <li className="list-inline-item"><a href="#" className="text-white text-decoration-none hover-warning">Sitemap</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
            <a
                href="#top"
                className={`btn btn-warning btn-lg back-to-top shadow ${showBackToTop ? 'active' : ''}`}
                title="Back to top"
                onClick={scrollToTop}
            >
                <i className="fas fa-arrow-up"></i>
            </a> 
        </>
    );
}

export default Footer;