import React, { useState} from 'react';
import { Link } from 'react-router-dom';

function Properties() {
  // State for filters
  const [filterType, setFilterType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterPrice, setFilterPrice] = useState('all');
  const [sortOption, setSortOption] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 12;

  // Sample property data (replace with API call in a real application)
  const properties = [
    {
      id: 1,
      type: 'apartment',
      title: 'Modern Apartment in Downtown',
      price: 1200,
      bedrooms: 3,
      bathrooms: 2,
      address: '123 Main St, New York, NY',
      location: 'New York',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: true,
      description: 'Beautiful modern apartment with stunning city views. Recently renovated with high-end finishes.',
      dateAdded: new Date('2025-07-01'),
      popularity: 90,
    },
    {
      id: 2,
      type: 'house',
      title: 'Spacious Family House',
      price: 2500,
      bedrooms: 4,
      bathrooms: 3,
      address: '456 Oak Ave, Brooklyn, NY',
      location: 'New York',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false,
      description: 'Lovely family home with large backyard and modern kitchen. Perfect for family gatherings.',
      dateAdded: new Date('2025-06-15'),
      popularity: 85,
    },
    {
      id: 3,
      type: 'office',
      title: 'Luxury Office Space',
      price: 3200,
      bedrooms: 2,
      bathrooms: 2,
      address: '789 Business Blvd, Manhattan, NY',
      location: 'New York',
      image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: true,
      description: 'Premium office space in the heart of the business district. Includes conference rooms and reception area.',
      dateAdded: new Date('2025-07-20'),
      popularity: 95,
    },
    {
      id: 4,
      type: 'villa',
      title: 'Luxury Villa by the Beach',
      price: 5000,
      bedrooms: 5,
      bathrooms: 4,
      address: '101 Ocean Dr, Miami, FL',
      location: 'Miami',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false,
      description: 'Stunning villa with ocean views and private pool.',
      dateAdded: new Date('2025-05-01'),
      popularity: 80,
    },
    {
      id: 5,
      type: 'house',
      title: 'Luxury Villa with Pool',
      price: 4500,
      bedrooms: 3,
      bathrooms: 3,
      address: '200 Ocean Drive, Miami, FL',
      location: 'Miami',
      description: 'Stunning contemporary villa with private pool, ocean views, and premium amenities.',
      image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: true,
      dateAdded: new Date('2025-04-05'),
      popularity: 70,
    },
  {
      id: 6,
      type: 'apartment',
      title: 'Penthouse with Panoramic Views',
      price: 3800,
      bedrooms: 3,
      bathrooms: 3,
      address: '500 Skyline Blvd, Chicago, IL',
      location: 'Chicago',
      description: 'Luxurious penthouse offering breathtaking city views, high ceilings, and designer finishes.',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: true,
      dateAdded: new Date('2025-06-07'),
      popularity: 60,
    },
    {
      id: 7,
      type: 'office',
      title: 'Creative Co-Working Space',
      price: 1800,
      bedrooms: 2,
      bathrooms: 2,
      address: '300 Innovation Way, Austin, TX',
      location: 'Austin',
      description: 'Modern co-working space with flexible workstations, meeting rooms, and lounge areas.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false,
      dateAdded: new Date('2025-07-05'),
      popularity: 85,
    },
    {
      id: 8,
      type: 'house',
      title: 'Charming Cottage',
      price: 1600,
      bedrooms: 2,
      bathrooms: 1,
      address: '700 Garden St, Portland, OR',
      location: 'Portland',
      description: 'Quaint cottage with beautiful garden, vintage charm, and modern comforts.',
      image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false,
      dateAdded: new Date('2025-05-09'),
      popularity: 50,
    },
    {
      id: 9,
      type: 'apartment',
      title: 'Luxury Waterfront Apartment',
      price: 2800,
      bedrooms: 2,
      bathrooms: 2,
      address: '800 Bayview Dr, San Francisco, CA',
      location: 'San Francisco',
      description: 'Elegant apartment with waterfront views, gourmet kitchen, and access to premium amenities.',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: true,
      dateAdded: new Date('2025-06-02'),
      popularity: 87,
    }
  ];

  // Filter properties
  const filteredProperties = properties.filter((property) => {
    const matchesType = filterType === 'all' || property.type === filterType;
    const matchesLocation = filterLocation === 'all' || property.location === filterLocation;
    const matchesPrice =
      filterPrice === 'all' ||
      (filterPrice === '0-1000' && property.price <= 1000) ||
      (filterPrice === '1000-2500' && property.price > 1000 && property.price <= 2500) ||
      (filterPrice === '2500-5000' && property.price > 2500 && property.price <= 5000) ||
      (filterPrice === '5000+' && property.price > 5000);
    return matchesType && matchesLocation && matchesPrice;
  });

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortOption === 'newest') {
      return b.dateAdded - a.dateAdded;
    } else if (sortOption === 'price-low-high') {
      return a.price - b.price;
    } else if (sortOption === 'price-high-low') {
      return b.price - a.price;
    } else if (sortOption === 'popular') {
      return b.popularity - a.popularity;
    }
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedProperties.length / propertiesPerPage);
  const startIndex = (currentPage - 1) * propertiesPerPage;
  const paginatedProperties = sortedProperties.slice(startIndex, startIndex + propertiesPerPage);

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
                <option value="New York">New York</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="Chicago">Chicago</option>
                <option value="Miami">Miami</option>
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
              <h3 className="fw-bold">Showing {filteredProperties.length} Properties</h3>
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

          <div className="row g-4">
            {paginatedProperties.map((property, index) => (
              <div
                key={property.id}
                className={`col-md-6 col-lg-4 animate__animated animate__fadeInUp animate__delay-${index % 3}s`}
              >
                <div className="card property-card h-100 border-0 shadow overflow-hidden">
                  <div className="position-relative">
                    <img src={property.image} className="card-img-top" alt={property.title} />
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

          {/* Pagination */}
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
        </div>
      </section>
    </>
  );
}

export default Properties;