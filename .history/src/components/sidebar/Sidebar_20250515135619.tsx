import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const userRole = localStorage.getItem('userRole'); // Obtener el rol del usuario desde localStorage

  return (
    <nav className="sidebar">
      <div className="modalidad">
        <p className="name"></p>
      </div>
      <ul>
        {/* Mostrar solo si el usuario tiene el rol 'user' */}
        {userRole === 'user' && (
          <>
            <li><Link to="/app/patient-register">Registro</Link></li>
            <li><Link to="/app/prueba">Prueba</Link></li>
            <li><Link to="/app/dashboard">Dashboard</Link></li>
          </>
        )}
        {/* Mostrar solo si el usuario tiene el rol 'admin' */}
        {userRole === 'admin' && (
          <>
            <li><Link to="/app/gestionar-actividades">Gestionar Actividades</Link></li>
          </>
        )}
        <li><Link to="/">Salir</Link></li> 
      </ul>
    </nav>
  );
};

export default Sidebar;
