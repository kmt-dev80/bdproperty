import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Modal, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  
  // Modal states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showListPropertyModal, setShowListPropertyModal] = useState(false);

  // Form states
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: '',
    terms: false
  });

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

  // Loading and error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle form changes
  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRegisterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegisterForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

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

  // Handle form submissions
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // API call to login endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token to localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Close modal and redirect
      setShowLoginModal(false);
      setSuccess('Login successful!');
      
      // Redirect to dashboard or home page
      if (data.user.userType === 'agent') {
        navigate('/agent-dashboard');
      } else {
        navigate('/dashboard');
      }
      
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    // Validate passwords match
    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    try {
      // API call to register endpoint
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: registerForm.name,
          email: registerForm.email,
          password: registerForm.password,
          userType: registerForm.userType
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Close modal and show success
      setShowRegisterModal(false);
      setSuccess('Registration successful! Please login.');
      
      // Open login modal
      setTimeout(() => setShowLoginModal(true), 500);
      
    } catch (err) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setIsSubmitting(false);
    }
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
      setSuccess('Property listed successfully!');
      
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
      
      // Redirect to properties page
      navigate('/properties');
      
    } catch (err) {
      setError(err.message || 'An error occurred while listing your property');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Navigation */}
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="navbar-dark">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold">
            <i className="fas fa-home me-2"></i>
            Luxury<span className="text-warning">Homes</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarNav" />
          <Navbar.Collapse id="navbarNav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/" active>Home</Nav.Link>
              <Nav.Link as={Link} to="/properties">Properties</Nav.Link>
              <Nav.Link as={Link} to="/services">Services</Nav.Link>
              <Nav.Link as={Link} to="/agents">Agents</Nav.Link>
              <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
            </Nav>
            <div className="ms-lg-3 mt-3 mt-lg-0 d-flex gap-2">
              <Button variant="warning" onClick={() => setShowLoginModal(true)}>Login</Button>
              <Button variant="outline-light" onClick={() => setShowRegisterModal(true)}>Register</Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Success Alert */}
      {success && (
        <Alert variant="success" className="position-fixed top-0 start-50 translate-middle-x mt-5" style={{ zIndex: 9999 }}>
          {success}
          <Button variant="close" size="sm" onClick={() => setSuccess('')} />
        </Alert>
      )}

      {/* Login Modal */}
      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered size="sm">
        <Modal.Header className="bg-gradient-primary text-white border-0 rounded-top">
          <Modal.Title id="loginModalLabel" className="fw-bold">Welcome Back!</Modal.Title>
          <Button variant="close" aria-label="Close" onClick={() => setShowLoginModal(false)} className="btn-close-white" />
        </Modal.Header>
        <Modal.Body className="py-4">
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLoginSubmit}>
            <Form.Group className="mb-3" controlId="loginEmail">
              <Form.Label className="fw-medium">Email address</Form.Label>
              <Form.Control 
                type="email" 
                name="email"
                value={loginForm.email}
                onChange={handleLoginChange}
                placeholder="your@email.com" 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="loginPassword">
              <Form.Label className="fw-medium">Password</Form.Label>
              <Form.Control 
                type="password" 
                name="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                placeholder="••••••••" 
                required 
              />
              <div className="text-end mt-2">
                <a href="#" className="text-decoration-none text-primary fw-medium">Forgot password?</a>
              </div>
            </Form.Group>
            <Form.Group className="mb-4" controlId="rememberMe">
              <Form.Check 
                type="checkbox" 
                name="rememberMe"
                checked={loginForm.rememberMe}
                onChange={handleLoginChange}
                label="Remember me" 
              />
            </Form.Group>
            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 rounded-pill py-3 mb-3 fw-bold shadow-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
            <div className="text-center pt-2">
              <p className="mb-0 text-muted">
                Don't have an account? 
                <a 
                  href="#" 
                  className="text-decoration-none fw-bold text-primary" 
                  onClick={(e) => {
                    e.preventDefault();
                    setShowLoginModal(false);
                    setShowRegisterModal(true);
                  }}
                >
                  Sign up
                </a>
              </p>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Register Modal */}
      <Modal show={showRegisterModal} onHide={() => setShowRegisterModal(false)} centered>
        <Modal.Header className="bg-gradient-primary text-white border-0 rounded-top">
          <Modal.Title id="registerModalLabel" className="fw-bold">Join Us Today</Modal.Title>
          <Button variant="close" aria-label="Close" onClick={() => setShowRegisterModal(false)} className="btn-close-white" />
        </Modal.Header>
        <Modal.Body className="py-4">
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleRegisterSubmit}>
            <Form.Group className="mb-3" controlId="registerName">
              <Form.Label className="fw-medium">Full Name</Form.Label>
              <Form.Control 
                type="text" 
                name="name"
                value={registerForm.name}
                onChange={handleRegisterChange}
                placeholder="John Doe" 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="registerEmail">
              <Form.Label className="fw-medium">Email address</Form.Label>
              <Form.Control 
                type="email" 
                name="email"
                value={registerForm.email}
                onChange={handleRegisterChange}
                placeholder="your@email.com" 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="registerPassword">
              <Form.Label className="fw-medium">Password</Form.Label>
              <Form.Control 
                type="password" 
                name="password"
                value={registerForm.password}
                onChange={handleRegisterChange}
                placeholder="••••••••" 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="registerConfirmPassword">
              <Form.Label className="fw-medium">Confirm Password</Form.Label>
              <Form.Control 
                type="password" 
                name="confirmPassword"
                value={registerForm.confirmPassword}
                onChange={handleRegisterChange}
                placeholder="••••••••" 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="fw-medium">I am a:</Form.Label>
              <div className="d-flex gap-3">
                <Form.Check 
                  inline
                  type="radio" 
                  name="userType"
                  id="tenant"
                  value="tenant"
                  checked={registerForm.userType === 'tenant'}
                  onChange={handleRegisterChange}
                  label="Tenant" 
                />
                <Form.Check 
                  inline
                  type="radio" 
                  name="userType"
                  id="landlord"
                  value="landlord"
                  checked={registerForm.userType === 'landlord'}
                  onChange={handleRegisterChange}
                  label="Landlord" 
                />
                <Form.Check 
                  inline
                  type="radio" 
                  name="userType"
                  id="agent"
                  value="agent"
                  checked={registerForm.userType === 'agent'}
                  onChange={handleRegisterChange}
                  label="Agent" 
                />
              </div>
            </Form.Group>
            <Form.Group className="mb-4" controlId="terms">
              <Form.Check 
                type="checkbox" 
                name="terms"
                checked={registerForm.terms}
                onChange={handleRegisterChange}
                label={
                  <>
                    I agree to the <a href="#" className="text-decoration-none text-primary fw-medium">Terms & Conditions</a>
                  </>
                } 
                required 
              />
            </Form.Group>
            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 rounded-pill py-3 mb-3 fw-bold shadow-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
            <div className="text-center pt-2">
              <p className="mb-0 text-muted">
                Already have an account? 
                <a 
                  href="#" 
                  className="text-decoration-none fw-bold text-primary" 
                  onClick={(e) => {
                    e.preventDefault();
                    setShowRegisterModal(false);
                    setShowLoginModal(true);
                  }}
                >
                  Sign in
                </a>
              </p>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* List Property Modal */}
      {/* <Modal show={showListPropertyModal} onHide={() => setShowListPropertyModal(false)} centered size="lg">
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
      </Modal> */}
    </>
  );
}

export default Header;