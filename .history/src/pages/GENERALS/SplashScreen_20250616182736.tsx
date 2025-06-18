import React, { useEffect } from 'react';
import './SplashScreen.css';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/home');
        }, 4000); // 4 segundos

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="splash-container">
            <div className="logo-container">
                <div className="brain"></div>
            </div>
            <h1 className="title">RenovaMind</h1>
        </div>
    );
};

export default SplashScreen;
