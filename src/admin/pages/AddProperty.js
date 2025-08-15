// src/pages/admin/AddProperty.js
import React, { useState } from 'react';
import { Card, Form, Button, Alert, Row, Col, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import useAuth instead of axios

const AddProperty = () => {
  const navigate = useNavigate();
  const { uploadFile } = useAuth(); // Use uploadFile method from AuthContext
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
    map_link: '',
    status: 'available'
  });
  
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
  
  const handlePropertyChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPropertyForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? '1' : '0') : value // Ensure checkbox values are sent as 1 or 0
    }));
  };
  
  const handleAmenityDistanceChange = (index, value) => {
    setAmenities(prev => {
      const updatedAmenities = [...prev];
      updatedAmenities[index] = {
        ...updatedAmenities[index],
        distance: value
      };
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Add all form fields to FormData
      Object.keys(propertyForm).forEach(key => {
        if (key !== 'images') {
          formData.append(key, propertyForm[key]);
        }
      });
      
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
      
      // Use uploadFile method from AuthContext
      const response = await uploadFile('/properties/add_property.php', formData);
      
      if (response.success) {
        setSuccess('Property added successfully!');
        
        // Redirect to properties page after a short delay
        setTimeout(() => {
          navigate('/admin/properties');
        }, 2000);
      } else {
        setError(response.message || 'Failed to add property');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred while adding the property');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Add New Property</h2>
        <Button variant="outline-secondary" onClick={() => navigate('/admin/properties')}>
          Back to Properties
        </Button>
      </div>
      
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Form onSubmit={handleSubmit}>
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
                    <option value="land">Land</option>
                  </Form.Select>
                </Form.Group>
              </div>
              
              <div className="col-md-6">
                <Form.Group controlId="propertyPrice">
                  <Form.Label className="fw-medium">Monthly Rent (Tk)</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>Tk</InputGroup.Text>
                    <Form.Control 
                      type="number" 
                      name="price"
                      value={propertyForm.price}
                      onChange={handlePropertyChange}
                      min="0"
                      step="0.01"
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
                <Form.Group controlId="propertyStatus">
                  <Form.Label className="fw-medium">Status</Form.Label>
                  <Form.Select 
                    name="status"
                    value={propertyForm.status}
                    onChange={handlePropertyChange}
                  >
                    <option value="available">Available</option>
                    <option value="rented">Rented</option>
                    <option value="sold">Sold</option>
                  </Form.Select>
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
                <Form.Group controlId="propertyMapLink">
                  <Form.Label className="fw-medium">Embedded Map Link</Form.Label>
                  <Form.Control 
                    type="text"
                    name="map_link"
                    value={propertyForm.map_link}
                    onChange={handlePropertyChange}
                    required 
                  />
                   <Form.Text className="text-muted">
                      Paste the embed link from Google Maps or other map services. 
                      To get this link, go to Google Maps, find the location, click "Share", then "Embed a map", and copy the iframe src URL.
                    </Form.Text>
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
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="flex-grow-1 py-3 fw-bold shadow-sm"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Adding Property...' : 'Add Property'}
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddProperty;