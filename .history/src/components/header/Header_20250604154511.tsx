import React from 'react';
import Logoprincipal from '../../assets/logo-principal.svg';
import { AiOutlineUser, AiOutlineLogout } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import './Header.css';

type HeaderProps = {
  toggleSidebar: () => void;
};

const Header = ({ toggleSidebar }: HeaderProps) => {
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
      <button
        className="hamburger-btn"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        &#9776;
      </button>

      <div className="logoheader">
        <img src={Logoprincipal} alt="logo" />
      </div>

      <div className="contenidoheader">
        <h1 className="tituloapp">Renova Mind</h1>
      </div>

      <div className="iconosheader">
        <AiOutlineUser className="iconheader" />
        <AiOutlineLogout className="iconheader" onClick={handleLogout} />
        <span className="rolusuario">{userRole}</span>
      </div>
    </header>
  );
};

export default Header;
