import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <ul>
        <li><Link to="/app/dashboard">Dashboard</Link></li>
        <li><Link to="/app/prueba">Prueba</Link></li> 
        
        <li><Link to="/app/patient-register">Registro</Link></li> 
        <li><Link to="/app/gestionar-actividades">Paciente</Link></li> 
      </ul>
    </nav>
  );
};

export default Sidebar;
