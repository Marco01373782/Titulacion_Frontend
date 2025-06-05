// Home.tsx
import './Home.css';
import home from '../../../assets/home.png';
import logoprincipal from '../../../assets/logoprincipal.png';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '../../../components/modal/Modal';
import ContactModal from '../../../components/modal/ContacModal';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [modalData, setModalData] = useState<{ title: string, content: string } | null>(null);
  const [showContact, setShowContact] = useState(false);
  const navigate = useNavigate();

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

  const closeModal = () => setModalData(null);

  return (
    <div className="container">
      <button className="contact-button" onClick={() => setShowContact(true)} title="Contactos">
        <FontAwesomeIcon icon={faEnvelope} size="lg" />
      </button>

      <header className="header">
        <img src={logoprincipal} alt="logo RenovaMind" className="logo" />
        <nav className="nav-links">
          <p className="nav-link" onClick={() => openModal('mision')}>Misión</p>
          <p className="nav-link" onClick={() => openModal('vision')}>Visión</p>
        </nav>
      </header>

      <main className="main-content">
        <h1 className="title">Bienvenido a RenovaMind</h1>
        <img src={home} alt="Imagen de bienvenida" className="home-image" />
        <p className="description">
          Una plataforma diseñada para acompañar, estimular y apoyar<br />
          el bienestar cognitivo de nuestros adultos mayores,<br />
          con el apoyo de quienes los aman.
        </p>
        <button className="login-button" onClick={() => navigate('/login')}>Iniciar Sesión</button>
      </main>

      {modalData && (
        <Modal
          title={modalData.title}
          content={modalData.content}
          onClose={closeModal}
        />
      )}

      {showContact && (
        <ContactModal onClose={() => setShowContact(false)} />
      )}
    </div>
  );
};

export default Home;
