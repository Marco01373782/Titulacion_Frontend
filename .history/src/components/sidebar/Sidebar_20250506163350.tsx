import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <ul>
        <li><Link to="/app/dashboard">Dashboard</Link></li>
        <li><Link to="/app/prueba">Prueba</Link></li> 
        {/* Agrega más enlaces según sea necesario */}
      </ul>
    </nav>
  );
};

export default Sidebar;
