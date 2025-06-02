import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const userRole = localStorage.getItem('userRole'); // Obtener el rol del usuario desde localStorage

  return (
    <nav className="sidebar">
      {/* Mostrar div de modalidad solo a usuarios con rol 'user' */}
      {userRole === 'user' && (
        <div className="modalidad">
          <p className="name">Individual</p>
        </div>
      )}

      <ul>
        {/* Links para el usuario */}
        {userRole === 'user' && (
          <>
            <li><Link to="/app/patient-register">Registro</Link></li>
            <li><Link to="/app/prueba">Prueba</Link></li>
            <li><Link to="/app/dashboard">Dashboard</Link></li>
          </>
        )}

        {/* Links para el administrador */}
        {userRole === 'admin' && (
          <>
            <li><Link to="/app/gestionar-actividades">Actividades</Link></li>
            <li><Link to="/app/gestionar-sesiones"><Sesiones></Sesiones></Link></li>
          </>
        )}

        <li><Link to="/">Salir</Link></li>
      </ul>
    </nav>
  );
};

export default Sidebar;
