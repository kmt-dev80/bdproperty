import React, { useState } from 'react';
import { Modal, Button, Form, InputGroup, Alert } from 'react-bootstrap';
import { useModal } from '../context/ModalContext';

const ModalContainer = () => {
  const { showListPropertyModal, setShowListPropertyModal } = useModal();
  
  // Form state for the property listing
  const [propertyForm, setPropertyForm] = useState({
    title: '',
    type: '',
    price: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    year: '',
    address: '',
    description: '',
    features: '',
    images: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handlePropertyChange = (e) => {
    const { name, value } = e.target;
    setPropertyForm(prev => ({
      ...prev,
      [name]: value
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
      propertyForm.images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });

      // API call to property listing endpoint
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Property listing failed');
      }

      // Close modal and show success
      setShowListPropertyModal(false);
      
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
        description: '',
        features: '',
        images: []
      });
      
      // You might want to show a success message here
      
    } catch (err) {
      setError(err.message || 'An error occurred while listing your property');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* List Property Modal */}
      <Modal show={showListPropertyModal} onHide={() => setShowListPropertyModal(false)} centered size="lg">
        <Modal.Header className="bg-gradient-primary text-white border-0 rounded-top">
          <Modal.Title id="listPropertyModalLabel" className="fw-bold">List Your Property</Modal.Title>
          <Button variant="close" aria-label="Close" onClick={() => setShowListPropertyModal(false)} className="btn-close-white" />
        </Modal.Header>
        <Modal.Body className="py-4">
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handlePropertySubmit}>
            <div className="row g-4">
              <div className="col-md-6">
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
                    <option>Apartment</option>
                    <option>House</option>
                    <option>Office</option>
                    <option>Store</option>
                    <option>Villa</option>
                    <option>Land</option>
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
                      required 
                    />
                    <InputGroup.Text>sq ft</InputGroup.Text>
                  </InputGroup>
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
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5+</option>
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
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4+</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group controlId="propertyYear">
                  <Form.Label className="fw-medium">Year Built</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="year"
                    value={propertyForm.year}
                    onChange={handlePropertyChange}
                    placeholder="e.g. 2015" 
                  />
                </Form.Group>
              </div>
              <div className="col-12">
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
                    <div className="d-flex align-items-center mt-3">
                      <div className="me-3">
                        <div className="bg-white rounded-3 border d-flex align-items-center justify-content-center" style={{width: '80px', height: '80px'}}>
                          <i className="bi bi-plus-lg text-muted fs-4"></i>
                        </div>
                      </div>
                      <small className="text-muted">Upload at least 3 high-quality images (max 10MB each)</small>
                    </div>
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
    </>
  );
};

export default ModalContainer;