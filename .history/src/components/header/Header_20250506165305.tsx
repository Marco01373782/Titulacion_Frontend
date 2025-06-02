
import './Header.css';
import Logoprincipal from '../../assets/logoprincipal.png'

const Header = () => {
  return (
    <header className="header-app">
      <div className="logoheader">
        <img src={Logoprincipal} alt="logo" />
      </div>
      <div className="contenidoheader">

      </div>
      <div className="ajustes">

      </div>
    </header>
  );
};

export default Header;
