import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

const TourRequests = () => {
  const { user,get, put, del } = useAuth();
  const [tourRequests, setTourRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  
  useEffect(() => {
    fetchTourRequests();
  }, [currentPage, statusFilter]);
  
  const fetchTourRequests = async () => {
    setLoading(true);
    setError('');
    
    try {
      let url = `/message/get_request.php?page=${currentPage}`;
      if (statusFilter) {
        url += `&status=${statusFilter}`;
      }
      
      const response = await get(url);
      
      if (response && response.success) {
        setTourRequests(response.data);
        setTotalPages(response.pagination.total_pages);
      } else {
        setError('Failed to fetch tour requests');
      }
    } catch (err) {
      setError('Failed to fetch tour requests. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const updateStatus = async (id, status) => {
    try {
      const response = await put(`/message/get_request.php`, { id, status });
      
      if (response && response.success) {
        fetchTourRequests(); // Refresh the list
        alert('Tour request updated successfully');
      } else {
        alert('Failed to update tour request');
      }
    } catch (err) {
      alert('Failed to update tour request. Please try again.');
    }
  };
  
  const deleteTourRequest = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tour request?')) {
      return;
    }
    
    try {
      const response = await del(`/message/get_request.php?id=${id}`);
      
      if (response && response.success) {
        fetchTourRequests();
        alert('Tour request deleted successfully');
      } else {
        alert('Failed to delete tour request');
      }
    } catch (err) {
      alert('Failed to delete tour request. Please try again.');
    }
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-warning';
      case 'confirmed':
        return 'bg-success';
      case 'completed':
        return 'bg-info';
      case 'cancelled':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };
  
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading tour requests...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
        <button className="btn btn-outline-danger ms-2" onClick={fetchTourRequests}>
          Retry
        </button>
      </div>
    );
  }
  
  return (
    <div className="tour-requests-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Tour Requests</h2>
        <div className="d-flex align-items-center">
          <select 
            className="form-select-sm me-2" 
            style={{ width: 'auto' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button className="btn btn-primary" onClick={fetchTourRequests}>
            <i className="fas fa-sync-alt me-2"></i>Refresh
          </button>
        </div>
      </div>
      
      {tourRequests.length === 0 ? (
        <div className="alert alert-info">No tour requests found.</div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Property</th>
                  <th>Message</th>
                  <th>Requester</th>
                  <th>Contact_No</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tourRequests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.id}</td>
                    <td>
                      <div>{request.property_title}</div>
                      <div>Property_id = {request.property_id}</div>
                    </td>
                    <td>{request.message}</td>
                    <td>
                      <div>{request.user_name}</div>
                      <small className="text-muted">{request.user_email}</small>
                    </td>
                    <td>{request.phone}</td>
                    <td>
                      <div>{request.date}</div>
                      <small className="text-muted">{request.time}</small>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group">
                        <select 
                          className="form-select-sm me-2" 
                          style={{ width: 'auto' }}
                          value={request.status}
                          onChange={(e) => updateStatus(request.id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteTourRequest(request.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <nav>
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}
                
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default TourRequests;