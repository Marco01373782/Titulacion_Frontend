import './Home.css';
import home from '../assets/home.png';
import logoprincipal from '../assets/logoprincipal.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
    return (
        <div className="container">
            <div className="header">
                <button className='contactos'>Contactos</button>

                <img src={logoprincipal} alt="logo" className="logo" />

                <div className="right">
                    <div className="info">
                        <p className="mision">MISION</p>
                        <p className="vision">VISION</p>
                    </div>
                    <FontAwesomeIcon icon={faQuestionCircle} size="2x" className="info-icon" />
                </div>
            </div>

            <div className="centro">
                <h2 className="tittle">Bienvenido a RenovaMind</h2>
                <img src={home} alt="home" />
                <p className="text">
                    Una plataforma diseñada para acompañar, estimular y apoyar<br />
                    el bienestar cognitivo de nuestros adultos mayores,<br />
                    con el apoyo de quienes los aman.
                </p>
                <button className="login">Iniciar Sesión</button>
            </div>
        </div>
    );
};

export default Home;
