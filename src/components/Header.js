import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Modal, Form, Alert } from 'react-bootstrap';
import { useModal } from '../context/ModalContext';

function Header() {
  const { 
    showLoginModal, 
    setShowLoginModal,
    showRegisterModal, 
    setShowRegisterModal
  } = useModal();

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
      
      // Reset form
      setLoginForm({
        email: '',
        password: '',
        rememberMe: false
      });
      
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
      
      // Reset form
      setRegisterForm({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        userType: 'tenant',
        terms: false
      });
      
      // Open login modal
      setTimeout(() => setShowLoginModal(true), 500);
      
    } catch (err) {
      setError(err.message || 'An error occurred during registration');
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
    </>
  );
}

export default Header;