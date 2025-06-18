import './ContactModal.css';
import logosegundario from '../../assets/logosegundario.png';
import whatsapp from '../../assets/whatsapp.svg';

const ContactModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="modal-overlay">
      <div className="contact-modal">
        <img src={logosegundario} alt="Logo" className="modal-logo" />

        <h2 className="contact-title">Contáctanos</h2>

        <p className="contact-text">
          ¿Necesitas ayuda? Estamos aquí para ti. Puedes escribirnos un correo o enviarnos un mensaje directo por WhatsApp.
        </p>

        <ul className="contact-info">
          <li><strong>Correo:</strong> <a href="mailto:info@renovamind.com">info@renovamind.com</a></li>
          <li><strong>Teléfono:</strong> 415-1880</li>
        </ul>

        <div className="whatsapp-button">
          <a href="https://wa.link/4bv4ea" target="_blank" rel="noopener noreferrer" className="whatsapp-link">
            <img src={whatsapp} alt="WhatsApp" />
            <span>Habla con nosotros</span>
          </a>
        </div>

        <button className="contact-back" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default ContactModal;
