import React, {useState } from 'react';
import { Link} from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Weblayout from '../layout/Weblayout';
import { useModal } from '../context/ModalContext';
import TestimonialSlider from '../components/TestimonialSlider';

function Home() {
  const { setShowListPropertyModal } = useModal();
  // Property filter state
  const [filter, setFilter] = useState('all');
  
  // Search form state
  const [searchParams, setSearchParams] = useState({
    location: '',
    propertyType: 'Any Type',
    bedrooms: 'Any',
    bathrooms: 'Any',
    priceRange: 'Any'
  });

  // Sample properties data
  const properties = [
    {
      id: 1,
      type: 'apartment',
      title: 'Modern Apartment in Downtown',
      price: 1200,
      bedrooms: 3,
      bathrooms: 2,
      address: '123 Main St, New York, NY',
      description: 'Beautiful modern apartment with stunning city views. Recently renovated with high-end finishes.',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: true,
    },
    {
      id: 2,
      type: 'house',
      title: 'Spacious Family House',
      price: 2500,
      bedrooms: 4,
      bathrooms: 3,
      address: '456 Oak Ave, Brooklyn, NY',
      description: 'Lovely family home with large backyard and modern kitchen. Perfect for family gatherings.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false,
    },
    {
      id: 3,
      type: 'office',
      title: 'Luxury Office Space',
      price: 3200,
      bedrooms: 2,
      bathrooms: 2,
      address: '789 Business Blvd, Manhattan, NY',
      description: 'Premium office space in the heart of the business district. Includes conference rooms and reception area.',
      image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: true,
    },
    {
      id: 4,
      type: 'apartment',
      title: 'Cozy Studio Apartment',
      price: 900,
      bedrooms: 1,
      bathrooms: 1,
      address: '101 Park Lane, Queens, NY',
      description: 'Charming studio apartment with efficient layout and natural light. Ideal for young professionals.',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false,
    },
    {
      id: 5,
      type: 'house',
      title: 'Luxury Villa with Pool',
      price: 4500,
      bedrooms: 5,
      bathrooms: 4,
      address: '200 Ocean Drive, Miami, FL',
      description: 'Stunning contemporary villa with private pool, ocean views, and premium amenities.',
      image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: true,
    },
  {
      id: 6,
      type: 'apartment',
      title: 'Penthouse with Panoramic Views',
      price: 3800,
      bedrooms: 3,
      bathrooms: 3,
      address: '500 Skyline Blvd, Chicago, IL',
      description: 'Luxurious penthouse offering breathtaking city views, high ceilings, and designer finishes.',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: true,
    },
    {
      id: 7,
      type: 'office',
      title: 'Creative Co-Working Space',
      price: 1800,
      bedrooms: 3,
      bathrooms: 2,
      address: '300 Innovation Way, Austin, TX',
      description: 'Modern co-working space with flexible workstations, meeting rooms, and lounge areas.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false,
    },
    {
      id: 8,
      type: 'house',
      title: 'Charming Cottage',
      price: 1600,
      bedrooms: 2,
      bathrooms: 1,
      address: '700 Garden St, Portland, OR',
      description: 'Quaint cottage with beautiful garden, vintage charm, and modern comforts.',
      image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false,
    },
    {
      id: 9,
      type: 'apartment',
      title: 'Luxury Waterfront Apartment',
      price: 2800,
      bedrooms: 2,
      bathrooms: 2,
      address: '800 Bayview Dr, San Francisco, CA',
      description: 'Elegant apartment with waterfront views, gourmet kitchen, and access to premium amenities.',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: true,
    }
  ];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSearch = (e) => {
    e.preventDefault();
    // The filtering happens in the filteredProperties calculation
  };

  // Filter properties based on both quick filter and search params
  const filteredProperties = properties.filter(property => {
    // First apply the quick filter (all/apartment/house/office)
    if (filter !== 'all' && property.type !== filter) {
      return false;
    }

    // Then apply search filters
    if (searchParams.location && 
        !property.address.toLowerCase().includes(searchParams.location.toLowerCase())) {
      return false;
    }

    if (searchParams.propertyType !== 'Any Type' && 
        property.type.toLowerCase() !== searchParams.propertyType.toLowerCase()) {
      return false;
    }

    if (searchParams.bedrooms !== 'Any') {
      const beds = searchParams.bedrooms === '4+' ? 4 : parseInt(searchParams.bedrooms);
      if (searchParams.bedrooms === '4+') {
        if (property.bedrooms < beds) return false;
      } else {
        if (property.bedrooms !== beds) return false;
      }
    }

    if (searchParams.bathrooms !== 'Any') {
      const baths = searchParams.bathrooms === '4+' ? 4 : parseInt(searchParams.bathrooms);
      if (searchParams.bathrooms === '4+') {
        if (property.bathrooms < baths) return false;
      } else {
        if (property.bathrooms !== baths) return false;
      }
    }

    if (searchParams.priceRange !== 'Any') {
      const price = property.price;
      const range = searchParams.priceRange;
      
      if (range === '$500 - $1,000' && (price < 500 || price > 1000)) return false;
      if (range === '$1,000 - $2,000' && (price < 1000 || price > 2000)) return false;
      if (range === '$2,000 - $3,500' && (price < 2000 || price > 3500)) return false;
      if (range === '$3,500+' && price < 3500) return false;
    }

    return true;
  });
  return (
    <Weblayout>
    {/* <!-- Image Slider --> */}
    <div id="propertyCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
        <div className="carousel-indicators">
            <button type="button" data-bs-target="#propertyCarousel" data-bs-slide-to="0" className="active"></button>
            <button type="button" data-bs-target="#propertyCarousel" data-bs-slide-to="1"></button>
            <button type="button" data-bs-target="#propertyCarousel" data-bs-slide-to="2"></button>
        </div>
        <div className="carousel-inner">
            <div className="carousel-item active">
                <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" className="d-block w-100" alt="Luxury Home"/>
                <div className="carousel-caption d-none d-md-block animate__animated animate__fadeInUp">
                    <h2 className="display-4 fw-bold">Modern Luxury Villas</h2>
                    <p className="lead">Discover our exclusive collection of waterfront properties</p>
                    <a href="#properties" className="btn btn-warning btn-lg mt-3">Explore Now</a>
                </div>
            </div>
            <div className="carousel-item">
                <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" className="d-block w-100" alt="Luxury Home"/>
                <div className="carousel-caption d-none d-md-block animate__animated animate__fadeInUp">
                    <h2 className="display-4 fw-bold">Premium Family Homes</h2>
                    <p className="lead">Spacious designs perfect for growing families</p>
                    <a href="#properties" className="btn btn-warning btn-lg mt-3">View Listings</a>
                </div>
            </div>
            <div className="carousel-item">
                <img src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" className="d-block w-100" alt="Luxury Home"/>
                <div className="carousel-caption d-none d-md-block animate__animated animate__fadeInUp">
                    <h2 className="display-4 fw-bold">Executive Office Spaces</h2>
                    <p className="lead">Professional environments for business success</p>
                    <a href="#properties" className="btn btn-warning btn-lg mt-3">Browse Offices</a>
                </div>
            </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#propertyCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon"></span>
            <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#propertyCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon"></span>
            <span className="visually-hidden">Next</span>
        </button>
    </div>

    {/* Search Section */}
      <section className="search-section py-5 bg-dark text-white">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card shadow-lg border-0 bg-dark-2">
                <div className="card-body p-4">
                  <h3 className="card-title mb-4 text-center text-warning">Find Your Dream Property</h3>
                  <form className="row g-3" onSubmit={handleSearch}>
                    <div className="col-md-6">
                      <label htmlFor="location" className="form-label text-white">Location</label>
                      <input
                        type="text"
                        className="form-control input-dark"
                        id="location"
                        name="location"
                        placeholder="City, Neighborhood, or ZIP"
                        value={searchParams.location}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="propertyType" className="form-label text-white">Property Type</label>
                      <select
                        id="propertyType"
                        className="form-select bg-dark border-secondary text-white"
                        name="propertyType"
                        value={searchParams.propertyType}
                        onChange={handleInputChange}
                      >
                        <option>Any Type</option>
                        <option>Apartment</option>
                        <option>House</option>
                        <option>Office</option>
                        <option>Store</option>
                        <option>Villa</option>
                        <option>Land</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="bedrooms" className="form-label text-white">Bedrooms</label>
                      <select
                        id="bedrooms"
                        className="form-select bg-dark border-secondary text-white"
                        name="bedrooms"
                        value={searchParams.bedrooms}
                        onChange={handleInputChange}
                      >
                        <option>Any</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4+</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="bathrooms" className="form-label text-white">Bathrooms</label>
                      <select
                        id="bathrooms"
                        className="form-select bg-dark border-secondary text-white"
                        name="bathrooms"
                        value={searchParams.bathrooms}
                        onChange={handleInputChange}
                      >
                        <option>Any</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4+</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="priceRange" className="form-label text-white">Price Range</label>
                      <select
                        id="priceRange"
                        className="form-select bg-dark border-secondary text-white"
                        name="priceRange"
                        value={searchParams.priceRange}
                        onChange={handleInputChange}
                      >
                        <option>Any</option>
                        <option>$500 - $1,000</option>
                        <option>$1,000 - $2,000</option>
                        <option>$2,000 - $3,500</option>
                        <option>$3,500+</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn btn-warning w-100 py-3 fw-bold"
                      >
                        Search Properties <i className="fas fa-search ms-2"></i>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     {/* Properties Section */}
      <section id="properties" className="py-5 bg-light">
        <div className="container">
          <div className="section-header mb-5 text-center">
            <h2 className="fw-bold display-5">Featured Properties</h2>
            <p className="text-muted">Discover our premium selection of properties</p>
            <div className="divider mx-auto bg-warning"></div>
          </div>

          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
                <button
                  className={`btn ${filter === 'all' ? 'btn-dark active' : 'btn-outline-dark'} filter-btn`}
                  onClick={() => setFilter('all')}
                >
                  All
                </button>
                <button
                  className={`btn ${filter === 'apartment' ? 'btn-dark active' : 'btn-outline-dark'} filter-btn`}
                  onClick={() => setFilter('apartment')}
                >
                  Apartment
                </button>
                <button
                  className={`btn ${filter === 'house' ? 'btn-dark active' : 'btn-outline-dark'} filter-btn`}
                  onClick={() => setFilter('house')}
                >
                  House
                </button>
                <button
                  className={`btn ${filter === 'office' ? 'btn-dark active' : 'btn-outline-dark'} filter-btn`}
                  onClick={() => setFilter('office')}
                >
                  Office
                </button>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {filteredProperties.map((property) => (
              <div key={property.id} className="col-md-6 col-lg-4 animate__animated animate__fadeInUp">
                <div className="card property-card h-100 border-0 shadow overflow-hidden">
                  <div className="position-relative">
                    <img src={property.image} className="card-img-top" alt={property.title} />
                    <div
                      className={`badge bg-${property.featured ? 'danger' : 'success'} position-absolute top-0 start-0 m-3`}
                    >
                      {property.featured ? 'Featured' : 'New'}
                    </div>
                    <div className="position-absolute bottom-0 start-0 end-0 p-3 bg-gradient">
                      <div className="d-flex justify-content-between text-light">
                        <span className="fw-bold">${property.price.toLocaleString()}/mo</span>
                        <div>
                          <span className="me-2">
                            <i className="fas fa-bed me-1"></i> {property.bedrooms}
                          </span>
                          <span>
                            <i className="fas fa-bath me-1"></i> {property.bathrooms}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{property.title}</h5>
                    <p className="card-text text-muted mb-3">
                      <i className="fas fa-map-marker-alt text-danger me-1"></i> {property.address}
                    </p>
                    <p className="card-text">{property.description}</p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className="badge bg-dark">
                        {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                      </span>
                      <Link 
                        to="/prodetails"
                        className="btn btn-sm btn-warning"
                      >
                        View Details <i className="fas fa-arrow-right ms-1"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <Link to="/properties" className="btn btn-dark px-4 py-2">
              View All Properties <i className="fas fa-arrow-right ms-2"></i>
            </Link>
          </div>
        </div>
      </section>

    {/* <!-- Services Section --> */}
    <section id="services" className="py-5 bg-white">
        <div className="container">
            <div className="section-header mb-5 text-center">
                <h2 className="fw-bold display-5">Our Services</h2>
                <p className="text-muted">Comprehensive solutions for all your real estate needs</p>
                <div className="divider mx-auto bg-warning"></div>
            </div>
            
            <div className="row g-4">
                <div className="col-md-6 col-lg-3">
                    <div className="card service-card h-100 border-0 shadow-sm animate__animated animate__fadeIn">
                        <div className="card-body text-center p-4">
                            <div className="service-icon mb-3">
                                <i className="fas fa-home"></i>
                            </div>
                            <h5 className="card-title">Property Rental</h5>
                            <p className="card-text text-muted">Find the perfect rental property that fits your lifestyle and budget.</p>
                            <a href="#" className="btn btn-link text-warning text-decoration-none">Learn More <i className="fas fa-arrow-right ms-1"></i></a>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-6 col-lg-3">
                    <div className="card service-card h-100 border-0 shadow-sm animate__animated animate__fadeIn animate__delay-1s">
                        <div className="card-body text-center p-4">
                            <div className="service-icon mb-3">
                                <i className="fas fa-building"></i>
                            </div>
                            <h5 className="card-title">Property Listing</h5>
                            <p className="card-text text-muted">List your property and reach thousands of potential tenants.</p>
                            <a href="#" className="btn btn-link text-warning text-decoration-none">Learn More <i className="fas fa-arrow-right ms-1"></i></a>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-6 col-lg-3">
                    <div className="card service-card h-100 border-0 shadow-sm animate__animated animate__fadeIn animate__delay-2s">
                        <div className="card-body text-center p-4">
                            <div className="service-icon mb-3">
                                <i className="fas fa-search-dollar"></i>
                            </div>
                            <h5 className="card-title">Property Valuation</h5>
                            <p className="card-text text-muted">Get an accurate estimate of your property's market value.</p>
                            <a href="#" className="btn btn-link text-warning text-decoration-none">Learn More <i className="fas fa-arrow-right ms-1"></i></a>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-6 col-lg-3">
                    <div className="card service-card h-100 border-0 shadow-sm animate__animated animate__fadeIn animate__delay-3s">
                        <div className="card-body text-center p-4">
                            <div className="service-icon mb-3">
                                <i className="fas fa-handshake"></i>
                            </div>
                            <h5 className="card-title">Property Management</h5>
                            <p className="card-text text-muted">Professional management services for your rental properties.</p>
                            <a href="#" className="btn btn-link text-warning text-decoration-none">Learn More <i className="fas fa-arrow-right ms-1"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/* <!-- Agents Section --> */}
    <section id="agents" className="py-5 bg-light">
        <div className="container">
            <div className="section-header mb-5 text-center">
                <h2 className="fw-bold display-5">Our Agents</h2>
                <p className="text-muted">Meet our professional real estate agents</p>
                <div className="divider mx-auto bg-warning"></div>
            </div>
            
            <div className="row g-4">
                <div className="col-md-6 col-lg-3">
                    <div className="card agent-card h-100 border-0 shadow overflow-hidden">
                        <div className="agent-image">
                            <img src="assets/img/profile.jpg" className="card-img-top" alt="Agent"/>
                            <div className="social-links">
                                <a href="#" className="text-white"><i className="fab fa-facebook-f"></i></a>
                                <a href="#" className="text-white"><i className="fab fa-twitter"></i></a>
                                <a href="#" className="text-white"><i className="fab fa-linkedin-in"></i></a>
                                <a href="#" className="text-white"><i className="fab fa-instagram"></i></a>
                            </div>
                        </div>
                        <div className="card-body text-center p-4">
                            <h5 className="card-title mb-1">Takiul Hasan</h5>
                            <p className="text-muted mb-3">Senior Agent</p>
                            <div className="d-flex justify-content-center text-warning mb-3">
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star-half-alt"></i>
                            </div>
                            <a href="#" className="btn btn-outline-dark btn-sm">View Profile</a>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-6 col-lg-3">
                    <div className="card agent-card h-100 border-0 shadow overflow-hidden">
                        <div className="agent-image">
                            <img src="assets/img/profile_02.jpg" className="card-img-top" alt="Agent"/>
                            <div className="social-links">
                                <a href="#" className="text-white"><i className="fab fa-facebook-f"></i></a>
                                <a href="#" className="text-white"><i className="fab fa-twitter"></i></a>
                                <a href="#" className="text-white"><i className="fab fa-linkedin-in"></i></a>
                                <a href="#" className="text-white"><i className="fab fa-instagram"></i></a>
                            </div>
                        </div>
                        <div className="card-body text-center p-4">
                            <h5 className="card-title mb-1">Md Jaber Hossain</h5>
                            <p className="text-muted mb-3">Commercial Specialist</p>
                            <div className="d-flex justify-content-center text-warning mb-3">
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                            </div>
                            <a href="#" className="btn btn-outline-dark btn-sm">View Profile</a>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-6 col-lg-3">
                    <div className="card agent-card h-100 border-0 shadow overflow-hidden">
                        <div className="agent-image">
                            <img src="assets/img/profile_03.jpg" className="card-img-top" alt="Agent"/>
                            <div className="social-links">
                                <a href="#" className="text-white"><i className="fab fa-facebook-f"></i></a>
                                <a href="#" className="text-white"><i className="fab fa-twitter"></i></a>
                                <a href="#" className="text-white"><i className="fab fa-linkedin-in"></i></a>
                                <a href="#" className="text-white"><i className="fab fa-instagram"></i></a>
                            </div>
                        </div>
                        <div className="card-body text-center p-4">
                            <h5 className="card-title mb-1">Emily Rodriguez</h5>
                            <p className="text-muted mb-3">Luxury Homes Expert</p>
                            <div className="d-flex justify-content-center text-warning mb-3">
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                            </div>
                            <a href="#" className="btn btn-outline-dark btn-sm">View Profile</a>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-6 col-lg-3">
                    <div className="card agent-card h-100 border-0 shadow overflow-hidden">
                        <div className="agent-image">
                            <img src="assets/img/profile_04.jpg" className="card-img-top" alt="Agent"/>
                            <div className="social-links">
                                <a href="#" className="text-white"><i className="fab fa-facebook-f"></i></a>
                                <a href="#" className="text-white"><i className="fab fa-twitter"></i></a>
                                <a href="#" className="text-white"><i className="fab fa-linkedin-in"></i></a>
                                <a href="#" className="text-white"><i className="fab fa-instagram"></i></a>
                            </div>
                        </div>
                        <div className="card-body text-center p-4">
                            <h5 className="card-title mb-1">David Wilson</h5>
                            <p className="text-muted mb-3">Rental Specialist</p>
                            <div className="d-flex justify-content-center text-warning mb-3">
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="far fa-star"></i>
                            </div>
                            <a href="#" className="btn btn-outline-dark btn-sm">View Profile</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/* <!-- Testimonials Section --> */}
    <TestimonialSlider />

    {/* <!-- Call to Action --> */}
    <section className="py-5 bg-warning text-dark">
        <div className="container">
            <div className="row align-items-center">
                <div className="col-lg-8">
                    <h2 className="fw-bold mb-3">Ready to find your perfect property?</h2>
                    <p className="mb-lg-0">Join thousands of satisfied customers who found their dream home through our platform.</p>
                </div>
                <div className="col-lg-4 text-lg-end">
                  <Link to="/properties" className="btn btn-dark btn-lg px-4 me-2">Browse Properties</Link>
                  <Button 
                      variant="outline-dark" 
                      size="lg" 
                      className="px-4"
                      onClick={() => setShowListPropertyModal(true)}
                  >
                      List Property
                  </Button>
              </div>
            </div>
        </div>
    </section>

    {/* <!-- Contact Section --> */}
    <section id="contact" className="py-5 bg-light">
        <div className="container">
            <div className="row">
                <div className="col-lg-5">
                    <h2 className="fw-bold display-5 mb-4">Contact Us</h2>
                    <p className="text-muted mb-4">Have questions or need assistance? Reach out to our team and we'll be happy to help.</p>
                    <div className="divider bg-warning mb-4"></div>
                    
                    <div className="d-flex mb-4">
                        <div className="me-3 text-warning">
                            <i className="fas fa-map-marker-alt fa-2x"></i>
                        </div>
                        <div>
                            <h5 className="mb-1">Address</h5>
                            <p className="text-muted mb-0">123 Real Estate Ave, Suite 400<br/>New York, NY 10001</p>
                        </div>
                    </div>
                    
                    <div className="d-flex mb-4">
                        <div className="me-3 text-warning">
                            <i className="fas fa-phone-alt fa-2x"></i>
                        </div>
                        <div>
                            <h5 className="mb-1">Phone</h5>
                            <p className="text-muted mb-0">(212) 555-1234</p>
                        </div>
                    </div>
                    
                    <div className="d-flex mb-4">
                        <div className="me-3 text-warning">
                            <i className="fas fa-envelope fa-2x"></i>
                        </div>
                        <div>
                            <h5 className="mb-1">Email</h5>
                            <p className="text-muted mb-0">info@luxuryhomes.com</p>
                        </div>
                    </div>
                    
                    <div className="d-flex">
                        <div className="me-3 text-warning">
                            <i className="fas fa-clock fa-2x"></i>
                        </div>
                        <div>
                            <h5 className="mb-1">Working Hours</h5>
                            <p className="text-muted mb-0">Monday - Friday: 9am - 6pm<br/>Saturday: 10am - 4pm</p>
                        </div>
                    </div>
                </div>
                
                <div className="col-lg-7 mt-5 mt-lg-0">
                    <div className="card border-0 shadow">
                        <div className="card-body p-4 p-lg-5">
                            <h3 className="mb-4">Send Us a Message</h3>
                            <form>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label htmlFor="name" className="form-label">Your Name</label>
                                        <input type="text" className="form-control" id="name" required/>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="email" className="form-label">Your Email</label>
                                        <input type="email" className="form-control" id="email" required/>
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="subject" className="form-label">Subject</label>
                                        <input type="text" className="form-control" id="subject" required/>
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="message" className="form-label">Message</label>
                                        <textarea className="form-control" id="message" rows="5" required></textarea>
                                    </div>
                                    <div className="col-12">
                                        <button type="submit" className="btn btn-warning px-4 py-2 fw-bold">Send Message <i className="fas fa-paper-plane ms-2"></i></button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
      
    </Weblayout>
  );
}

export default Home;
