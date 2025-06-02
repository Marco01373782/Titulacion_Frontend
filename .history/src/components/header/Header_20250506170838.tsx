import './Header.css';
import Logoprincipal from '../../assets/logosimple.png';
import SettingsIcon from '../../assets/ajustes.svg';
import UserIcon from '../../assets/user.svg';
import ExtraIcon from '../../assets/salir.svg'; // ícono libre

const Header = () => {
  return (
    <header className="header-app">
      <div className="logoheader">
        <img src={Logoprincipal} alt="logo" />
      </div>

      <div className="contenidoheader">
        <h1 className="tituloapp">Renova </h1>
      </div>

      <div className="ajustesheader">
        <img src={UserIcon} alt="usuario" className="icono-header" />
        <img src={SettingsIcon} alt="ajustes" className="icono-header" />
        <img src={ExtraIcon} alt="extra" className="icono-header" />
      </div>
    </header>
  );
};

export default Header;
