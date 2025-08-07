import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, InputGroup, Alert, Row, Col } from 'react-bootstrap';
import { useModal } from '../context/ModalContext';
import axios from 'axios';

const ModalContainer = () => {
  const { showListPropertyModal, setShowListPropertyModal, editingProperty, setEditingProperty } = useModal();
  
  // Determine if we're in edit mode
  const isEditMode = editingProperty && editingProperty.id;
  
  // Form state with all fields
  const [propertyForm, setPropertyForm] = useState({
    title: '',
    type: '',
    price: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    year: '',
    address: '',
    location: '',
    description: '',
    features: '',
    featured: false,
    images: []
  });
  
  // Predefined common amenities with distance fields
  const [amenities, setAmenities] = useState([
    { text: 'School', icon: 'fa-school', distance: '' },
    { text: 'Hospital', icon: 'fa-hospital', distance: '' },
    { text: 'Shopping Mall', icon: 'fa-shopping-cart', distance: '' },
    { text: 'Park', icon: 'fa-tree', distance: '' },
    { text: 'Restaurant', icon: 'fa-utensils', distance: '' },
    { text: 'Public Transport', icon: 'fa-bus', distance: '' }
  ]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  
  // Load property data when editing
  useEffect(() => {
    if (isEditMode && editingProperty) {
      // Populate form with property data
      setPropertyForm({
        title: editingProperty.title || '',
        type: editingProperty.type || '',
        price: editingProperty.price || '',
        area: editingProperty.area || '',
        bedrooms: editingProperty.bedrooms || '',
        bathrooms: editingProperty.bathrooms || '',
        year: editingProperty.year_built || '',
        address: editingProperty.address || '',
        location: editingProperty.location || '',
        description: editingProperty.description || '',
        features: editingProperty.features || '',
        featured: editingProperty.featured || false,
        images: [] // Images will be handled separately
      });
      
      // Load amenities if they exist
      if (editingProperty.amenities && Array.isArray(editingProperty.amenities) && editingProperty.amenities.length > 0) {
        const updatedAmenities = [...amenities];
        
        // Map existing amenities to our predefined list
        editingProperty.amenities.forEach(propAmenity => {
          // Add null checks for amenity_name and text
          if (propAmenity && propAmenity.amenity_name) {
            const index = updatedAmenities.findIndex(a => 
              a && a.text && propAmenity.amenity_name && 
              a.text.toLowerCase() === propAmenity.amenity_name.toLowerCase()
            );
            
            if (index !== -1) {
              updatedAmenities[index] = {
                ...updatedAmenities[index],
                distance: propAmenity.distance || ''
              };
            }
          }
        });
        
        setAmenities(updatedAmenities);
      }
    } else {
      // Reset form when not in edit mode
      setPropertyForm({
        title: '',
        type: '',
        price: '',
        area: '',
        bedrooms: '',
        bathrooms: '',
        year: '',
        address: '',
        location: '',
        description: '',
        features: '',
        featured: false,
        images: []
      });
      
      // Reset amenities
      setAmenities([
        { text: 'School', icon: 'fa-school', distance: '' },
        { text: 'Hospital', icon: 'fa-hospital', distance: '' },
        { text: 'Shopping Mall', icon: 'fa-shopping-cart', distance: '' },
        { text: 'Park', icon: 'fa-tree', distance: '' },
        { text: 'Restaurant', icon: 'fa-utensils', distance: '' },
        { text: 'Public Transport', icon: 'fa-bus', distance: '' }
      ]);
    }
    
    // Reset other states
    setError('');
    setSuccess('');
    setDeleteConfirm(false);
  }, [isEditMode, editingProperty]);
  
  const handlePropertyChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPropertyForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleAmenityDistanceChange = (index, value) => {
    setAmenities(prev => {
      const updatedAmenities = [...prev];
      if (updatedAmenities[index]) {
        updatedAmenities[index] = {
          ...updatedAmenities[index],
          distance: value
        };
      }
      return updatedAmenities;
    });
  };
  
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setPropertyForm(prev => ({
      ...prev,
      images: files
    }));
  };
  
  const handlePropertySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('You must be logged in to list a property');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Add all form fields to FormData
      Object.keys(propertyForm).forEach(key => {
        if (key !== 'images') {
          formData.append(key, propertyForm[key]);
        }
      });
      
      // Add property ID if in edit mode
      if (isEditMode) {
        formData.append('property_id', editingProperty.id);
      }
      
      // Filter amenities that have distances filled
      const amenitiesWithDistance = amenities.filter(amenity => amenity.distance && amenity.distance.trim() !== '');
      
      // Add amenities as JSON string
      formData.append('amenities', JSON.stringify(amenitiesWithDistance));
      
      // Add images to FormData
      if (propertyForm.images && propertyForm.images.length > 0) {
        propertyForm.images.forEach((image, index) => {
          formData.append(`images[${index}]`, image);
        });
      }
      
      // Determine API endpoint based on mode
      const endpoint = isEditMode 
        ? 'http://localhost/api/properties/update_property.php'
        : 'http://localhost/api/properties/add_property.php';
      
      // API call to property endpoint
      const response = await axios.post(endpoint, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        const successMessage = isEditMode 
          ? 'Property updated successfully!' 
          : 'Property listed successfully!';
          
        setSuccess(successMessage);
        
        // Close modal after a short delay
        setTimeout(() => {
          setShowListPropertyModal(false);
          setEditingProperty(null);
          setSuccess('');
          
          // Refresh the page or update the property list
          window.location.reload(); // Simple approach, could be improved with state management
        }, 2000);
        
        // Reset form if not in edit mode
        if (!isEditMode) {
          setPropertyForm({
            title: '',
            type: '',
            price: '',
            area: '',
            bedrooms: '',
            bathrooms: '',
            year: '',
            address: '',
            location: '',
            description: '',
            features: '',
            featured: false,
            images: []
          });
          
          // Reset amenities
          setAmenities([
            { text: 'School', icon: 'fa-school', distance: '' },
            { text: 'Hospital', icon: 'fa-hospital', distance: '' },
            { text: 'Shopping Mall', icon: 'fa-shopping-cart', distance: '' },
            { text: 'Park', icon: 'fa-tree', distance: '' },
            { text: 'Restaurant', icon: 'fa-utensils', distance: '' },
            { text: 'Public Transport', icon: 'fa-bus', distance: '' }
          ]);
        }
      } else {
        setError(response.data.message || 'Property operation failed');
      }
      
    } catch (err) {
      console.error('Error:', err);
      
      if (err.response) {
        setError(err.response.data.message || 'Property operation failed');
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError(err.message || 'An error occurred while processing your property');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteProperty = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('You must be logged in to delete a property');
        setIsSubmitting(false);
        return;
      }
      
      const response = await axios.post(
        'http://localhost/api/properties/delete_property.php',
        { property_id: editingProperty.id },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        setSuccess('Property deleted successfully!');
        
        // Close modal after a short delay
        setTimeout(() => {
          setShowListPropertyModal(false);
          setEditingProperty(null);
          setSuccess('');
          
          // Redirect to properties page or refresh
          window.location.href = '/properties';
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to delete property');
      }
    } catch (err) {
      console.error('Error deleting property:', err);
      setError(err.response?.data?.message || 'Failed to delete property');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCloseModal = () => {
    if (!isSubmitting) {
      setShowListPropertyModal(false);
      setEditingProperty(null);
    }
  };
  
  return (
    <Modal show={showListPropertyModal} onHide={handleCloseModal} centered size="lg">
      <Modal.Header className="bg-gradient-primary text-white border-0 rounded-top">
        <Modal.Title id="listPropertyModalLabel" className="fw-bold">
          {isEditMode ? 'Edit Property' : 'List Your Property'}
        </Modal.Title>
        <Button variant="close" aria-label="Close" onClick={handleCloseModal} className="btn-close-white" />
      </Modal.Header>
      <Modal.Body className="py-4">
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        {isEditMode && deleteConfirm && (
          <Alert variant="warning">
            Are you sure you want to delete this property? This action cannot be undone.
            <div className="mt-2">
              <Button 
                variant="danger" 
                size="sm" 
                className="me-2"
                onClick={handleDeleteProperty}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Deleting...' : 'Yes, Delete Property'}
              </Button>
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={() => setDeleteConfirm(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </Alert>
        )}
        
        <Form onSubmit={handlePropertySubmit}>
          <div className="row g-4">
            {/* Form fields remain the same as before */}
            <div className="col-md-12">
              <Form.Group controlId="propertyTitle">
                <Form.Label className="fw-medium">Property Title</Form.Label>
                <Form.Control 
                  type="text" 
                  name="title"
                  value={propertyForm.title}
                  onChange={handlePropertyChange}
                  placeholder="e.g. Modern 2-Bedroom Apartment" 
                  required 
                />
              </Form.Group>
            </div>
            
            <div className="col-md-6">
              <Form.Group controlId="propertyType">
                <Form.Label className="fw-medium">Property Type</Form.Label>
                <Form.Select 
                  name="type"
                  value={propertyForm.type}
                  onChange={handlePropertyChange}
                  required
                >
                  <option value="">Select type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="office">Office</option>
                  <option value="store">Store</option>
                  <option value="villa">Villa</option>
                  <option value="land">Land</option>
                </Form.Select>
              </Form.Group>
            </div>
            
            <div className="col-md-6">
              <Form.Group controlId="propertyPrice">
                <Form.Label className="fw-medium">Monthly Rent ($)</Form.Label>
                <InputGroup>
                  <InputGroup.Text>$</InputGroup.Text>
                  <Form.Control 
                    type="number" 
                    name="price"
                    value={propertyForm.price}
                    onChange={handlePropertyChange}
                    min="0"
                    step="0.01"
                    required 
                  />
                </InputGroup>
              </Form.Group>
            </div>
            
            <div className="col-md-6">
              <Form.Group controlId="propertyArea">
                <Form.Label className="fw-medium">Area (sq ft)</Form.Label>
                <InputGroup>
                  <Form.Control 
                    type="number" 
                    name="area"
                    value={propertyForm.area}
                    onChange={handlePropertyChange}
                    min="0"
                  />
                  <InputGroup.Text>sq ft</InputGroup.Text>
                </InputGroup>
              </Form.Group>
            </div>
            
            <div className="col-md-6">
              <Form.Group controlId="propertyYear">
                <Form.Label className="fw-medium">Year Built</Form.Label>
                <Form.Control 
                  type="number" 
                  name="year"
                  value={propertyForm.year}
                  onChange={handlePropertyChange}
                  placeholder="e.g. 2015" 
                  min="1800"
                  max={new Date().getFullYear()}
                />
              </Form.Group>
            </div>
            
            <div className="col-md-4">
              <Form.Group controlId="propertyBedrooms">
                <Form.Label className="fw-medium">Bedrooms</Form.Label>
                <Form.Select 
                  name="bedrooms"
                  value={propertyForm.bedrooms}
                  onChange={handlePropertyChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5+</option>
                </Form.Select>
              </Form.Group>
            </div>
            
            <div className="col-md-4">
              <Form.Group controlId="propertyBathrooms">
                <Form.Label className="fw-medium">Bathrooms</Form.Label>
                <Form.Select 
                  name="bathrooms"
                  value={propertyForm.bathrooms}
                  onChange={handlePropertyChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4+</option>
                </Form.Select>
              </Form.Group>
            </div>
            
            <div className="col-md-4">
              <Form.Group controlId="propertyFeatured">
                <Form.Check 
                  type="checkbox" 
                  name="featured"
                  checked={propertyForm.featured}
                  onChange={handlePropertyChange}
                  label="Featured Property" 
                  className="pt-4"
                />
              </Form.Group>
            </div>
            
            <div className="col-md-6">
              <Form.Group controlId="propertyAddress">
                <Form.Label className="fw-medium">Address</Form.Label>
                <Form.Control 
                  type="text" 
                  name="address"
                  value={propertyForm.address}
                  onChange={handlePropertyChange}
                  required 
                />
              </Form.Group>
            </div>
            
            <div className="col-md-6">
              <Form.Group controlId="propertyLocation">
                <Form.Label className="fw-medium">Location</Form.Label>
                <Form.Control 
                  type="text" 
                  name="location"
                  value={propertyForm.location}
                  onChange={handlePropertyChange}
                  placeholder="City, State" 
                  required 
                />
              </Form.Group>
            </div>
            
            <div className="col-12">
              <Form.Group controlId="propertyDescription">
                <Form.Label className="fw-medium">Description</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3}
                  name="description"
                  value={propertyForm.description}
                  onChange={handlePropertyChange}
                  required 
                />
              </Form.Group>
            </div>
            
            <div className="col-12">
              <Form.Group controlId="propertyFeatures">
                <Form.Label className="fw-medium">Features</Form.Label>
                <Form.Control 
                  type="text" 
                  name="features"
                  value={propertyForm.features}
                  onChange={handlePropertyChange}
                  placeholder="Parking, Gym, Pool, Balcony (comma separated)" 
                />
              </Form.Group>
            </div>
            
            {/* Amenities Section */}
            <div className="col-12">
              <h5 className="mb-3">Nearby Amenities</h5>
              <div className="border rounded-3 p-3 bg-light">
                <p className="text-muted mb-3">Specify the distance to these nearby amenities (leave blank if not applicable):</p>
                
                <Row className="g-3">
                  {amenities.map((amenity, index) => (
                    <Col md={6} key={index}>
                      <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                          <i className={`fas ${amenity.icon || 'fa-info'} text-primary`}></i>
                        </div>
                        <div className="flex-grow-1">
                          <Form.Label className="mb-1 fw-medium">{amenity.text || 'Amenity'}</Form.Label>
                          <InputGroup>
                            <Form.Control 
                              type="text" 
                              placeholder="e.g., 0.5 miles, 10 min walk"
                              value={amenity.distance || ''}
                              onChange={(e) => handleAmenityDistanceChange(index, e.target.value)}
                            />
                          </InputGroup>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </div>
            
            <div className="col-12">
              <Form.Group controlId="propertyImages">
                <Form.Label className="fw-medium">Upload Images</Form.Label>
                <div className="border rounded-3 p-3 bg-light">
                  <Form.Control 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleFileChange}
                  />
                  <small className="text-muted d-block mt-2">Upload high-quality images (max 10MB each)</small>
                </div>
              </Form.Group>
            </div>
            
            <div className="col-12 mt-4">
              <div className="d-flex gap-2">
                {isEditMode && (
                  <Button 
                    variant="danger" 
                    type="button" 
                    className="py-3 fw-bold"
                    onClick={handleDeleteProperty}
                    disabled={isSubmitting}
                  >
                    {isSubmitting && deleteConfirm ? 'Deleting...' : 'Delete Property'}
                  </Button>
                )}
                
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="flex-grow-1 py-3 fw-bold shadow-sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting 
                    ? (isEditMode ? 'Updating...' : 'Submitting...') 
                    : (isEditMode ? 'Update Property' : 'Submit Property Listing')
                  }
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalContainer;