import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import Weblayout from '../layout/Weblayout';
import { useModal } from '../context/ModalContext';

function PropertyDetails() {
  const { id } = useParams();
  const { openListPropertyModal } = useModal();
  const [activeImage, setActiveImage] = useState(0);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [userReview, setUserReview] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});
  
  // Add state for modals
  const [showContactModal, setShowContactModal] = useState(false);
  const [showTourModal, setShowTourModal] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    tourDate: 'As soon as possible'
  });
  
  // Update the renderStars function to handle icon classes properly
  const renderAmenityIcon = (iconClass) => {
    // If the icon class already has 'fa-', use it directly
    // Otherwise, add 'fa-' prefix
    const fullIconClass = iconClass.startsWith('fa-') ? iconClass : `fa-${iconClass}`;
    return `fas ${fullIconClass}`;
  };
  
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  // Check if user is logged in and extract user ID and email from token and user data
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setIsLoggedIn(true);
        
        // Extract user ID from token (format: luxury-homes-token-{id}-{type})
        const tokenParts = token.split('-');
        if (tokenParts.length >= 4 && tokenParts[0] === 'luxury' && tokenParts[1] === 'homes' && tokenParts[2] === 'token') {
          const userId = tokenParts[3];
          setCurrentUserId(userId);
          console.log("Extracted user ID from token:", userId);
          
          // Get user email from user data
          if (user && user.email) {
            setCurrentUserEmail(user.email.toLowerCase()); // Convert to lowercase for case-insensitive comparison
            console.log("User email from localStorage:", user.email);
          }
          
          // Update debug info
          setDebugInfo(prev => ({
            ...prev,
            token: token,
            tokenParts: tokenParts,
            extractedUserId: userId,
            userData: user,
            userEmail: user ? user.email : null
          }));
        }
      } catch (e) {
        console.error("Error parsing user data:", e);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
  }, []);
  
  // Fetch property details and reviews
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Use the correct API endpoint for getting a single property
        const response = await axios.get(`http://localhost/api/properties/get.php?id=${id}`);
        
        console.log('Full API Response:', response.data); // Debug log
        
        // Fixed condition to match actual API response structure
        if (response.data && response.data.success === true) {
          // The API returns an object with success and data properties
          const propertyData = response.data.data;
          console.log('Property data:', propertyData); // Debug log
          
          setProperty(propertyData);
          
          // Set reviews from the property data
          setReviews(propertyData.reviews || []);
          setAverageRating(propertyData.avg_rating || 0);
          setTotalReviews(propertyData.total_reviews || 0);
          
          // Update debug info with property data
          setDebugInfo(prev => ({
            ...prev,
            propertyData: propertyData,
            propertyOwnerEmail: propertyData.owner_email
          }));
          
          // Check if current user is the owner using email comparison
          if (currentUserEmail && propertyData && propertyData.owner_email) {
            console.log("Current user email:", currentUserEmail);
            console.log("Property owner email:", propertyData.owner_email);
            
            // Convert both to lowercase for case-insensitive comparison
            if (currentUserEmail === propertyData.owner_email.toLowerCase()) {
              console.log("User is the owner (email match)");
              setIsOwner(true);
            } else {
              console.log("User is not the owner");
              console.log("Email comparison:", currentUserEmail, "===", propertyData.owner_email.toLowerCase(), currentUserEmail === propertyData.owner_email.toLowerCase());
            }
          } else {
            console.log("No user email or property owner email found");
            console.log("currentUserEmail:", currentUserEmail);
            console.log("propertyData.owner_email:", propertyData ? propertyData.owner_email : "propertyData is undefined");
          }
        } else {
          setError('Failed to fetch property details');
          console.error('API Error:', response.data);
        }
      } catch (err) {
        console.error('Error fetching property details:', err);
        setError('Failed to fetch property details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchPropertyDetails();
    }
  }, [id, currentUserEmail]);
  
  // Debug logging for isOwner state
  useEffect(() => {
    console.log("isOwner state updated:", isOwner);
    setDebugInfo(prev => ({
      ...prev,
      isOwner: isOwner
    }));
  }, [isOwner]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost/api/message/tour-request.php', {
        propertyId: id,
        ...formData
      });
      
      if (response.data && response.data.success === true) {
        alert(`Tour request submitted successfully! We will contact you shortly.\n\nProperty: ${response.data.property_title}\nOwner: ${response.data.owner_name}`);
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          tourDate: 'As soon as possible'
        });
        setShowTourModal(false); // Close the modal after submission
      } else {
        alert('Failed to submit tour request: ' + response.data.message);
      }
    } catch (err) {
      console.error('Error submitting tour request:', err);
      alert('Failed to submit tour request. Please try again.');
    }
  };
  
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      alert('Please log in to submit a review.');
      return;
    }
    
    try {
      const response = await axios.post('http://localhost/api/reviews/add.php', {
        property_id: id,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      
      if (response.data && response.data.success === true) {
        alert('Review submitted successfully!');
        setReviewForm({
          rating: 5,
          comment: ''
        });
        setShowReviewForm(false);
        
        // Refresh reviews
        const reviewsResponse = await axios.get(`http://localhost/api/reviews/get.php?property_id=${id}`);
        
        if (reviewsResponse.data && reviewsResponse.data.success === true) {
          setReviews(reviewsResponse.data.reviews);
          setAverageRating(reviewsResponse.data.average_rating);
          setTotalReviews(reviewsResponse.data.total_reviews);
        }
      } else {
        alert('Failed to submit review: ' + response.data.message);
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review. Please try again.');
    }
  };
  
  const toggleSave = () => {
    setSaved(!saved);
    // In a real app, you would update this in the user's profile
  };
  
  const handleDeleteProperty = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('You must be logged in to delete a property');
        return;
      }
      
      const response = await axios.post(
        'http://localhost/api/properties/delete_property.php',
        { property_id: id },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        alert('Property deleted successfully!');
        // Redirect to properties page
        window.location.href = '/properties';
      } else {
        alert('Failed to delete property: ' + response.data.message);
      }
    } catch (err) {
      console.error('Error deleting property:', err);
      alert('Failed to delete property: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };
  
  const renderStars = (rating, interactive = false, size = 'normal') => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    const sizeClass = size === 'small' ? 'fs-6' : 'fs-5';
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <i 
            key={i} 
            className={`fas fa-star ${interactive ? 'text-warning cursor-pointer' : 'text-warning'} ${sizeClass}`}
            onClick={interactive ? () => setReviewForm({...reviewForm, rating: i}) : undefined}
          ></i>
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <i 
            key={i} 
            className={`fas fa-star-half-alt ${interactive ? 'text-warning cursor-pointer' : 'text-warning'} ${sizeClass}`}
            onClick={interactive ? () => setReviewForm({...reviewForm, rating: i}) : undefined}
          ></i>
        );
      } else {
        stars.push(
          <i 
            key={i} 
            className={`far fa-star ${interactive ? 'text-warning cursor-pointer' : 'text-warning'} ${sizeClass}`}
            onClick={interactive ? () => setReviewForm({...reviewForm, rating: i}) : undefined}
          ></i>
        );
      }
    }
    
    return stars;
  };
  
  if (loading) {
    return (
      <Weblayout>
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading property details...</p>
          </div>
        </div>
      </Weblayout>
    );
  }
  
  if (error || !property) {
    return (
      <Weblayout>
        <div className="container py-5">
          <div className="alert alert-danger" role="alert">
            {error || 'Property not found'}
          </div>
          <Link to="/properties" className="btn btn-primary">
            Back to Properties
          </Link>
        </div>
      </Weblayout>
    );
  }
  
  return (
    <Weblayout>
      {/* Property Header */}
      <section className="property-header bg-dark text-white py-5 position-relative overflow-hidden">
        <div className="container position-relative z-10">
          <div className="row">
            <div className="col-lg-8">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/" className="text-white-50">Home</Link></li>
                  <li className="breadcrumb-item"><Link to="/properties" className="text-white-50">Properties</Link></li>
                  <li className="breadcrumb-item active text-white" aria-current="page">{property.title}</li>
                </ol>
              </nav>
              <h1 className="display-4 fw-bold mb-3">{property.title}</h1>
              <p className="lead mb-4">
                <i className="fas fa-map-marker-alt text-warning me-2"></i>{property.address}
              </p>
              <div className="d-flex align-items-center flex-wrap">
                <div className="me-4 mb-3">
                  <span className="badge bg-warning text-dark fs-6 px-3 py-2">For Rent</span>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <div className="text-warning me-3">
                    {renderStars(averageRating)}
                    <span className="text-white ms-1">{averageRating} ({totalReviews} reviews)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-3 p-4">
                <h2 className="text-white fw-bold mb-3">
                  ${property.price.toLocaleString()}/mo
                </h2>
                <div className="d-grid gap-2">
                  {/* Debug info panel */}
                  <div className="bg-dark bg-opacity-50 p-2 rounded mb-2">
                    <div className="text-white small">
                      <div>isOwner: {isOwner.toString()}</div>
                      <div>currentUserEmail: {currentUserEmail || 'N/A'}</div>
                      <div>propertyOwnerEmail: {property.owner_email || 'N/A'}</div>
                    </div>
                  </div>
                  
                  {isOwner && (
                    <div className="d-flex gap-2 mb-2">
                      <button 
                        className="btn btn-outline-warning fw-bold flex-grow-1"
                        onClick={() => openListPropertyModal(property)}
                      >
                        <i className="fas fa-edit me-2"></i>Edit Property
                      </button>
                      <button 
                        className={`btn ${showDeleteConfirm ? 'btn-danger' : 'btn-outline-danger'} fw-bold`}
                        onClick={handleDeleteProperty}
                      >
                        <i className="fas fa-trash-alt me-2"></i>
                        {showDeleteConfirm ? 'Confirm Delete' : 'Delete'}
                      </button>
                    </div>
                  )}
                  
                  <button 
                    className="btn btn-warning fw-bold"
                    onClick={() => setShowContactModal(true)}
                  >
                    <i className="fas fa-phone-alt me-2"></i>Contact Agent
                  </button>
                  <button 
                    className={`btn ${saved ? 'btn-primary' : 'btn-outline-light'} fw-bold`}
                    onClick={toggleSave}
                  >
                    <i className={`${saved ? 'fas' : 'far'} fa-heart me-2`}></i>
                    {saved ? 'Saved' : 'Save Property'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="position-absolute top-0 end-0 w-50 h-100 bg-gradient-to-l from-transparent via-transparent to-black opacity-20"></div>
      </section>
      
      {/* Property Gallery */}
      {property.images && property.images.length > 0 && (
        <section className="property-gallery py-4 bg-white">
          <div className="container">
            <div className="row g-3">
              <div className="col-md-8">
                <div className="position-relative overflow-hidden rounded-3 shadow-lg">
                  <img 
                    src={property.images[activeImage]} 
                    className="img-fluid w-100" 
                    alt="Main property view"
                    style={{ height: '500px', objectFit: 'cover' }}
                  />
                  <div className="position-absolute bottom-0 start-0 end-0 p-3 bg-gradient-to-t from-black to-transparent">
                    <div className="d-flex justify-content-between text-white">
                      <span className="fw-bold fs-5">${property.price.toLocaleString()}/mo</span>
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
              </div>
              <div className="col-md-4">
                <div className="row g-3">
                  {property.images.slice(0, 4).map((img, index) => (
                    <div className="col-6" key={index}>
                      <div 
                        className={`property-thumbnail overflow-hidden rounded-3 ${activeImage === index ? 'active' : ''}`}
                        onClick={() => setActiveImage(index)}
                      >
                        <img 
                          src={img} 
                          className="img-fluid w-100 h-100 object-cover transition-transform duration-300 hover-scale-110" 
                          alt={`Property view ${index + 1}`}
                          style={{ height: '120px', cursor: 'pointer' }}
                        />
                      </div>
                    </div>
                  ))}
                  {property.images.length > 4 && (
                    <div className="col-6 position-relative">
                      <div 
                        className="property-thumbnail overflow-hidden rounded-3"
                        onClick={() => setActiveImage(4)}
                      >
                        <img 
                          src={property.images[4]} 
                          className="img-fluid w-100 h-100 object-cover transition-transform duration-300 hover-scale-110" 
                          alt="Property view 5"
                          style={{ height: '120px', objectFit: 'cover', cursor: 'pointer' }}
                        />
                        <div className="position-absolute top-0 start-0 w-100 h-100 bg-black bg-opacity-50 d-flex align-items-center justify-content-center rounded-3">
                          <span className="text-white fw-bold">+{property.images.length - 4}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Property Quick Info */}
      <section className="property-quick-info py-4 bg-light">
        <div className="container">
          <div className="row g-4">
            <div className="col-6 col-md-3">
              <div className="bg-white rounded-3 p-4 text-center h-100 shadow-sm">
                <div className="text-primary fs-2 mb-2">
                  <i className="fas fa-bed"></i>
                </div>
                <h5 className="mb-1">Bedrooms</h5>
                <p className="mb-0 fw-bold">{property.bedrooms}</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="bg-white rounded-3 p-4 text-center h-100 shadow-sm">
                <div className="text-primary fs-2 mb-2">
                  <i className="fas fa-bath"></i>
                </div>
                <h5 className="mb-1">Bathrooms</h5>
                <p className="mb-0 fw-bold">{property.bathrooms}</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="bg-white rounded-3 p-4 text-center h-100 shadow-sm">
                <div className="text-primary fs-2 mb-2">
                  <i className="fas fa-ruler-combined"></i>
                </div>
                <h5 className="mb-1">Size</h5>
                <p className="mb-0 fw-bold">{property.area} sq ft</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="bg-white rounded-3 p-4 text-center h-100 shadow-sm">
                <div className="text-primary fs-2 mb-2">
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <h5 className="mb-1">Year Built</h5>
                <p className="mb-0 fw-bold">{property.year_built || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Property Details */}
      <section className="property-details py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              {/* Description Card */}
              <div className="card border-0 shadow-sm mb-4 overflow-hidden">
                <div className="card-body p-4">
                  <h3 className="card-title fw-bold mb-4 position-relative">
                    Description
                    <span className="position-absolute bottom-0 start-0 w-25 h-1 bg-primary rounded"></span>
                  </h3>
                  <p className="card-text">{property.description}</p>
                </div>
              </div>
              
              {/* Features Card */}
              {property.features && property.features.length > 0 && (
                <div className="card border-0 shadow-sm mb-4 overflow-hidden">
                  <div className="card-body p-4">
                    <h3 className="card-title fw-bold mb-4 position-relative">
                      Features
                      <span className="position-absolute bottom-0 start-0 w-25 h-1 bg-primary rounded"></span>
                    </h3>
                    <div className="row">
                      <div className="col-md-6">
                        <ul className="list-unstyled">
                          {property.features.slice(0, Math.ceil(property.features.length / 2)).map((feature, index) => (
                            <li className="mb-3 d-flex align-items-center" key={index}>
                              <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                                <i className="fas fa-check text-primary"></i>
                              </div>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <ul className="list-unstyled">
                          {property.features.slice(Math.ceil(property.features.length / 2)).map((feature, index) => (
                            <li className="mb-3 d-flex align-items-center" key={index}>
                              <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                                <i className="fas fa-check text-primary"></i>
                              </div>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Reviews Section */}
              <div className="card border-0 shadow-sm mb-4 overflow-hidden">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="card-title fw-bold position-relative">
                      Reviews
                      <span className="position-absolute bottom-0 start-0 w-25 h-1 bg-primary rounded"></span>
                    </h3>
                    <button 
                      className="btn btn-primary"
                      onClick={() => {
                        if (isLoggedIn) {
                          setShowReviewForm(!showReviewForm);
                        } else {
                          alert('Please log in to submit a review.');
                        }
                      }}
                    >
                      <i className="fas fa-plus me-2"></i>Add Review
                    </button>
                  </div>
                  
                  {/* Review Form */}
                  {showReviewForm && (
                    <div className="card mb-4 border-primary">
                      <div className="card-body">
                        <h5 className="card-title mb-3">Write a Review</h5>
                        <form onSubmit={handleReviewSubmit}>
                          <div className="mb-3">
                            <label className="form-label fw-medium">Rating</label>
                            <div className="mb-2">
                              {renderStars(reviewForm.rating, true)}
                            </div>
                          </div>
                          <div className="mb-3">
                            <label className="form-label fw-medium">Your Review</label>
                            <textarea 
                              className="form-control" 
                              rows="3" 
                              name="comment"
                              value={reviewForm.comment}
                              onChange={handleReviewChange}
                              placeholder="Share your experience with this property..."
                              required
                            ></textarea>
                          </div>
                          <button type="submit" className="btn btn-primary">Submit Review</button>
                        </form>
                      </div>
                    </div>
                  )}
                  
                  {/* Rating Summary */}
                  <div className="row mb-4">
                    <div className="col-md-4 text-center">
                      <div className="display-4 fw-bold text-primary">{averageRating}</div>
                      <div className="mb-2">
                        {renderStars(averageRating)}
                      </div>
                      <div className="text-muted">{totalReviews} reviews</div>
                    </div>
                    <div className="col-md-8">
                      <div className="mb-2">
                        <div className="d-flex justify-content-between mb-1">
                          <span>5 star</span>
                          <span>{reviews.filter(r => r.rating === 5).length}</span>
                        </div>
                        <div className="progress" style={{ height: '10px' }}>
                          <div 
                            className="progress-bar bg-warning" 
                            role="progressbar" 
                            style={{ width: `${(reviews.filter(r => r.rating === 5).length / totalReviews) * 100 || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="mb-2">
                        <div className="d-flex justify-content-between mb-1">
                          <span>4 star</span>
                          <span>{reviews.filter(r => r.rating === 4).length}</span>
                        </div>
                        <div className="progress" style={{ height: '10px' }}>
                          <div 
                            className="progress-bar bg-warning" 
                            role="progressbar" 
                            style={{ width: `${(reviews.filter(r => r.rating === 4).length / totalReviews) * 100 || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="mb-2">
                        <div className="d-flex justify-content-between mb-1">
                          <span>3 star</span>
                          <span>{reviews.filter(r => r.rating === 3).length}</span>
                        </div>
                        <div className="progress" style={{ height: '10px' }}>
                          <div 
                            className="progress-bar bg-warning" 
                            role="progressbar" 
                            style={{ width: `${(reviews.filter(r => r.rating === 3).length / totalReviews) * 100 || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="mb-2">
                        <div className="d-flex justify-content-between mb-1">
                          <span>2 star</span>
                          <span>{reviews.filter(r => r.rating === 2).length}</span>
                        </div>
                        <div className="progress" style={{ height: '10px' }}>
                          <div 
                            className="progress-bar bg-warning" 
                            role="progressbar" 
                            style={{ width: `${(reviews.filter(r => r.rating === 2).length / totalReviews) * 100 || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="d-flex justify-content-between mb-1">
                          <span>1 star</span>
                          <span>{reviews.filter(r => r.rating === 1).length}</span>
                        </div>
                        <div className="progress" style={{ height: '10px' }}>
                          <div 
                            className="progress-bar bg-warning" 
                            role="progressbar" 
                            style={{ width: `${(reviews.filter(r => r.rating === 1).length / totalReviews) * 100 || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Reviews List */}
                  {reviews.length > 0 ? (
                    <div className="reviews-list">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-bottom pb-4 mb-4">
                          <div className="d-flex justify-content-between mb-2">
                            <h5 className="mb-0">{review.user_name}</h5>
                            <div className="text-warning">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                          <div className="text-muted small mb-2">
                            {new Date(review.created_at).toLocaleDateString()}
                          </div>
                          <p className="mb-0">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted">No reviews yet. Be the first to review this property!</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Location Card */}
              <div className="card border-0 shadow-sm overflow-hidden">
                <div className="card-body p-4">
                  <h3 className="card-title fw-bold mb-4 position-relative">
                    Location
                    <span className="position-absolute bottom-0 start-0 w-25 h-1 bg-primary rounded"></span>
                  </h3>
                  <div className="ratio ratio-16x9 mb-4 rounded-3 overflow-hidden">
                    <iframe 
                      src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(property.address)}`}
                      allowFullScreen="" 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      className="border-0"
                    ></iframe>
                  </div>
                  
                  <h5 className="mb-3">Nearby Amenities</h5>
                  {property.amenities && property.amenities.length > 0 ? (
                    <div className="row">
                      <div className="col-md-6">
                        <ul className="list-unstyled">
                          {property.amenities.slice(0, Math.ceil(property.amenities.length / 2)).map((amenity, index) => (
                            <li className="mb-3 d-flex align-items-center" key={index}>
                              <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                                <i className={`${renderAmenityIcon(amenity.icon)} text-primary`}></i>
                              </div>
                              <div>
                                <span>{amenity.text}</span>
                                {amenity.distance && (
                                  <small className="text-muted d-block">{amenity.distance}</small>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <ul className="list-unstyled">
                          {property.amenities.slice(Math.ceil(property.amenities.length / 2)).map((amenity, index) => (
                            <li className="mb-3 d-flex align-items-center" key={index}>
                                  <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                                    <i className={`${renderAmenityIcon(amenity.icon)} text-primary`}></i>
                                  </div>
                              <div>
                                <span>{amenity.text}</span>
                                {amenity.distance && (
                                  <small className="text-muted d-block">{amenity.distance}</small>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted">No amenities information available.</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="col-lg-4">
              {/* Tour Request Card */}
              <div className="card border-0 shadow-sm mb-4" style={{ top: '20px' }}>
                <div className="card-body p-4">
                  <h3 className="card-title fw-bold mb-4 position-relative">
                    Request a Tour
                    <span className="position-absolute bottom-0 start-0 w-25 h-1 bg-primary rounded"></span>
                  </h3>
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
                    <div className="mb-4">
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
                    <button type="submit" className="btn btn-primary w-100 py-3 fw-bold">Schedule Tour</button>
                  </form>
                </div>
              </div>
              
              {/* Property Details Card */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                  <h3 className="card-title fw-bold mb-4 position-relative">
                    Property Details
                    <span className="position-absolute bottom-0 start-0 w-25 h-1 bg-primary rounded"></span>
                  </h3>
                  <ul className="list-unstyled">
                    <li className="d-flex justify-content-between py-3 border-bottom">
                      <span className="text-muted">Property ID</span>
                      <span className="fw-bold">LH-{property.id.toString().padStart(4, '0')}</span>
                    </li>
                    <li className="d-flex justify-content-between py-3 border-bottom">
                      <span className="text-muted">Price</span>
                      <span className="fw-bold">${property.price.toLocaleString()}/mo</span>
                    </li>
                    <li className="d-flex justify-content-between py-3 border-bottom">
                      <span className="text-muted">Property Size</span>
                      <span className="fw-bold">{property.area} sq ft</span>
                    </li>
                    <li className="d-flex justify-content-between py-3 border-bottom">
                      <span className="text-muted">Bedrooms</span>
                      <span className="fw-bold">{property.bedrooms}</span>
                    </li>
                    <li className="d-flex justify-content-between py-3 border-bottom">
                      <span className="text-muted">Bathrooms</span>
                      <span className="fw-bold">{property.bathrooms}</span>
                    </li>
                    <li className="d-flex justify-content-between py-3">
                      <span className="text-muted">Year Built</span>
                      <span className="fw-bold">{property.year_built || 'N/A'}</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Contact Agent Card */}
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <h3 className="card-title fw-bold mb-4 position-relative">
                    Listed By
                    <span className="position-absolute bottom-0 start-0 w-25 h-1 bg-primary rounded"></span>
                  </h3>
                  <div className="d-flex mb-4">
                    <div className="me-3">
                      <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                        <span className="text-primary fw-bold fs-4">{property.owner_name ? property.owner_name.charAt(0) : 'A'}</span>
                      </div>
                    </div>
                    <div>
                      <h5 className="mb-1">{property.owner_name || 'Property Owner'}</h5>
                      <p className="text-muted mb-1">Listed on {new Date(property.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <ul className="list-unstyled">
                    <li className="mb-3 d-flex align-items-center">
                      <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                        <i className="fas fa-envelope text-primary"></i>
                      </div>
                      <span>{property.owner_email || 'N/A'}</span>
                    </li>
                  </ul>
                  <button 
                    className="btn btn-outline-primary w-100 mt-3"
                    onClick={() => setShowContactModal(true)}
                  >
                    <i className="fas fa-envelope me-2"></i>Contact Owner
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Similar Properties */}
      {property.similar_properties && property.similar_properties.length > 0 && (
        <section className="similar-properties py-5 bg-light">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold mb-0">Similar Properties</h2>
              <Link to="/properties" className="btn btn-outline-primary">View All</Link>
            </div>
            <div className="row g-4">
              {property.similar_properties.map(similar => (
                <div className="col-md-6 col-lg-4" key={similar.id}>
                  <div className="card property-card h-100 border-0 shadow-sm overflow-hidden transition-transform duration-300 hover-shadow-lg">
                    <div className="position-relative">
                      <img 
                        src={similar.image} 
                        className="card-img-top" 
                        alt={similar.title}
                        style={{ height: '220px', objectFit: 'cover' }}
                      />
                      <div className="position-absolute bottom-0 start-0 end-0 p-3 bg-gradient-to-t from-black to-transparent">
                        <div className="d-flex justify-content-between text-white">
                          <span className="fw-bold">${similar.price.toLocaleString()}/mo</span>
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
      )}
      
      {/* Contact Agent Modal - React Bootstrap Modal */}
      <Modal show={showContactModal} onHide={() => setShowContactModal(false)}>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Contact Property Owner</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label className="form-label fw-medium">Your Name</label>
              <input type="text" className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label fw-medium">Your Email</label>
              <input type="email" className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label fw-medium">Phone Number</label>
              <input type="tel" className="form-control" />
            </div>
            <div className="mb-3">
              <label className="form-label fw-medium">Message</label>
              <textarea className="form-control" rows="3"></textarea>
            </div>
            <Button variant="primary" type="submit" className="w-100">
              Send Message
            </Button>
          </form>
        </Modal.Body>
      </Modal>
      
      {/* Tour Request Modal - React Bootstrap Modal */}
      <Modal show={showTourModal} onHide={() => setShowTourModal(false)}>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Request a Tour</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-medium">Your Name</label>
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
              <label className="form-label fw-medium">Your Email</label>
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
              <label className="form-label fw-medium">Phone Number</label>
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
              <label className="form-label fw-medium">Message</label>
              <textarea 
                className="form-control" 
                rows="3" 
                placeholder="Message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="form-label fw-medium">Preferred Tour Date</label>
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
            <Button variant="primary" type="submit" className="w-100 py-3 fw-bold">
              Schedule Tour
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </Weblayout>
  );
}

export default PropertyDetails;