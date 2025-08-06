
    import React from 'react';
    import './LoadingOverlay.css';

    interface Props {
    visible: boolean;
    message?: string;
    }

    const LoadingOverlay: React.FC<Props> = ({ visible, message = 'Cargando...' }) => {
    if (!visible) return null;
    return (
        <div className="loading-overlay">
        <div className="loading-modal">
            <div className="spinner"></div>
            <p>{message}</p>
        </div>
        </div>
    );
    };

    export default LoadingOverlay;
