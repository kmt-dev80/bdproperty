// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Modal, Form, Alert, NavDropdown } from 'react-bootstrap';
import { useModal } from '../context/ModalContext';
import axios from 'axios';

function Header() {
  const { 
    showLoginModal, 
    setShowLoginModal,
    showRegisterModal, 
    setShowRegisterModal
  } = useModal();
  
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  
  // Form states
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'tenant', // Default to tenant
    terms: false
  });
  
  // Loading and error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        // Parse user data only if it's not null or undefined
        const parsedUser = JSON.parse(userData);
        setIsLoggedIn(true);
        setUser(parsedUser);
      } catch (e) {
        console.error("Error parsing user data:", e);
        // Clear invalid data from localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
  }, []);
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setSuccess('You have been successfully logged out');
  };
  
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
  
  // Handle login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost/api/users/login.php', {
        email: loginForm.email,
        password: loginForm.password
      });
      
      // Check the response structure based on your PHP API
      if (response.data && response.data.success === true) {
        // Save token and user data to localStorage
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Update authentication state
        setIsLoggedIn(true);
        setUser(response.data.user);
        
        // Close modal and show success
        setShowLoginModal(false);
        setSuccess('Login successful!');
        
        // Reset form
        setLoginForm({
          email: '',
          password: '',
          rememberMe: false
        });
        
        // // Redirect based on user type
        // if (response.data.user.user_type === 'admin' || response.data.user.user_type === 'agent') {
        //   window.location.href = '/admin/dashboard';
        // }
      } else {
        // Handle error response
        setError(response.data?.message || 'Login failed');
      }
    } catch (err) {
      // Axios error handling
      if (err.response) {
        // Check if the error response has the expected structure
        if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('Login failed');
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(err.message || 'An error occurred during login');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle registration submission
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
      const response = await axios.post('http://localhost/api/users/register.php', {
        name: registerForm.name,
        email: registerForm.email,
        phone: registerForm.phone,
        password: registerForm.password,
        user_type: registerForm.userType
      });
      
      // Check the response structure based on your PHP API
      if (response.data && response.data.success === true) {
        // Close modal and show success
        setShowRegisterModal(false);
        setSuccess('Registration successful! Please login with your new account.');
        
        // Reset form
        setRegisterForm({
          name: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          userType: 'tenant', // Default to tenant
          terms: false
        });
        
        // Open login modal after successful registration
        setTimeout(() => {
          setShowLoginModal(true);
        }, 1500);
      } else {
        // Handle error response
        setError(response.data?.message || 'Registration failed');
      }
    } catch (err) {
      // Axios error handling
      if (err.response) {
        // Check if the error response has the expected structure
        if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('Registration failed');
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(err.message || 'An error occurred during registration');
      }
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
            <div className="ms-lg-3 mt-3 mt-lg-0 d-flex gap-2 text-light">
              {isLoggedIn ? (
                 <NavDropdown 
                  title={
                  <div className="d-flex align-items-center">
                    {user?.profile_image ? (
                      <img 
                        src={`http://localhost/api/${user.profile_image}`} 
                        alt="Profile" 
                        className="rounded-circle me-2"
                        style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div 
                        className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white me-2"
                        style={{ width: '30px', height: '30px' }}>
                        {user?.name ? user.name.charAt(0).toUpperCase() : <i className="fas fa-user" />}
                      </div>
                          )}
                          <span>{user?.name || user?.email || 'Profile'}</span>
                        </div>
                      } 
                      id="basic-nav-dropdown"
                      align="end"
                    >
                  <NavDropdown.Item as={Link} to="/profile">
                    <i className="fas fa-user me-2"></i> My Profile
                  </NavDropdown.Item>
                  {(user?.user_type === 'admin' || user?.user_type === 'agent') && (
                    <NavDropdown.Item as={Link} to="/admin/dashboard">
                      <i className="fas fa-cog me-2"></i> Admin Panel
                    </NavDropdown.Item>
                  )}
                  <NavDropdown.Item as={Link} to="/settings">
                    <i className="fas fa-cog me-2"></i> Settings
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt me-2"></i> Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <Button variant="warning" onClick={() => setShowLoginModal(true)}>Login</Button>
                  <Button variant="outline-light" onClick={() => setShowRegisterModal(true)}>Register</Button>
                </>
              )}
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
      <Modal show={showLoginModal} onHide={() => {
        setShowLoginModal(false);
        setError('');
      }} centered size="sm">
        <Modal.Header className="bg-gradient-primary text-white border-0 rounded-top">
          <Modal.Title id="loginModalLabel" className="fw-bold">Welcome Back!</Modal.Title>
          <Button variant="close" aria-label="Close" onClick={() => {
            setShowLoginModal(false);
            setError('');
          }} className="btn-close-white" />
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
      <Modal show={showRegisterModal} onHide={() => {
        setShowRegisterModal(false);
        setError('');
      }} centered>
        <Modal.Header className="bg-gradient-primary text-white border-0 rounded-top">
          <Modal.Title id="registerModalLabel" className="fw-bold">Join Us Today</Modal.Title>
          <Button variant="close" aria-label="Close" onClick={() => {
            setShowRegisterModal(false);
            setError('');
          }} className="btn-close-white" />
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
            <Form.Group className="mb-3" controlId="registerPhone">
              <Form.Label className="fw-medium">Phone Number</Form.Label>
              <Form.Control 
                type="tel" 
                name="phone"
                value={registerForm.phone}
                onChange={handleRegisterChange}
                placeholder="(123) 456-7890" 
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
                  id="user"
                  value="user"
                  checked={registerForm.userType === 'user'}
                  onChange={handleRegisterChange}
                  label="User" 
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
    </>
  );
}

export default Header;