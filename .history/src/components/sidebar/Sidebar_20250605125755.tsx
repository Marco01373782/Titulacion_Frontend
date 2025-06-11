  // src/components/Sidebar.tsx
  import React from 'react';
  import { Link } from 'react-router-dom';
  import './Sidebar.css';
  import { useMode } from '../context/ModeContext';
 // 👈 ¡Acá lo traes!

  interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
  }

  const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const { mode } = useMode(); // solo lo usamos para el render condicional

    const userRole = localStorage.getItem('userRole');

    if (!userRole || (userRole !== 'user' && userRole !== 'admin')) {
      return null;
    }

    return (
      <nav className={`sidebar ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
        <button className="close-sidebar" onClick={onClose} aria-label="Close sidebar">&times;</button>

        {userRole === 'user' && <ModeSelector />} {/* 👈 lo ponés aquí */}

        <ul>
          {userRole === 'user' && (
            <>
              <li><Link to="/user/patient-register" onClick={onClose}>Registro</Link></li>
              <li><Link to="/user/dashboard" onClick={onClose}>Dashboard</Link></li>
              {mode === 'INDIVIDUAL' ? (
                <li><Link to="/user/sesiones" onClick={onClose}>Sesiones</Link></li>
              ) : (
                <li><Link to="/user/grupal" onClick={onClose}>Sesión Grupal</Link></li>
              )}
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
