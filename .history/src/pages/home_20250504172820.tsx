import './Home.css';
import home from '../assets/home.png';
import logoprincipal from '../assets/logoprincipal.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import Modal from '../components/Modal';
import { useState } from 'react';

const Home = () => {
    const [modalData, setModalData] = useState<{ title: string, content: string } | null>(null);

    const openModal = (type: 'mision' | 'vision') => {
        if (type === 'mision') {
            setModalData({
                title: 'Misión',
                content: 'Nuestra misión es mejorar la calidad de vida cognitiva de los adultos mayores a través de herramientas digitales accesibles y actividades significativas.'
            });
        } else {
            setModalData({
                title: 'Visión',
                content: 'Ser la plataforma líder en acompañamiento y estimulación cognitiva, reconocida por su impacto positivo en el bienestar de las personas mayores.'
            });
        }
    };

    const closeModal = () => {
        setModalData(null);
    };

    return (
        <div className="container">
            <div className="header">
                <button className='contactos'>Contactos</button>

                <img src={logoprincipal} alt="logo" className="logo" />

                <div className="right">
                    <div className="info">
                        <p className="mision" onClick={() => openModal('mision')}>Misión</p>
                        <p className="vision" onClick={() => openModal('vision')}>Visión</p>
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

            {modalData && (
                <Modal
                    title={modalData.title}
                    content={modalData.content}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default Home;
