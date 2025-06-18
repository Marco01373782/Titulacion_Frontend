import { useEffect } from 'react';
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
                <svg viewBox="0 0 200 200" className="brain-svg">
                    <circle cx="100" cy="100" r="80" className="brain-outline" />
                    <path d="M 50 100 Q 75 50, 100 100 Q 125 150, 150 100" className="brain-path" />
                </svg>
            </div>
            <h1 className="title">RenovaMind</h1>
        </div>
    );
};

export default SplashScreen;
/* */