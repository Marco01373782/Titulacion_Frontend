// src/components/Modal.tsx

import './Modal.css';


const Modal = ({ title, content, onClose }: { title: string, content: string, onClose: () => void }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2 className="modal-title">{title}</h2>
        <p className="modal-content">{content}</p>
        
      </div>
    </div>
  );
};

export default Modal;
