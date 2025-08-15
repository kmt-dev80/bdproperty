// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import { Link} from 'react-router-dom';
import { Card, Form, Button, Alert, Row, Col, Tabs, Tab, Table, Badge } from 'react-bootstrap';
import { FaUser, FaHome, FaHeart, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { useAuth } from '../admin/AuthContext';

function Profile() {
  const { user, loading, get, post, uploadFile} = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [savedProperties, setSavedProperties] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  useEffect(() => {
    if (!loading && user) {
      // Set form data
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Set profile image preview
      if (user.profile_image) {
        setImagePreview(`http://localhost/api/${user.profile_image}`);
      }
    }
  }, [user, loading]);
  
  useEffect(() => {
    const fetchSavedProperties = async () => {
      try {
        const response = await get('/users/get_saved_properties.php');
        if (response.success) {
          setSavedProperties(response.properties);
        }
      } catch (err) {
        console.error('Error fetching saved properties:', err);
      }
    };
    
    if (user) {
      fetchSavedProperties();
    }
  }, [user, get]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (isSubmitting) return;
    
    try {
      // Validate passwords if changing
      if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
        setError('New passwords do not match');
        return;
      }
      
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add form fields
      Object.keys(profileForm).forEach(key => {
        if (key !== 'confirmPassword') {
          formData.append(key, profileForm[key]);
        }
      });
      
      // Add profile image if selected
      if (profileImage) {
        formData.append('profile_image', profileImage);
      }
      
      const response = await uploadFile('/users/update_profile.php', formData);
      
      if (response.success) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        
        // Update user data in localStorage
        const updatedUser = { ...user, ...response.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Update context user
        // Note: This would require additional context updates
        // For simplicity, we'll just reload the user data
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        
        // Reset password fields
        setProfileForm(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'An error occurred while updating your profile');
    }finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRemoveSavedProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to remove this property from your saved list?')) {
      return;
    }
    
    try {
      const response = await post('/users/remove_saved_property.php', { property_id: propertyId });
      
      if (response.success) {
        // Update saved properties list
        setSavedProperties(savedProperties.filter(prop => prop.id !== propertyId));
        setSuccess('Property removed from saved list');
      } else {
        setError(response.message || 'Failed to remove property');
      }
    } catch (err) {
      console.error('Error removing saved property:', err);
      setError('An error occurred while removing the property');
    }
  };
  
  const toggleEdit = () => {
    if (isEditing) {
      // Cancel editing - reset form to original values
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Reset image preview
      if (user.profile_image) {
        setImagePreview(`http://localhost/api/${user.profile_image}`);
      } else {
        setImagePreview(null);
      }
      setProfileImage(null);
    }
    setIsEditing(!isEditing);
    setError('');
    setSuccess('');
  };
  
  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          You must be logged in to view your profile.
        </div>
        <Link to="/login" className="btn btn-primary">
          Login
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-4">
          {/* Profile Card */}
          <Card className="mb-4 shadow-sm">
            <Card.Body className="text-center p-4">
              <div className="position-relative d-inline-block mb-3">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Profile" 
                    className="rounded-circle img-thumbnail"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                ) : (
                  <div 
                    className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white"
                    style={{ width: '150px', height: '150px', fontSize: '3rem' }}
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : <FaUser />}
                  </div>
                )}
                {isEditing && (
                  <div className="position-absolute bottom-0 end-0">
                    <label htmlFor="profileImageUpload" className="btn btn-sm btn-primary rounded-circle">
                      <FaEdit />
                    </label>
                    <input
                      type="file"
                      id="profileImageUpload"
                      className="d-none"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                )}
              </div>
              
              <h4 className="mb-1">{user.name}</h4>
              <p className="text-muted mb-3">{user.email}</p>
              <Badge bg={user.user_type === 'admin' ? 'danger' : user.user_type === 'agent' ? 'primary' : 'info'}>
                {user.user_type.charAt(0).toUpperCase() + user.user_type.slice(1)}
              </Badge>
              
              <div className="d-grid gap-2 mt-4">
                <Button 
                  variant={isEditing ? "secondary" : "primary"} 
                  onClick={toggleEdit}
                >
                  {isEditing ? <><FaTimes className="me-2" /> Cancel</> : <><FaEdit className="me-2" /> Edit Profile</>}
                </Button>
                <Link to="/dashboard" className="btn btn-outline-primary">
                  <FaHome className="me-2" /> Dashboard
                </Link>
              </div>
            </Card.Body>
          </Card>
          
          {/* Quick Stats */}
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Quick Stats</h5>
              <div className="d-flex justify-content-between mb-2">
                <span>Member Since</span>
                <span>{new Date(user.created_at).toLocaleDateString()}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Saved Properties</span>
                <span>{savedProperties.length}</span>
              </div>
            </Card.Body>
          </Card>
        </div>
        
        <div className="col-lg-8">
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Card className="shadow-sm">
            <Card.Body>
              <Tabs defaultActiveKey="profile" id="profile-tabs">
                <Tab eventKey="profile" title="Profile Information">
                  <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group controlId="name">
                          <Form.Label>Full Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={profileForm.name}
                            onChange={handleInputChange}
                            required
                            disabled={!isEditing}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="email">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={profileForm.email}
                            onChange={handleInputChange}
                            required
                            disabled={!isEditing}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group controlId="phone">
                          <Form.Label>Phone Number</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={profileForm.phone}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="userType">
                          <Form.Label>User Type</Form.Label>
                          <Form.Control
                            type="text"
                            value={user.user_type.charAt(0).toUpperCase() + user.user_type.slice(1)}
                            disabled
                            readOnly
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Form.Group className="mb-3" controlId="bio">
                      <Form.Label>Bio</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="bio"
                        value={profileForm.bio}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Form.Group>
                    
                    {isEditing && (
                      <>
                        <hr />
                        <h5 className="mb-3">Change Password</h5>
                        <Row className="mb-3">
                          <Col md={4}>
                            <Form.Group controlId="currentPassword">
                              <Form.Label>Current Password</Form.Label>
                              <Form.Control
                                type="password"
                                name="currentPassword"
                                value={profileForm.currentPassword}
                                onChange={handleInputChange}
                              />
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group controlId="newPassword">
                              <Form.Label>New Password</Form.Label>
                              <Form.Control
                                type="password"
                                name="newPassword"
                                value={profileForm.newPassword}
                                onChange={handleInputChange}
                              />
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group controlId="confirmPassword">
                              <Form.Label>Confirm New Password</Form.Label>
                              <Form.Control
                                type="password"
                                name="confirmPassword"
                                value={profileForm.confirmPassword}
                                onChange={handleInputChange}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </>
                    )}
                    
                    {isEditing && (
                      <div className="d-grid gap-2 mt-4">
                        <Button type="submit" variant="primary">
                          <FaSave className="me-2" /> Save Changes
                        </Button>
                      </div>
                    )}
                  </Form>
                </Tab>
                
                <Tab eventKey="saved" title={`Saved Properties (${savedProperties.length})`}>
                  {savedProperties.length > 0 ? (
                    <div className="table-responsive">
                      <Table hover>
                        <thead>
                          <tr>
                            <th>Property</th>
                            <th>Type</th>
                            <th>Price</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {savedProperties.map(property => (
                            <tr key={property.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  {property.primary_image && (
                                    <img 
                                      src={`http://localhost/api/${property.primary_image}`} 
                                      alt={property.title}
                                      className="me-2"
                                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                  )}
                                  <div>
                                    <Link to={`/property/${property.id}`} className="text-decoration-none fw-bold">
                                      {property.title}
                                    </Link>
                                    <div className="text-muted small">
                                      {property.address}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <Badge bg="secondary">
                                  {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                                </Badge>
                              </td>
                              <td>${property.price.toLocaleString()}/mo</td>
                              <td>
                                <Link 
                                  to={`/property/${property.id}`} 
                                  className="btn btn-sm btn-outline-primary me-1"
                                >
                                  View
                                </Link>
                                <Button 
                                  variant="outline-danger" 
                                  size="sm"
                                  onClick={() => handleRemoveSavedProperty(property.id)}
                                >
                                  <FaHeart className="text-danger" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <FaHeart className="text-muted mb-3" style={{ fontSize: '2rem' }} />
                      <h5>No Saved Properties</h5>
                      <p className="text-muted">You haven't saved any properties yet.</p>
                      <Link to="/properties" className="btn btn-primary">
                        Browse Properties
                      </Link>
                    </div>
                  )}
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}
export default Profile;