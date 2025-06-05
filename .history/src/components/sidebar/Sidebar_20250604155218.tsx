import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const userRole = localStorage.getItem('userRole');

  if (!userRole || (userRole !== 'user' && userRole !== 'admin')) {
    return null;
  }

  return (
    <nav className={`sidebar ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
      <button className="close-sidebar" onClick={onClose} aria-label="Close sidebar">&times;</button>

      {userRole === 'user' && (
        <div className="modalidad">
          <p className="name">Individual</p>
        </div>
      )}

      <ul>
        {userRole === 'user' && (
          <>
            <li><Link to="/user/patient-register" onClick={onClose}>Registro</Link></li>
            <li><Link to="/user/dashboard" onClick={onClose}>Dashboard</Link></li>
            <li><Link to="/user/Sesiones" onClick={onClose}>Sesiones</Link></li>
          </>
        )}

        {userRole === 'admin' && (
          <>
            <li><Link to="/admin/gestionar-actividades" onClick={onClose}>Actividades</Link></li>
            <li><Link to="/admin/gestionar-sesiones" onClick={onClose}>Sesiones</Link></li>
          </>
        )}

        <li><Link to="/" onClick={onClose}>Salir</Link></li>
      </ul>
    </nav>
  );
};

export default Sidebar;
