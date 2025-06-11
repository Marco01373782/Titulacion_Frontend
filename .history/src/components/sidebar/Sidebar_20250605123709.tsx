import React from 'react';
import { Link } from 'react-router-dom';
import { useMode } from '../context/ModeContext';// 👈 importa contexto
import './Sidebar.css';
import grupo from '../../../../../assets/

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const toggleMode = () => {
  setMode(mode === 'INDIVIDUAL' ? 'GRUPAL' : 'INDIVIDUAL');
};

  const userRole = localStorage.getItem('userRole');
  const { mode, setMode } = useMode(); // 👈 usa el hook

  if (!userRole || (userRole !== 'user' && userRole !== 'admin')) {
    return null;
  }

  return (
    <nav className={`sidebar ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
      <button className="close-sidebar" onClick={onClose} aria-label="Close sidebar">&times;</button>

      {userRole === 'user' && (
        <div className="modo-card" onClick={toggleMode}>
          <img
              src={mode === 'GRUPAL' ? {} : '/icons/user.png'}
              alt="Modo icono"
              className="modo-icono"
            />
            <span className="modo-texto">{mode}</span>
            <span className="modo-flecha">»</span>
          </div>

      )}

      <ul>
        {userRole === 'user' && (
          <>
            <li><Link to="/user/patient-register" onClick={onClose}>Registro</Link></li>
            <li><Link to="/user/dashboard" onClick={onClose}>Dashboard</Link></li>

            {/* 🔁 Cambia ruta según modalidad */}
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
