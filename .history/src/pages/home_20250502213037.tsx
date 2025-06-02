import './Home.css'
import home from '../assets/logo.png';
    const Home = () => {
        return (
            <>
                <div className="header">
                    <button className='contactos'>Contactos</button>
                    <img src={home} alt="home" />
                </div>
                <div className="centro">

                </div>
            </>
        )
    }
    
    export default Home
    