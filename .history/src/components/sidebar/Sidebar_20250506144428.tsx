import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <ul>
        <li><Link to="/home">Dashboard</Link></li>
        <li><Link to="/app/prueba">Prueba</Link></li> {/* Enlace a la página de prueba */}
        {/* Agrega más enlaces según sea necesario */}
      </ul>
    </nav>
  );
};

export default Sidebar;
