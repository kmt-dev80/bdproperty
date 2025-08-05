import React, { useState } from 'react';
import { Modal, Button, Form, InputGroup, Alert } from 'react-bootstrap';
import { useModal } from '../context/ModalContext';
import axios from 'axios';

const ModalContainer = () => {
  const { showListPropertyModal, setShowListPropertyModal } = useModal();
  
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
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handlePropertyChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPropertyForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
      
      // Add images to FormData
      if (propertyForm.images && propertyForm.images.length > 0) {
        propertyForm.images.forEach((image, index) => {
          formData.append(`images[${index}]`, image);
        });
      }
      
      //console.log('Submitting property form...');
      
      // API call to property listing endpoint
      const response = await axios.post('http://localhost/api/properties/add_property.php', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      //console.log('Response:', response.data);
      
      if (response.data.success) {
        setSuccess('Property listed successfully!');
        
        // Close modal after a short delay
        setTimeout(() => {
          setShowListPropertyModal(false);
          setSuccess('');
        }, 2000);
        
        // Reset form
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
      } else {
        setError(response.data.message || 'Property listing failed');
      }
      
    } catch (err) {
      console.error('Error:', err);
      
      if (err.response) {
        setError(err.response.data.message || 'Property listing failed');
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError(err.message || 'An error occurred while listing your property');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Modal show={showListPropertyModal} onHide={() => setShowListPropertyModal(false)} centered size="lg">
      <Modal.Header className="bg-gradient-primary text-white border-0 rounded-top">
        <Modal.Title id="listPropertyModalLabel" className="fw-bold">List Your Property</Modal.Title>
        <Button variant="close" aria-label="Close" onClick={() => setShowListPropertyModal(false)} className="btn-close-white" />
      </Modal.Header>
      <Modal.Body className="py-4">
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <Form onSubmit={handlePropertySubmit}>
          <div className="row g-4">
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
              <Button 
                variant="primary" 
                type="submit" 
                className="w-100 py-3 fw-bold shadow-sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Property Listing'}
              </Button>
            </div>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalContainer;