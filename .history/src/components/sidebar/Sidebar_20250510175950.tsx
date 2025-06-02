import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const userRole = localStorage.getItem('userRole'); // Obtener el rol del usuario

  return (
    <nav className="sidebar">
      <ul>
        

        {/* Mostrar solo si el usuario tiene el rol 'user' */}
        {userRole === 'user' && (
          <li><Link to="/app/patient-register">Registro</Link></li>
        )}

        {/* Mostrar solo si el usuario tiene el rol 'admin' */}
        {userRole === 'admin' && (
          <li><Link to="/app/gestionar-actividades">Paciente</Link></li>
        )}

        <li><Link to="/">Salir</Link></li> 
      </ul>
    </nav>
  );
};

export default Sidebar;
