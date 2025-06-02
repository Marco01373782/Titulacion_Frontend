    // src/pages/User/EjecutarSesion.tsx
    import { useLocation } from 'react-router-dom';
    import { useState } from 'react';
    import MemoriaTest from '../../../actividades/memoria/MemoriaTest'; // ya lo tienes
    import { saveSessionActivityResult } from '../../services/ApiService';

    const EjecucionSesion = () => {
    const { state } = useLocation();
    const { session, activities } = state;
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleFinishActivity = async (resultText: string) => {
        const activity = activities[currentIndex];
        await saveSessionActivityResult({
        sesion: { id: session.id },
        activity: { id: activity.id },
        user: { id: JSON.parse(localStorage.getItem('user')!).id },
        result: resultText
        });

        if (currentIndex < activities.length - 1) {
        setCurrentIndex(currentIndex + 1);
        } else {
        alert('🎉 Sesión completada');
        // Redirige a progreso u otro
        }
    };

    const renderActivity = () => {
        const activity = activities[currentIndex];
        if (activity.route === 'MemoriaTest') {
        return <MemoriaTest onFinish={handleFinishActivity} />;
        }
        return <p>Componente no disponible: {activity.route}</p>;
    };

    return (
        <div>
        <h2>🧠 Ejecutando sesión: {session.title}</h2>
        {renderActivity()}
        </div>
    );
    };

    export default EjecucionSesion;
