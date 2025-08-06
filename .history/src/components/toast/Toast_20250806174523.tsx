    import React, { useEffect } from 'react';
    import './Toast.css';

    interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
    }

    const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
        onClose();
        }, 2000); 
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`toast ${type}`}>
        <span>{message}</span>
        <button className="close-btn" onClick={onClose}>×</button>
        </div>
    );
    };

    export default Toast;
    