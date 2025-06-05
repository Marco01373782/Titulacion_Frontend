import './Header.css';
import Logoprincipal from '../../assets/logosimple.png';
import SettingsIcon from '../../assets/ajustes.svg';
import UserIcon from '../../assets/user.svg';
import ExtraIcon from '../../assets/salir.svg';
import { useNavigate } from 'react-router-dom';

type HeaderProps = {
  onToggleSidebar: () => void;
};

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {

  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header
      className="header-app"
      style={{
        backgroundColor: userRole === 'admin' ? '#e0e0e0' : '#6ACAC9',
      }}
    >
      <button className="menu-button" onClick={onToggleSidebar}>
  ☰
</button>

      <div className="logoheader">
        <img src={Logoprincipal} alt="logo" />
      </div>

      <div className="contenidoheader">
        <h1 className="tituloapp">Renova Mind</h1>
      </div>

      <div className="ajustesheader">
        <img
          src={ExtraIcon}
          alt="Salir"
          className="icono-header"
          onClick={handleLogout}
        />
        <img
          src={SettingsIcon}
          alt="Ajustes"
          className="icono-header"
        />
        <img
          src={UserIcon}
          alt="Usuario"
          className="icono-header"
        />
        <div className={`rol-header ${userRole}`}>
          {userRole === 'admin' ? 'Admin' : 'User'}
        </div>
      </div>
    </header>
  );
};

export default Header;
