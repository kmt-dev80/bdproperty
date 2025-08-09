// src/pages/admin/Properties.js
import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { FaPlus, FaSearch, FaEye, FaEdit, FaTrash, FaFilter } from 'react-icons/fa';
import { useAuth } from '../AuthContext'; // Import useAuth instead of axios

const Properties = () => {
  const { get, post } = useAuth(); // Use get and post methods from AuthContext
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      // Use get method from AuthContext
      const response = await get('/properties/get_property.php');
      
      if (response.success) {
        setProperties(response.properties);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        // Use post method from AuthContext
        const response = await post('/properties/delete_property.php', { property_id: id });
        
        if (response.success) {
          // Remove property from state
          setProperties(properties.filter(property => property.id !== id));
          alert('Property deleted successfully');
        } else {
          alert(response.message || 'Failed to delete property');
        }
      } catch (error) {
        console.error('Error deleting property:', error);
        alert('An error occurred while deleting the property');
      }
    }
  };

  // Filter properties based on search term and filters
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          property.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || property.type === filterType;
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) {
    return <div className="text-center py-5">Loading properties...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Properties Management</h2>
        <Button href="/admin/add-property" variant="primary">
          <FaPlus className="me-2" /> Add Property
        </Button>
      </div>
      
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            
            <Col md={3}>
              <Form.Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="all">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="office">Office</option>
                <option value="store">Store</option>
                <option value="villa">Villa</option>
                <option value="land">Land</option>
              </Form.Select>
            </Col>
            
            <Col md={3}>
              <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="maintenance">Maintenance</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white py-3">
          <h5 className="mb-0">Properties List</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Type</th>
                <th>Price</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.length > 0 ? (
                filteredProperties.map(property => (
                  <tr key={property.id}>
                    <td>{property.id}</td>
                    <td>{property.title}</td>
                    <td>{property.type}</td>
                    <td>${property.price}</td>
                    <td>{property.location}</td>
                    <td>
                      <span className={`badge bg-${property.status === 'available' ? 'success' : property.status === 'rented' ? 'primary' : 'warning'}`}>
                        {property.status}
                      </span>
                    </td>
                    <td>
                      <Button href={`/property/${property.id}`} variant="outline-primary" size="sm" className="me-1" target="_blank">
                        <FaEye />
                      </Button>
                      <Button href={`/admin/edit-property/${property.id}`} variant="outline-secondary" size="sm" className="me-1">
                        <FaEdit />
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(property.id)}>
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">No properties found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Properties;