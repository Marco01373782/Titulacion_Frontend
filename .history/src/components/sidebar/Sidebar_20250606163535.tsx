  import React from 'react';
  import { Link } from 'react-router-dom';
  import { useMode } from '../context/ModeContext';
  import './Sidebar.css';
  import Grupo from '../../assets/grupo.svg';
import iconIndividual from '../../assets/user.svg';


  interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
  }

  const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const { mode, setMode } = useMode(); // ✅ PRIMERO se usa el hook

    const toggleMode = () => {
      setMode(mode === 'INDIVIDUAL' ? 'GRUPAL' : 'INDIVIDUAL');
    };

    const userRole = localStorage.getItem('userRole');

    if (!userRole || (userRole !== 'user' && userRole !== 'admin')) {
      return null;
    }

    return (
      <nav className={`sidebar ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
        <button className="close-sidebar" onClick={onClose} aria-label="Close sidebar">&times;</button>

        {userRole === 'user' && (
          <div className="modo-card" onClick={toggleMode}>
            <img
              src={mode === 'GRUPAL' ? Grupo : iconIndividual}
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
              {mode === 'INDIVIDUAL' ? (
          <Route path="Sesiones" element={<SesionRouter />} />
                <li><Link to="/user/" onClick={onClose}>Sesiones</Link></li>
              ) : (
                <li><Link to="/user/terapias-sesiones/:id" onClick={onClose}>Sesión Grupal</Link></li>
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
