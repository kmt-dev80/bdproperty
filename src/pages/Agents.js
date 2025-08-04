import React from 'react';
import { Link } from 'react-router-dom';
import Weblayout from '../layout/Weblayout';

function Agents() {
  const agents = [
    {
      id: 1,
      name: 'Takiul Hasan',
      title: 'Senior Agent',
      phone: '(212) 555-7890',
      email: 'sarah@luxuryhomes.com',
      specialties: ['Luxury Apartments', 'Waterfront Properties'],
      experience: '12 years',
      image: 'assets/img/profile.jpg',
      rating: 4.8,
      listings: 24
    },
    {
      id: 2,
      name: 'Md Jaber Hossain',
      title: 'Commercial Specialist',
      phone: '(212) 555-4567',
      email: 'michael@luxuryhomes.com',
      specialties: ['Office Spaces', 'Retail Properties'],
      experience: '8 years',
      image: 'assets/img/profile_02.jpg',
      rating: 4.9,
      listings: 18
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      title: 'Luxury Homes Expert',
      phone: '(212) 555-1234',
      email: 'emily@luxuryhomes.com',
      specialties: ['Penthouse', 'Historic Homes'],
      experience: '15 years',
      image: 'assets/img/profile_03.jpg',
      rating: 5.0,
      listings: 32
    },
    {
      id: 4,
      name: 'David Wilson',
      title: 'Rental Specialist',
      phone: '(212) 555-9876',
      email: 'david@luxuryhomes.com',
      specialties: ['Short-term Rentals', 'Corporate Housing'],
      experience: '6 years',
      image: 'assets/img/profile_04.jpg',
      rating: 4.7,
      listings: 15
    }
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<i key={i} className="fas fa-star"></i>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<i key={i} className="fas fa-star-half-alt"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star"></i>);
      }
    }
    
    return stars;
  };

  return (
    <Weblayout>    
      {/* Hero Section */}
      <section className="agents-hero py-5 bg-dark text-white">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">Meet Our Expert Agents</h1>
              <p className="lead mb-4">
                Our team of dedicated real estate professionals brings unparalleled 
                expertise and local market knowledge to help you find your dream property.
              </p>
              <Link to="/contact" className="btn btn-warning btn-lg px-4">
                Contact Our Team
              </Link>
            </div>
            <div className="col-lg-6">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="LuxuryHomes agents" 
                className="img-fluid rounded-3 shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Agents Grid */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="section-header mb-5 text-center">
            <h2 className="fw-bold display-5">Our Professional Team</h2>
            <p className="text-muted">Dedicated to finding your perfect property</p>
            <div className="divider mx-auto bg-warning"></div>
          </div>
          
          <div className="row g-4">
            {agents.map(agent => (
              <div key={agent.id} className="col-md-6 col-lg-3">
                <div className="card agent-card h-100 border-0 shadow overflow-hidden">
                  <div className="agent-image">
                    <img 
                      src={agent.image} 
                      className="card-img-top" 
                      alt={agent.name}
                      style={{ height: '300px', objectFit: 'cover' }}
                    />
                    <div className="social-links">
                      <a href="#" className="text-white"><i className="fab fa-facebook-f"></i></a>
                      <a href="#" className="text-white"><i className="fab fa-twitter"></i></a>
                      <a href="#" className="text-white"><i className="fab fa-linkedin-in"></i></a>
                      <a href={`mailto:${agent.email}`} className="text-white"><i className="fas fa-envelope"></i></a>
                    </div>
                  </div>
                  <div className="card-body text-center p-4">
                    <h5 className="card-title mb-1">{agent.name}</h5>
                    <p className="text-muted mb-3">{agent.title}</p>
                    <div className="d-flex justify-content-center text-warning mb-3">
                      {renderStars(agent.rating)}
                      <span className="text-dark ms-2">{agent.rating}</span>
                    </div>
                    <div className="mb-3">
                      <span className="badge bg-dark me-2">{agent.experience} Exp</span>
                      <span className="badge bg-dark">{agent.listings} Listings</span>
                    </div>
                    <ul className="list-unstyled text-start small">
                      {agent.specialties.map((specialty, index) => (
                        <li key={index} className="mb-1">
                          <i className="fas fa-check text-warning me-2"></i>
                          {specialty}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4">
                      <a href={`tel:${agent.phone}`} className="btn btn-outline-dark btn-sm me-2">
                        <i className="fas fa-phone me-1"></i> Call
                      </a>
                      <Link 
                        to={`/agent/${agent.id}`} 
                        className="btn btn-warning btn-sm"
                      >
                        View Profile
                      </Link>
                    </div>
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
              <h2 className="fw-bold mb-3">Ready to work with one of our experts?</h2>
              <p className="mb-lg-0">Our agents are ready to help you find your dream property.</p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <Link to="/contact" className="btn btn-dark btn-lg px-4 me-2">
                Contact Us
              </Link>
              <a href="tel:+12125551234" className="btn btn-outline-dark btn-lg px-4">
                <i className="fas fa-phone me-2"></i> (212) 555-1234
              </a>
            </div>
          </div>
        </div>
      </section>
    </Weblayout>
  );
}

export default Agents;