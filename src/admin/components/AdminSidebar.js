import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaHome, FaUsers, FaBuilding, FaSignOutAlt, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const AdminSidebar = ({ isOpen, toggleSidebar, user, onLogout }) => {
  return (
    <div className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h3 className="text-white">Luxury Homes</h3>
        <button className="btn btn-sm btn-light d-md-none" onClick={toggleSidebar}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <div className="sidebar-user">
        <div className="user-avatar">
          <i className="fas fa-user-circle fa-3x text-white"></i>
        </div>
        <div className="user-info">
          <h5 className="text-white">{user?.name}</h5>
          <p className="text-white-50">{user?.user_type}</p>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="nav flex-column">
          <li className="nav-item">
            <NavLink to="/admin/dashboard" className="nav-link">
              <FaTachometerAlt className="me-2" />
              Dashboard
            </NavLink>
          </li>
          
          <li className="nav-item">
            <NavLink to="/admin/properties" className="nav-link">
              <FaHome className="me-2" />
              Properties
            </NavLink>
          </li>
          
          <li className="nav-item">
            <NavLink to="/admin/add-property" className="nav-link">
              <FaPlus className="me-2" />
              Add Property
            </NavLink>
          </li>
          
          {user?.user_type === 'admin' && (
            <>
              <li className="nav-item">
                <NavLink to="/admin/users" className="nav-link">
                  <FaUsers className="me-2" />
                  Users
                </NavLink>
              </li>
              
              <li className="nav-item">
                <NavLink to="/admin/agents" className="nav-link">
                  <FaBuilding className="me-2" />
                  Agents
                </NavLink>
              </li>
            </>
          )}
          
          <li className="nav-item mt-auto">
            <button className="nav-link btn btn-link text-start w-100" onClick={onLogout}>
              <FaSignOutAlt className="me-2" />
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;