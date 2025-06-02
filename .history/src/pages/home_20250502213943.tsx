import './Home.css'
import home from '../assets/home.png';
import logoprincipal from '../assets/logoprincipal.png';
    const Home = () => {
        return (
            <>
                <div className="header">
                    <button className='contactos'>Contactos</button>
                    <img src={logoprincipal} alt="logo" />
                    <p className="mision">Misión</p>
                    <p className="vision">Visión</p>
                </div>
                <div className="centro">
                    <h2 className="tittle">Bienvenido a RenovaMind</h2>
                <img src={home} alt="home" />
                <p className="text">Una plataforma diseñada para acompañar, estimular y apoyar 
el bienestar cognitivo de nuestros adultos mayores, 
con el apoyo de quienes los aman.</p>
                </div>
            </>
        )
    }
    
    export default Home
    