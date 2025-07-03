import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Sidebar.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    // Close mobile sidebar after navigation
    setIsMobileOpen(false);
  };

  const menuItems = [
    {
      id: 'admin-panel',
      label: 'Admin Panel',
      path: '/AdminPage',
      icon: '⚙️'
    },
    {
      id: 'ljekare',
      label: 'Ljekare',
      path: '/AdminDoktori',
      icon: '👨‍⚕️'
    },
    {
      id: 'ustanove',
      label: 'Ustanove',
      path: '/AdminUstanove',
      icon: '🏥'
    },
    {
      id: 'zahtjevi',
      label: 'Zahtjevi',
      path: '/requests',
      icon: '📋'
    }
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="mobile-sidebar-toggle d-md-none"
        onClick={toggleMobileSidebar}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="mobile-sidebar-overlay d-md-none"
          onClick={toggleMobileSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Desktop Toggle Button */}
        <button
          className="sidebar-toggle d-none d-md-block"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? '▶' : '◀'}
        </button>

        {/* Sidebar Header */}
        <div className="sidebar-header">
          {!isCollapsed && (
            <h5 className="sidebar-title">Navigacija</h5>
          )}
        </div>

        {/* Sidebar Menu */}
        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {menuItems.map((item) => (
              <li key={item.id} className="sidebar-menu-item">
                <button
                  className="sidebar-menu-link"
                  onClick={() => handleNavigation(item.path)}
                  title={isCollapsed ? item.label : ''}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="sidebar-label">{item.label}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;