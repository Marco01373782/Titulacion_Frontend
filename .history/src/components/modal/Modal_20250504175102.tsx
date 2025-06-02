// src/components/Modal.tsx

import './Modal.css';
import logoprincipal from '../assets/logoprincipal.png';

const Modal = ({ title, content, onClose }: { title: string, content: string, onClose: () => void }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2 className="modal-title">{title}</h2>
        <p className="modal-content">{content}</p>
        C:\Users\Lenovo\Desktop\TITULACION\app\frontend\src\assets
      </div>
    </div>
  );
};

export default Modal;
