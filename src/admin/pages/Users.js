// src/admin/pages/Users.js
import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, InputGroup, Row, Col, Alert, Modal, Badge } from 'react-bootstrap';
import { FaSearch, FaEdit, FaTrash, FaUserPlus, FaFilter } from 'react-icons/fa';
import { useAuth } from '../AuthContext';

const Users = () => {
  const { get, post } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [filterType]); // Refetch when filter changes

  const fetchUsers = async () => {
    try {
      // Add filter parameter to the API call
      const endpoint = filterType === 'all' 
        ? '/users/get_all_users.php' 
        : `/users/get_all_users.php?type=${filterType}`;
        
      const response = await get(endpoint);
      
      if (response.success) {
        setUsers(response.users || []);
      } else {
        setError(response.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('An error occurred while fetching users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
    setError('');
  };

  const handleDeleteConfirm = async () => {
  if (!selectedUser) return;
  
  try {
    const response = await post('/users/delete_user.php', { id: selectedUser.id });
    
    if (response.success) {
      // Remove user from state
      setUsers(users.filter(user => user.id !== selectedUser.id));
      setShowDeleteModal(false);
      setSelectedUser(null);
      setSuccess('User deleted successfully'); // Set success message
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(response.message || 'Failed to delete user');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    setError('An error occurred while deleting the user');
  }
};

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  // Filter users based on search term (client-side filtering)
  const filteredUsers = users.filter(user => {
    return user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Count users by type for stats
  const userCounts = {
    all: users.length,
    user: users.filter(u => u.user_type === 'user').length,
    tenant: users.filter(u => u.user_type === 'tenant').length,
    landlord: users.filter(u => u.user_type === 'landlord').length,
    agent: users.filter(u => u.user_type === 'agent').length,
  };

  if (loading) {
    return <div className="text-center py-5">Loading users...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Users Management</h2>
        <Button href="/admin/add-user" variant="primary">
          <FaUserPlus className="me-2" /> Add User
        </Button>
      </div>
      {success && (
        <Alert variant="success" className="mb-4">
          {success}
        </Alert>
      )}
      
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}
      
      {/* User Type Stats Cards */}
      <Row className="mb-4">
        <Col md={2}>
          <Card 
            className={`text-center ${filterType === 'all' ? 'border-primary' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={() => setFilterType('all')}
          >
            <Card.Body>
              <h4>{userCounts.all}</h4>
              <p className="mb-0">All Users</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={2}>
          <Card 
            className={`text-center ${filterType === 'user' ? 'border-primary' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={() => setFilterType('user')}
          >
            <Card.Body>
              <h4>{userCounts.user}</h4>
              <p className="mb-0">Users</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={2}>
          <Card 
            className={`text-center ${filterType === 'tenant' ? 'border-primary' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={() => setFilterType('tenant')}
          >
            <Card.Body>
              <h4>{userCounts.tenant}</h4>
              <p className="mb-0">Tenants</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={2}>
          <Card 
            className={`text-center ${filterType === 'landlord' ? 'border-primary' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={() => setFilterType('landlord')}
          >
            <Card.Body>
              <h4>{userCounts.landlord}</h4>
              <p className="mb-0">Landlords</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={2}>
          <Card 
            className={`text-center ${filterType === 'agent' ? 'border-primary' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={() => setFilterType('agent')}
          >
            <Card.Body>
              <h4>{userCounts.agent}</h4>
              <p className="mb-0">Agents</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={2}>
          <Card className="text-center">
            <Card.Body>
              <Button variant="outline-secondary" size="sm" onClick={() => setFilterType('all')}>
                <FaFilter className="me-1" /> Clear Filter
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row>
            <Col md={8}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            
            <Col md={4}>
              <Form.Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="all">All Types</option>
                <option value="user">User</option>
                <option value="tenant">Tenant</option>
                <option value="landlord">Landlord</option>
                <option value="agent">Agent</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            {filterType === 'all' ? 'All Users' : 
             filterType === 'user' ? 'Users' :
             filterType === 'tenant' ? 'Tenants' :
             filterType === 'landlord' ? 'Landlords' : 'Agents'}
          </h5>
          <Badge bg="primary">{filteredUsers.length}</Badge>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Type</th>
                <th>Joined</th>
                <th>Properties</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || 'N/A'}</td>
                    <td>
                      <span className={`badge bg-${
                        user.user_type === 'admin' ? 'danger' : 
                        user.user_type === 'agent' ? 'primary' : 
                        user.user_type === 'landlord' ? 'info' : 'secondary'
                      }`}>
                        {user.user_type}
                      </span>
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td>{user.property_count || 0}</td>
                    <td>
                      <Button href={`/admin/edit-user/${user.id}`} variant="outline-secondary" size="sm" className="me-1">
                        <FaEdit />
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteClick(user)}>
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    {users.length === 0 ? "No users found in the database" : "No users match your filters"}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleDeleteCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the user "{selectedUser?.name}"? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Users;