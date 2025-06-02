import './Home.css'
import home from '../assets/home.png';
    const Home = () => {
        return (
            <>
                <div className="header">
                    <button className='contactos'>Contactos</button>
                    <img src={home} alt="home" />
                    <p className="mision"></p>
                    p.vision
                </div>
                <div className="centro">

                </div>
            </>
        )
    }
    
    export default Home
    