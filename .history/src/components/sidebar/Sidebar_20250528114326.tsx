import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const userRole = localStorage.getItem('userRole');

  // Si no hay un rol válido, no renderizar nada o redirigir
  if (!userRole || (userRole !== 'user' && userRole !== 'admin')) {
    return null; // o podrías redirigir
  }

  return (
    <nav className="sidebar">
      {userRole === 'user' && (
        <div className="modalidad">
          <p className="name">Individual</p>
        </div>
      )}

      <ul>
        {userRole === 'user' && (
          <>
            <li><Link to="/app/patient-register">Registro</Link></li>
            <li><Link to="/app/prueba">Prueba</Link></li>
            <li><Link to="/app/dashboard">Dashboard</Link></li>
          </>
        )}

        {userRole === 'admin' && (
          <>
            <li><Link to="/admin/gestionar-actividades">Actividades</Link></li>
            <li><Link to="/admin/gestionar-sesiones">Sesiones</Link></li>
          </>
        )}

        <li><Link to="/">Salir</Link></li>
      </ul>
    </nav>
  );
};


export default Sidebar;
