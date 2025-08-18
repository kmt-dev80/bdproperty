import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useModal } from '../context/ModalContext';
import TestimonialSlider from '../components/TestimonialSlider';
import axios from 'axios';
import Slider from 'react-slick';
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
  
  // Properties data state
  const [properties, setProperties] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch properties from backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        
        // Fetch all properties
        const response = await axios.get('http://localhost/api/properties/get_property.php?view_mode=public');
        
        if (response.data.success) {
          const transformedProperties = response.data.properties.map(property => {
            return {
              id: property.id,
              type: property.type,
              title: property.title,
              price: parseFloat(property.price),
              bedrooms: parseInt(property.bedrooms),
              bathrooms: parseInt(property.bathrooms),
              address: property.address,
              location: property.location,
              description: property.description,
              image: property.primary_image || 
                     (property.images && property.images.length > 0 ? property.images[0] : 
                     'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
              featured: property.featured,
              images: property.images || [],
              avg_rating: property.avg_rating,
              review_count: property.review_count
            };
          });
          
          setProperties(transformedProperties);
          
          // Set featured properties (those marked as featured or just the first few)
          const featured = transformedProperties
            .filter(property => property.featured)
            .slice(0, 6); // Limit to 6 featured properties
            
          // If not enough featured properties, add some regular ones
          if (featured.length < 6) {
            const regularProperties = transformedProperties
              .filter(property => !property.featured)
              .slice(0, 6 - featured.length);
            
            setFeaturedProperties([...featured, ...regularProperties]);
          } else {
            setFeaturedProperties(featured);
          }
        } else {
          setError(response.data.message || 'Failed to fetch properties');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching properties');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, []);
  
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
    
    // Build query parameters based on search form
    const params = new URLSearchParams();
    
    if (searchParams.location) {
      params.append('location', searchParams.location);
    }
    
    if (searchParams.propertyType !== 'Any Type') {
      params.append('type', searchParams.propertyType.toLowerCase());
    }
    
    // Add bedrooms parameter
    if (searchParams.bedrooms !== 'Any') {
      params.append('bedrooms', searchParams.bedrooms === '4+' ? '4' : searchParams.bedrooms);
    }
    
    // Add bathrooms parameter
    if (searchParams.bathrooms !== 'Any') {
      params.append('bathrooms', searchParams.bathrooms === '4+' ? '4' : searchParams.bathrooms);
    }
    
    // Add price range parameters
    if (searchParams.priceRange !== 'Any') {
      switch (searchParams.priceRange) {
        case '৳8000 - ৳15,000':
          params.append('minPrice', 8000);
          params.append('maxPrice', 15000);
          break;
        case '৳15,000 - ৳20,000':
          params.append('minPrice', 15000);
          params.append('maxPrice', 20000);
          break;
        case '৳20,000 - ৳30,000':
          params.append('minPrice', 20000);
          params.append('maxPrice', 30000);
          break;
        case '৳30,000+':
          params.append('minPrice', 30000);
          break;
      }
    }
    
    // Navigate to properties page with search parameters
    window.location.href = `/properties?৳{params.toString()}`;
  };
  
  // Filter properties based on both quick filter and search params
  const filteredProperties = featuredProperties.filter(property => {
    // First apply the quick filter (all/apartment/house/office)
    if (filter !== 'all' && property.type !== filter) {
      return false;
    }
    
    // Then apply search filters
    if (searchParams.location && 
        !property.address.toLowerCase().includes(searchParams.location.toLowerCase()) &&
        !property.location.toLowerCase().includes(searchParams.location.toLowerCase())) {
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
      
      if (range === '৳8,000 - ৳15,000' && (price < 8000 || price > 15000)) return false;
      if (range === '৳15,000 - ৳20,000' && (price < 15000 || price > 20000)) return false;
      if (range === '৳20,000 - ৳30,000' && (price < 20000 || price > 30000)) return false;
      if (range === '৳30,000+' && price < 30000) return false;
    }
    
    return true;
  });
  
  // Function to handle image loading errors
  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
  };
  
  // Settings for the react-slick carousel
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    cssEase: 'linear',
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false
        }
      }
    ]
  };
  
  // Carousel slides data
  const carouselSlides = [
    {
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      title: 'Modern Luxury Villas',
      description: 'Discover our exclusive collection of waterfront properties',
      buttonText: 'Explore Now'
    },
    {
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      title: 'Premium Family Homes',
      description: 'Spacious designs perfect for growing families',
      buttonText: 'View Listings'
    },
    {
      image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      title: 'Executive Office Spaces',
      description: 'Professional environments for business success',
      buttonText: 'Browse Offices'
    }
  ];
  
  // Function to get the appropriate badge for a property
  const getPropertyBadge = (property) => {
    if (property.featured) {
      return { text: 'Featured', className: 'bg-danger' };
    }
    
    if (property.type === 'house' || property.type === 'land') {
      return { text: 'Sale', className: 'bg-primary' };
    }
    
    return { text: 'New', className: 'bg-success' };
  };
  
  return (
    <>
      {/* Image Slider - Using react-slick */}
      <div className="property-carousel">
        <Slider {...carouselSettings}>
          {carouselSlides.map((slide, index) => (
            <div key={index} className="carousel-slide">
              <img src={slide.image} className="d-block w-100" alt={slide.title} />
              <div className="carousel-caption d-none d-md-block animate__animated animate__fadeInUp">
                <h2 className="display-4 fw-bold">{slide.title}</h2>
                <p className="lead">{slide.description}</p>
                <a href="#properties" className="btn btn-warning btn-lg mt-3">{slide.buttonText}</a>
              </div>
            </div>
          ))}
        </Slider>
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
                        <option>৳8000 - ৳15,000</option>
                        <option>৳15,000 - ৳20,000</option>
                        <option>৳20,000 - ৳30,000</option>
                        <option>৳30,000+</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn btn-warning w-100 py-3 fw-bold"
                        disabled={loading}
                      >
                        {loading ? 'Searching...' : 'Search Properties'} <i className="fas fa-search ms-2"></i>
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
          
          {/* Loading State */}
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading properties...</p>
            </div>
          )}
          
          {/* Error State */}
          {error && (
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Error Loading Properties</h4>
              <p>{error}</p>
              <button 
                className="btn btn-outline-danger"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          )}
          
          {/* No Properties Found */}
          {!loading && !error && featuredProperties.length === 0 && (
            <div className="text-center py-5">
              <i className="fas fa-home fa-3x text-muted mb-3"></i>
              <h3>No Properties Found</h3>
              <p className="text-muted">Please check back later for new listings.</p>
            </div>
          )}
                 
          {/* Properties Grid */}
          {!loading && !error && featuredProperties.length > 0 && (
            <div className="row g-4">
              {filteredProperties.map((property) => (
                <div key={property.id} className="col-md-6 col-lg-4 animate__animated animate__fadeInUp">
                  <div className="card property-card h-100 border-0 shadow overflow-hidden">
                    <div className="position-relative">
                      <img 
                        src={property.image} 
                        className="card-img-top" 
                        alt={property.title}
                        onError={handleImageError}
                        style={{height: '220px', objectFit: 'cover'}}
                      />
                      <div
                        className={`badge ${getPropertyBadge(property).className} position-absolute top-0 start-0 m-3`}
                      >
                        {getPropertyBadge(property).text}
                      </div>
                    </div>
                    <div className="card-body">
                      {/* Price and bedroom/bathroom info moved here */}
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        {/* Only show price if property type is not 'house' or 'land' */}
                        {property.type !== 'house' && property.type !== 'land' && (
                          <span className="fw-bold text-dark">Tk. {property.price.toLocaleString()}/mo</span>
                        )}
                        {/* Only show bedroom and bathroom icons if property type is not 'land' or 'store' */}
                        {property.type !== 'land' && property.type !== 'store' && property.type !== 'office' && (
                          <div>
                            <span className="me-2">
                              <i className="fas fa-bed me-1"></i> {property.bedrooms}
                            </span>
                            <span>
                              <i className="fas fa-bath me-1"></i> {property.bathrooms}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <h5 className="card-title">{property.title}</h5>
                      <p className="card-text text-muted mb-3">
                        <i className="fas fa-map-marker-alt text-danger me-1"></i> {property.address}
                      </p>
                      <p className="card-text truncate-description">{property.description}</p>
                      
                      {/* Display rating if available */}
                      {property.avg_rating > 0 && (
                        <div className="mb-2">
                          <div className="d-flex align-items-center">
                            <div className="text-warning me-2">
                              {[...Array(5)].map((_, i) => (
                                <i key={i} className={`fas fa-star${i < Math.floor(property.avg_rating) ? '' : (i < property.avg_rating ? '-half-alt' : '-o')}`}></i>
                              ))}
                            </div>
                            <span className="text-muted small">({property.review_count} reviews)</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <span className="badge bg-dark">
                          {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                        </span>
                        <Link 
                          to={`/property/${property.id}`}
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
          )}
          
          <div className="text-center mt-5">
            <Link to="/properties" className="btn btn-dark px-4 py-2">
              View All Properties <i className="fas fa-arrow-right ms-2"></i>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
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
      
      {/* Agents Section */}
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
      
      {/* Testimonials Section */}
      <TestimonialSlider />
      
      {/* Call to Action */}
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
      
      {/* Contact Section */}
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
    </>
  );
}
export default Home;