import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Properties() {
  // State for filters
  const [filterType, setFilterType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterPrice, setFilterPrice] = useState('all');
  const [sortOption, setSortOption] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 12;
  
  // State for properties data
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch properties from backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        
        // Build query parameters based on current filters
        const params = new URLSearchParams();
        if (filterType !== 'all') params.append('type', filterType);
        if (filterLocation !== 'all') params.append('location', filterLocation);
        
        // Add price range parameters
        if (filterPrice !== 'all') {
          switch (filterPrice) {
            case '0-1000':
              params.append('minPrice', 0);
              params.append('maxPrice', 1000);
              break;
            case '1000-2500':
              params.append('minPrice', 1000);
              params.append('maxPrice', 2500);
              break;
            case '2500-5000':
              params.append('minPrice', 2500);
              params.append('maxPrice', 5000);
              break;
            case '5000+':
              params.append('minPrice', 5000);
              break;
          }
        }
        
        // Add sort parameter
        params.append('sort', sortOption);
        
        const response = await axios.get(`http://localhost/api/properties/get_property.php?${params.toString()}`);
        
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
              image: property.primary_image || 
                     (property.images && property.images.length > 0 ? property.images[0] : 
                     'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
              featured: property.featured,
              description: property.description,
              images: property.images || [],
              avg_rating: property.avg_rating,
              review_count: property.review_count
            };
          });
          
          setProperties(transformedProperties);
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
  }, [filterType, filterLocation, filterPrice, sortOption]);
  
  // Pagination logic
  const totalPages = Math.ceil(properties.length / propertiesPerPage);
  const startIndex = (currentPage - 1) * propertiesPerPage;
  const paginatedProperties = properties.slice(startIndex, startIndex + propertiesPerPage);
  
  // Handle filter submission
  const handleFilter = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on filter change
  };
  
  // Handle pagination
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  // Get unique locations for filter dropdown
  const locations = [...new Set(properties.map(property => property.location))];
  
  // Function to handle image loading errors
  const handleImageError = (e, propertyId) => {
    e.target.src = 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
  };
  
  return (
    <>
      {/* <!-- Property Listing Header --> */}
      <section className="property-listing-header bg-dark text-white py-5">
        <div className="container py-5">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h1 className="display-4 fw-bold mb-3">Browse Our Properties</h1>
              <p className="lead mb-4">Discover your perfect home from our premium collection</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Property Filter Section */}
      <section className="property-filter bg-light py-4">
        <div className="container">
          <div className="row g-3">
            <div className="col-md-3">
              <select
                className="form-select"
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">Property Type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="office">Office</option>
                <option value="store">Store</option>
                <option value="land">Land</option>
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filterLocation}
                onChange={(e) => {
                  setFilterLocation(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">Location</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filterPrice}
                onChange={(e) => {
                  setFilterPrice(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">Price Range</option>
                <option value="0-1000">$0 - $1,000</option>
                <option value="1000-2500">$1,000 - $2,500</option>
                <option value="2500-5000">$2,500 - $5,000</option>
                <option value="5000+">$5,000+</option>
              </select>
            </div>
            <div className="col-md-3">
              <button className="btn btn-warning w-100" onClick={handleFilter}>
                Filter Properties
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Property Grid Section */}
      <section className="property-grid py-5">
        <div className="container">
          <div className="row mb-4">
            <div className="col-md-6">
              <h3 className="fw-bold">
                {loading ? 'Loading properties...' : `Showing ${properties.length} Properties`}
              </h3>
            </div>
            <div className="col-md-6 text-md-end">
              <select
                className="form-select d-inline-block w-auto"
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="newest">Sort by: Newest</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
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
          {!loading && !error && properties.length === 0 && (
            <div className="text-center py-5">
              <i className="fas fa-home fa-3x text-muted mb-3"></i>
              <h3>No Properties Found</h3>
              <p className="text-muted">Try adjusting your filters to see more results.</p>
            </div>
          )}
          
          {/* Properties Grid */}
          {!loading && !error && properties.length > 0 && (
            <div className="row g-4">
              {paginatedProperties.map((property, index) => (
                <div
                  key={property.id}
                  className={`col-md-6 col-lg-4 animate__animated animate__fadeInUp animate__delay-${index % 3}s`}
                >
                  <div className="card property-card h-100 border-0 shadow overflow-hidden">
                    <div className="position-relative">
                      <img 
                        src={property.image} 
                        className="card-img-top" 
                        alt={property.title}
                        onError={(e) => handleImageError(e, property.id)}
                        style={{height: '200px', objectFit: 'cover'}}
                      />
                      <div
                        className={`badge bg-${property.featured ? 'danger' : 'success'} position-absolute top-0 start-0 m-3`}
                      >
                        {property.featured ? 'Featured' : 'New'}
                      </div>
                      <div className="position-absolute bottom-0 start-0 end-0 p-3 bg-gradient">
                        <div className="d-flex justify-content-between text-white">
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
          
          {/* Pagination */}
          {!loading && !error && properties.length > 0 && (
            <nav className="mt-5">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                {[...Array(totalPages)].map((_, index) => (
                  <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </section>
    </>
  );
}

export default Properties;