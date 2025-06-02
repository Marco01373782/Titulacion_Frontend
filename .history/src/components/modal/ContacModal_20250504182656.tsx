import './ContactModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import whatsapp from '../../assets/whatsapp.png'; // Asegúrate de tener este ícono

const ContactModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="modal-overlay">
      <div className="contact-modal">
        <button className="modal-close" onClick={onClose}>
          <FontAwesomeIcon icon={faX} />
        </button>
        <h2 className="contact-title">CONTACTOS</h2>
        <p className="contact-text">
          ¡Estamos aquí para ayudarte! Si necesitas asistencia, envíanos un correo o contáctanos por WhatsApp.
        </p>
        <ul className="contact-info">
          <li><strong>Correo electrónico:</strong><br /> <a href="mailto:info@renovamind.com">info@renovamind.com</a></li>
          <li><strong>Teléfono:</strong><br /> 415-1880</li>
        </ul>
        <div className="whatsapp-button">
          <img src={whatsapp} alt="WhatsApp" />
          <span>¡Conéctate con nosotros fácilmente!</span>
        </div>
        <button className="contact-back" onClick={onClose}>Regresar</button>
      </div>
    </div>
  );
};

export default ContactModal;
