import React from 'react';
import { Link } from 'react-router-dom';
import TestimonialSlider from '../components/TestimonialSlider';

function Services() {
  const services = [
    {
      id: 1,
      title: "Property Rental",
      icon: "home",
      description: "Find the perfect rental property that fits your lifestyle and budget. Our extensive database includes luxury apartments, houses, and commercial spaces.",
      features: [
        "Personalized property matching",
        "Virtual and in-person tours",
        "Lease negotiation",
        "Move-in coordination"
      ]
    },
    {
      id: 2,
      title: "Property Listing",
      icon: "building",
      description: "List your property with us and reach thousands of qualified tenants. We handle everything from professional photography to tenant screening.",
      features: [
        "Professional photography & staging",
        "Premium listing placement",
        "Tenant background checks",
        "Market analysis & pricing strategy"
      ]
    },
    {
      id: 3,
      title: "Property Valuation",
      icon: "search-dollar",
      description: "Get an accurate estimate of your property's market value with our comprehensive valuation services using the latest market data.",
      features: [
        "Comparative market analysis",
        "Rental income potential",
        "Investment return projections",
        "Detailed valuation report"
      ]
    },
    {
      id: 4,
      title: "Property Management",
      icon: "handshake",
      description: "Professional management services for your rental properties. We handle everything from maintenance to rent collection.",
      features: [
        "24/7 maintenance coordination",
        "Rent collection & accounting",
        "Tenant communication",
        "Regular property inspections"
      ]
    },
    {
      id: 5,
      title: "Investment Consulting",
      icon: "chart-line",
      description: "Expert advice on real estate investments to maximize your returns and build your property portfolio.",
      features: [
        "Market trend analysis",
        "Investment property sourcing",
        "Portfolio strategy",
        "Tax optimization advice"
      ]
    },
    {
      id: 6,
      title: "Relocation Services",
      icon: "truck-moving",
      description: "Comprehensive relocation assistance for individuals and corporations moving to new cities or countries.",
      features: [
        "Area orientation tours",
        "School district information",
        "Moving company coordination",
        "Settling-in services"
      ]
    }
  ];

  return (
    <>
      
      {/* Hero Section */}
      <section className="services-hero py-5 bg-dark text-white">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">Our Premium Services</h1>
              <p className="lead mb-4">
                LuxuryHomes offers comprehensive real estate solutions tailored to your needs. 
                Whether you're buying, selling, renting, or investing, we've got you covered.
              </p>
              <div className="d-flex gap-3">
                <Link to="/contact" className="btn btn-warning btn-lg px-4">
                  Contact Us
                </Link>
                <Link to="/properties" className="btn btn-outline-light btn-lg px-4">
                  Browse Properties
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <img 
                src="https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="Luxury real estate services" 
                className="img-fluid rounded-3 shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="section-header mb-5 text-center">
            <h2 className="fw-bold display-5">Comprehensive Real Estate Solutions</h2>
            <p className="text-muted">Tailored services for all your property needs</p>
            <div className="divider mx-auto bg-warning"></div>
          </div>
          
          <div className="row g-4">
            {services.map(service => (
              <div key={service.id} className="col-md-6 col-lg-4">
                <div className="card service-card h-100 border-0 shadow-sm animate__animated animate__fadeIn">
                  <div className="card-body p-4">
                    <div className="service-icon mb-4">
                      <i className={`fas fa-${service.icon} fa-3x text-warning`}></i>
                    </div>
                    <h3 className="h4 fw-bold mb-3">{service.title}</h3>
                    <p className="text-muted mb-4">{service.description}</p>
                    <ul className="list-unstyled mb-4">
                      {service.features.map((feature, index) => (
                        <li key={index} className="mb-2">
                          <i className="fas fa-check-circle text-warning me-2"></i>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link 
                      to="/contact" 
                      className="btn btn-link text-warning text-decoration-none ps-0"
                    >
                      Learn More <i className="fas fa-arrow-right ms-1"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-warning text-dark">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h2 className="fw-bold mb-3">Ready to experience premium real estate services?</h2>
              <p className="mb-lg-0">Join thousands of satisfied clients who found their dream properties through our platform.</p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <Link to="/contact" className="btn btn-dark btn-lg px-4 me-2">
                Get Started
              </Link>
              <a href="tel:+12125551234" className="btn btn-outline-dark btn-lg px-4">
                <i className="fas fa-phone me-2"></i> Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialSlider />
    </>
  );
}

export default Services;