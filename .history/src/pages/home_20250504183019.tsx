import './Home.css';
import home from '../assets/home.png';
import logoprincipal from '../assets/logoprincipal.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import Modal from '../components/modal/Modal';
import Co from '../components/modal/Modal';
import { useState } from 'react';

const Home = () => {
    const [modalData, setModalData] = useState<{ title: string, content: string } | null>(null);
    const [showContact, setShowContact] = useState(false); // ← ESTADO PARA EL MODAL DE CONTACTO

    const openModal = (type: 'mision' | 'vision') => {
        if (type === 'mision') {
            setModalData({
                title: 'Misión',
                content: 'Proporcionar una solución accesible y efectiva de terapia cognitiva para adultos mayores, ayudando a familiares y cuidadores a gestionar el bienestar mental de sus seres queridos. A través de nuestra plataforma, buscamos mejorar la calidad de vida de los adultos mayores con herramientas personalizadas que faciliten su bienestar emocional y cognitivo.'
            });
        } else {
            setModalData({
                title: 'Visión',
                content: 'Ser la plataforma de referencia en el cuidado cognitivo de adultos mayores, transformando la manera en que familias y cuidadores apoyan la salud mental de sus seres queridos, promoviendo un envejecimiento activo, saludable y con una calidad de vida superior.'
            });
        }
    };

    const closeModal = () => {
        setModalData(null);
    };

    return (
        <div className="container">
            <div className="header">
                <button className='contactos' onClick={() => setShowContact(true)}>Contactos</button>

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

            {/* Modal de Misión o Visión */}
            {modalData && (
                <Modal
                    title={modalData.title}
                    content={modalData.content}
                    onClose={closeModal}
                />
            )}

            {/* Modal de Contactos */}
            {showContact && (
                <ContactModal onClose={() => setShowContact(false)} />
            )}
        </div>
    );
};

export default Home;
