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
                p
                </div>
            </>
        )
    }
    
    export default Home
    