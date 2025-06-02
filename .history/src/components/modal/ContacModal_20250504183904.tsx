import './ContactModal.css';
import logosegundario from '../../assets/logosegundario.png';
import whatsapp from '../../assets/whatsapp.svg';

const ContactModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="modal-overlay">
      <div className="contact-modal">
        {/* Logo en la esquina superior derecha */}
        <img
          src={logosegundario}
          alt="Logo"
          className="modal-logo"
        />

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
