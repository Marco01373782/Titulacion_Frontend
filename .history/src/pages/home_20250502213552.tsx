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
                    <p className="vision"></p>
                </div>
                <div className="centro">
                <img src={home} alt="home" />
                </div>
            </>
        )
    }
    
    export default Home
    