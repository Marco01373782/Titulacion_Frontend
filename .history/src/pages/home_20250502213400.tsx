import './Home.css'
import home from '../assets/home.png';
import logoprincipal from '../assets/home.png';
    const Home = () => {
        return (
            <>
                <div className="header">
                    <button className='contactos'>Contactos</button>
                    <img src={home} alt="logo" />
                    <p className="mision"></p>
                    <p className="vision"></p>
                </div>
                <div className="centro">
                <img src={home} alt="home" />
                </div>
            </>
        )
    }
    
    export default Home
    