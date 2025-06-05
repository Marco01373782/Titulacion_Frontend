import React from 'react';
import './Header.css';
import Logoprincipal from '../../assets/logosimple.png';
import SettingsIcon from '../../assets/ajustes.svg';
import UserIcon from '../../assets/user.svg';
import ExtraIcon from '../../assets/salir.svg';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <header
      className="header-app"
      style={{
        backgroundColor: userRole === 'admin' ? '#e0e0e0' : '#6ACAC9',
      }}
    >
      <button className="sidebar-toggle" onClick={onToggleSidebar} aria-label="Toggle sidebar">
        &#9776;
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
          role="button"
          tabIndex={0}
          onKeyDown={e => { if(e.key === 'Enter') handleLogout(); }}
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
