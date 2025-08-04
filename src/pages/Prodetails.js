import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Weblayout from '../layout/Weblayout';

function PropertyDetails() {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    tourDate: 'As soon as possible'
  });

  // Sample property data - in a real app, this would come from an API
  const property = {
    id: 1,
    type: 'apartment',
    title: 'Modern Apartment in Downtown',
    price: '$1,200/Month',
    bedrooms: 1,
    bathrooms: 1,
    size: '850 sq ft',
    yearBuilt: 2018,
    address: '123 Main St, New York, NY 10001',
    description: 'This beautiful modern apartment offers stunning city views and has been recently renovated with high-end finishes. Located in the heart of downtown, you\'ll have easy access to restaurants, shopping, and public transportation. The open-concept living area features large windows that flood the space with natural light. The kitchen comes equipped with stainless steel appliances and quartz countertops. The bedroom includes a walk-in closet and the bathroom has been updated with modern fixtures.',
    features: [
      'Central Air Conditioning',
      'Hardwood Floors',
      'Walk-in Closet',
      'Balcony',
      'In-unit Laundry',
      'Dishwasher',
      'Gym Access',
      '24/7 Security'
    ],
    amenities: [
      { icon: 'utensils', text: 'Restaurants: 2 min walk' },
      { icon: 'subway', text: 'Subway: 5 min walk' },
      { icon: 'shopping-bag', text: 'Shopping: 3 min walk' },
      { icon: 'parking', text: 'Parking Garage: 1 min walk' }
    ],
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
    ],
    agent: {
      name: 'Sarah Johnson',
      title: 'Senior Agent',
      phone: '(212) 555-7890',
      email: 'sarah@luxuryhomes.com',
      availability: 'Available 9am-6pm',
      rating: 4.5,
      image: 'https://randomuser.me/api/portraits/women/32.jpg'
    },
    similarProperties: [
      {
        id: 2,
        title: 'Downtown Loft Apartment',
        price: '$1,350/',
        bedrooms: 2,
        bathrooms: 1,
        address: '456 Broadway, New York, NY',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        type: 'apartment'
      },
      {
        id: 3,
        title: 'Luxury Studio Apartment',
        price: '$1,500/',
        bedrooms: 2,
        bathrooms: 2,
        address: '789 Park Ave, New York, NY',
        image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        type: 'apartment',
        isNew: true
      },
      {
        id: 4,
        title: 'Cozy City Apartment',
        price: '$1,100/',
        bedrooms: 1,
        bathrooms: 1,
        address: '321 5th Ave, New York, NY',
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        type: 'apartment'
      }
    ]
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log('Tour request submitted:', formData);
    alert('Tour request submitted successfully! We will contact you shortly.');
  };

  const toggleSave = () => {
    setSaved(!saved);
    // In a real app, you would update this in the user's profile
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
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
  if (!property) return <div>Property not found</div>;

  return (
    <Weblayout>
      
      {/* Property Header */}
      <section className="property-header bg-light py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                  <li className="breadcrumb-item"><Link to="/properties">Properties</Link></li>
                  <li className="breadcrumb-item active" aria-current="page">{property.title}</li>
                </ol>
              </nav>
              <h1 className="display-5 fw-bold mb-3">{property.title}</h1>
              <p className="lead text-muted mb-4">
                <i className="fas fa-map-marker-alt text-danger me-2"></i>{property.address}
              </p>
              <div className="d-flex align-items-center mb-4">
                <div className="me-4">
                  <span className="badge bg-warning text-dark fs-6 px-3 py-2">For Rent</span>
                </div>
                <div className="text-warning me-3">
                  {renderStars(property.agent.rating)}
                  <span className="text-dark ms-1">{property.agent.rating.toFixed(1)} (28 reviews)</span>
                </div>
              </div>
            </div>
            <div className="col-lg-4 text-lg-end">
              <h2 className="text-primary fw-bold mb-3">
                {property.price} <small className="text-muted fs-6 fw-normal"></small>
              </h2>
              <button 
                className="btn btn-primary btn-lg me-2"
                data-bs-toggle="modal" 
                data-bs-target="#contactAgentModal"
              >
                <i className="fas fa-phone-alt me-2"></i>Contact Agent
              </button>
              <button 
                className={`btn ${saved ? 'btn-primary' : 'btn-outline-primary'} btn-lg`}
                onClick={toggleSave}
              >
                <i className={`${saved ? 'fas' : 'far'} fa-heart me-2`}></i>
                {saved ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Property Gallery */}
      <section className="property-gallery py-4 bg-white">
        <div className="container">
          <div className="row g-3">
            <div className="col-md-8">
              <img 
                src={property.images[activeImage]} 
                className="img-fluid rounded-3 shadow-sm w-100" 
                alt="Main property view"
                style={{ height: '500px', objectFit: 'cover' }}
              />
            </div>
            <div className="col-md-4">
              <div className="row g-3">
                {property.images.slice(0, 4).map((img, index) => (
                  <div className="col-6" key={index}>
                    <div 
                      className={`property-thumbnail ${activeImage === index ? 'active' : ''}`}
                      onClick={() => setActiveImage(index)}
                    >
                      <img 
                        src={img} 
                        className="img-fluid rounded-3 shadow-sm w-100" 
                        alt={`Property view ${index + 1}`}
                        style={{ height: '120px', objectFit: 'cover', cursor: 'pointer' }}
                      />
                    </div>
                  </div>
                ))}
                <div className="col-6 position-relative">
                  <div 
                    className="property-thumbnail"
                    onClick={() => setActiveImage(4)}
                  >
                    <img 
                      src={property.images[4]} 
                      className="img-fluid rounded-3 shadow-sm w-100" 
                      alt="Property view 5"
                      style={{ height: '120px', objectFit: 'cover', cursor: 'pointer' }}
                    />
                    <button className="btn btn-primary position-absolute bottom-0 end-0 m-3 rounded-circle" style={{ width: '40px', height: '40px' }}>
                      +{property.images.length - 4}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Details */}
      <section className="property-details py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              {/* Description Card */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                  <h3 className="card-title fw-bold mb-4">Description</h3>
                  <p className="card-text">{property.description}</p>
                </div>
              </div>

              {/* Features Card */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                  <h3 className="card-title fw-bold mb-4">Features</h3>
                  <div className="row">
                    <div className="col-md-6">
                      <ul className="list-unstyled">
                        {property.features.slice(0, 4).map((feature, index) => (
                          <li className="mb-2" key={index}>
                            <i className="fas fa-check text-primary me-2"></i>{feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <ul className="list-unstyled">
                        {property.features.slice(4).map((feature, index) => (
                          <li className="mb-2" key={index}>
                            <i className="fas fa-check text-primary me-2"></i>{feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floor Plan Card */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                  <h3 className="card-title fw-bold mb-4">Floor Plan</h3>
                  <img 
                    src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                    alt="Floor Plan" 
                    className="img-fluid rounded-3 w-100"
                  />
                </div>
              </div>

              {/* Location Card */}
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h3 className="card-title fw-bold mb-4">Location</h3>
                  <div className="ratio ratio-16x9 mb-4">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215209179042!2d-73.987844924239!3d40.74844097138996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1689877740724!5m2!1sen!2sus" 
                      allowFullScreen="" 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                  <h5 className="mb-3">Nearby Amenities</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <ul className="list-unstyled">
                        {property.amenities.slice(0, 2).map((amenity, index) => (
                          <li className="mb-2" key={index}>
                            <i className={`fas fa-${amenity.icon} text-primary me-2`}></i>{amenity.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <ul className="list-unstyled">
                        {property.amenities.slice(2).map((amenity, index) => (
                          <li className="mb-2" key={index}>
                            <i className={`fas fa-${amenity.icon} text-primary me-2`}></i>{amenity.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              {/* Tour Request Card */}
              <div className="card border-0 shadow-sm mb-4 sticky-top" style={{ top: '20px' }}>
                <div className="card-body">
                  <h4 className="card-title fw-bold mb-4">Request a Tour</h4>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Your Name" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input 
                        type="email" 
                        className="form-control" 
                        placeholder="Your Email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input 
                        type="tel" 
                        className="form-control" 
                        placeholder="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-3">
                      <textarea 
                        className="form-control" 
                        rows="3" 
                        placeholder="Message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <select 
                        className="form-select"
                        name="tourDate"
                        value={formData.tourDate}
                        onChange={handleInputChange}
                      >
                        <option value="As soon as possible">As soon as possible</option>
                        <option value="Within a week">Within a week</option>
                        <option value="Within a month">Within a month</option>
                      </select>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Schedule Tour</button>
                  </form>
                </div>
              </div>

              {/* Property Details Card */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                  <h4 className="card-title fw-bold mb-4">Property Details</h4>
                  <ul className="list-unstyled">
                    <li className="d-flex justify-content-between py-2 border-bottom">
                      <span className="text-muted">Property ID</span>
                      <span>LH-{property.id.toString().padStart(4, '0')}</span>
                    </li>
                    <li className="d-flex justify-content-between py-2 border-bottom">
                      <span className="text-muted">Price</span>
                      <span>{property.price}</span>
                    </li>
                    <li className="d-flex justify-content-between py-2 border-bottom">
                      <span className="text-muted">Property Size</span>
                      <span>{property.size}</span>
                    </li>
                    <li className="d-flex justify-content-between py-2 border-bottom">
                      <span className="text-muted">Bedrooms</span>
                      <span>{property.bedrooms}</span>
                    </li>
                    <li className="d-flex justify-content-between py-2 border-bottom">
                      <span className="text-muted">Bathrooms</span>
                      <span>{property.bathrooms}</span>
                    </li>
                    <li className="d-flex justify-content-between py-2 border-bottom">
                      <span className="text-muted">Garage</span>
                      <span>1</span>
                    </li>
                    <li className="d-flex justify-content-between py-2 border-bottom">
                      <span className="text-muted">Year Built</span>
                      <span>{property.yearBuilt}</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Contact Agent Card */}
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h4 className="card-title fw-bold mb-4">Contact Agent</h4>
                  <div className="d-flex mb-4">
                    <img 
                      src={property.agent.image} 
                      className="rounded-circle me-3" 
                      width="60" 
                      height="60" 
                      alt={property.agent.name}
                    />
                    <div>
                      <h5 className="mb-1">{property.agent.name}</h5>
                      <p className="text-muted mb-1">{property.agent.title}</p>
                      <div className="text-warning">
                        {renderStars(property.agent.rating)}
                      </div>
                    </div>
                  </div>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <i className="fas fa-phone-alt text-primary me-2"></i> {property.agent.phone}
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-envelope text-primary me-2"></i> {property.agent.email}
                    </li>
                    <li>
                      <i className="fas fa-clock text-primary me-2"></i> {property.agent.availability}
                    </li>
                  </ul>
                  <button 
                    className="btn btn-outline-primary w-100 mt-3"
                    data-bs-toggle="modal" 
                    data-bs-target="#chatAgentModal"
                  >
                    <i className="fas fa-comment me-2"></i>Chat Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Properties */}
      <section className="similar-properties py-5 bg-white">
        <div className="container">
          <h2 className="fw-bold mb-5">Similar Properties</h2>
          <div className="row g-4">
            {property.similarProperties.map(similar => (
              <div className="col-md-6 col-lg-4" key={similar.id}>
                <div className="card property-card h-100 border-0 shadow-sm">
                  <div className="position-relative">
                    <img 
                      src={similar.image} 
                      className="card-img-top" 
                      alt={similar.title}
                      style={{ height: '220px', objectFit: 'cover' }}
                    />
                    {similar.isNew && (
                      <div className="badge bg-success position-absolute top-0 start-0 m-3">New</div>
                    )}
                    <div className="position-absolute bottom-0 start-0 end-0 p-3 bg-gradient">
                      <div className="d-flex justify-content-between text-white">
                        <span className="fw-bold">{similar.price}</span>
                        <div>
                          <span className="me-2">
                            <i className="fas fa-bed me-1"></i> {similar.bedrooms}
                          </span>
                          <span>
                            <i className="fas fa-bath me-1"></i> {similar.bathrooms}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{similar.title}</h5>
                    <p className="card-text text-muted mb-3">
                      <i className="fas fa-map-marker-alt text-danger me-1"></i> {similar.address}
                    </p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className="badge bg-dark">
                        {similar.type.charAt(0).toUpperCase() + similar.type.slice(1)}
                      </span>
                      <Link 
                        to={`/property/${similar.id}`} 
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
        </div>
      </section>

      {/* Contact Agent Modal */}
      <div className="modal fade" id="contactAgentModal" tabIndex="-1" aria-labelledby="contactAgentModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold" id="contactAgentModalLabel">Contact Agent</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Your Name</label>
                  <input type="text" className="form-control" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Your Email</label>
                  <input type="email" className="form-control" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <input type="tel" className="form-control" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Message</label>
                  <textarea className="form-control" rows="3"></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-100">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Agent Modal */}
      <div className="modal fade" id="chatAgentModal" tabIndex="-1" aria-labelledby="chatAgentModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold" id="chatAgentModalLabel">Chat with {property.agent.name}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="chat-container" style={{ height: '300px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '8px', padding: '15px', marginBottom: '15px' }}>
                <div className="text-center text-muted py-5">
                  <i className="fas fa-comments fa-3x mb-3"></i>
                  <p>Start your conversation with {property.agent.name}</p>
                </div>
              </div>
              <div className="input-group">
                <input type="text" className="form-control" placeholder="Type your message..." />
                <button className="btn btn-primary" type="button">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Weblayout>
  );
}

export default PropertyDetails;