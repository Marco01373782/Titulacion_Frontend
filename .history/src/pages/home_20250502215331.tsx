import './Home.css';
import home from '../assets/home.png';
import logoprincipal from '../assets/logoprincipal.png';

const Home = () => {
    return (
        <div className="container">
            <div className="header">
                <button className='contactos'>Contactos</button>
                <img src={logoprincipal} alt="logo" />
                <div className='MIVI'>
                    <p className="mision">Misión</p>
                    <p className="vision">Visión</p>
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
