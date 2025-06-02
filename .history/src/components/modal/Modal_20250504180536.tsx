// src/components/Modal.tsx

import './Modal.css';
import logoprincipal from '../../assets/logoprincipal.png';
const Modal = ({ title, content, onClose }: { title: string, content: string, onClose: () => void }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>X</button>
        <h2 className="modal-title">{title}</h2>
        <p className="modal-content">{content}</p>
        <div className="divlogo">
        <img src={logoprincipal} alt="logo" className="logo" />
        </div>
      </div>
    </div>
  );
};

export default Modal;
