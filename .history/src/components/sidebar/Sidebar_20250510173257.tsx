import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const userRole = localStorage.getItem('userRole'); // Obtenemos el rol del usuario desde el localStorage

  return (
    <nav className="sidebar">
      <ul>
        <li><Link to="/app/dashboard">Dashboard</Link></li>

        {/* Mostrar "Prueba" solo si el rol es admin */}
        {userRole === 'admin' && <li><Link to="/app/prueba">Prueba</Link></li>}

        {/* Mostrar "Registro" solo si el rol es admin */}
        {userRole === 'admin' && <li><Link to="/app/patient-register">Registro</Link></li>}

        {/* Mostrar "Paciente" solo si el rol es user */}
        {userRole === 'user' && <li><Link to="/app">Paciente</Link></li>}

        {/* Enlace para cerrar sesión */}
        <li><Link to="/">Salir</Link></li>
      </ul>
    </nav>
  );
};

export default Sidebar;
