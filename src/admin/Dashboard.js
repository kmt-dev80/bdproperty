// src/pages/admin/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Card, Row, Col, Table, Button } from 'react-bootstrap';
import { FaHome, FaUsers, FaBuilding, FaChartLine, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalUsers: 0,
    totalAgents: 0,
    recentProperties: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      // Fetch dashboard stats
      const statsResponse = await axios.get('http://localhost/api/users/dashboard.php', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading dashboard...</div>;
  }

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      
      <Row className="mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="icon-box bg-primary bg-opacity-10 text-primary rounded-circle p-3 me-3">
                <FaHome size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Total Properties</h6>
                <h4 className="mb-0">{stats.totalProperties}</h4>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="icon-box bg-success bg-opacity-10 text-success rounded-circle p-3 me-3">
                <FaUsers size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Total Users</h6>
                <h4 className="mb-0">{stats.totalUsers}</h4>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="icon-box bg-info bg-opacity-10 text-info rounded-circle p-3 me-3">
                <FaBuilding size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Total Agents</h6>
                <h4 className="mb-0">{stats.totalAgents}</h4>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="icon-box bg-warning bg-opacity-10 text-warning rounded-circle p-3 me-3">
                <FaChartLine size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Revenue</h6>
                <h4 className="mb-0">$0</h4>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white py-3">
          <h5 className="mb-0">Recent Properties</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Type</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentProperties.length > 0 ? (
                stats.recentProperties.map(property => (
                  <tr key={property.id}>
                    <td>{property.id}</td>
                    <td>{property.title}</td>
                    <td>{property.type}</td>
                    <td>${property.price}</td>
                    <td>
                      <span className={`badge bg-${property.status === 'available' ? 'success' : 'warning'}`}>
                        {property.status}
                      </span>
                    </td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-1">
                        <FaEye />
                      </Button>
                      <Button variant="outline-secondary" size="sm" className="me-1">
                        <FaEdit />
                      </Button>
                      <Button variant="outline-danger" size="sm">
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">No properties found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Dashboard;