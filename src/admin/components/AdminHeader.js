import React from 'react';
import { FaBars, FaBell, FaSearch, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({ toggleSidebar, user }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  return (
    <header className="admin-header bg-light shadow-sm">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center py-3">
          <div className="d-flex align-items-center">
            <button className="btn btn-sm btn-light me-3 d-md-none" onClick={toggleSidebar}>
              <FaBars />
            </button>
            <h4 className="mb-0">Admin Panel</h4>
          </div>
          
          <div className="d-flex align-items-center">
            <div className="search-box me-3 d-none d-md-block">
              <div className="input-group">
                <span className="input-group-text bg-light border-0">
                  <FaSearch />
                </span>
                <input 
                  type="text" 
                  className="form-control bg-light border-0" 
                  placeholder="Search..." 
                />
              </div>
            </div>
            
            <div className="notifications me-3">
              <button className="btn btn-light position-relative">
                <FaBell />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  3
                </span>
              </button>
            </div>
            
            <div className="user-dropdown dropdown">
              <button 
                className="btn btn-light d-flex align-items-center" 
                data-bs-toggle="dropdown"
              >
                <FaUserCircle className="me-2" />
                <span>{user?.name}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><a className="dropdown-item" href="#">Profile</a></li>
                <li><a className="dropdown-item" href="#">Settings</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;