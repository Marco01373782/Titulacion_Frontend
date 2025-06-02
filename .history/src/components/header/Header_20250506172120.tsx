import './Header.css';
import Logoprincipal from '../../assets/logosimple.png';
import SettingsIcon from '../../assets/ajustes.svg';
import UserIcon from '../../assets/user.svg';
import ExtraIcon from '../../assets/salir.svg'; // ícono libre
import u

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="header-app">
      <div className="logoheader">
        <img src={Logoprincipal} alt="logo" />
      </div>

      <div className="contenidoheader">
        <h1 className="tituloapp">Renova Mind</h1>
      </div>

      <div className="ajustesheader">
        <img src={ExtraIcon} alt="extra" className="icono-header" />
        <img src={SettingsIcon} alt="ajustes" className="icono-header" />
        <img src={UserIcon} alt="usuario" className="icono-header" />
      </div>
    </header>
  );
};

export default Header;
