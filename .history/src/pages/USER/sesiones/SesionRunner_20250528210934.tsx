
        import { useLocation } from 'react-router-dom';
        import { useState } from 'react';
     import activi
        import { saveSessionActivityResult } from '../../../services/ApiService';

        const SesionRunner = () => {
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

    // DEBUG: mira qué actividad está llegando para que puedas verificar
    console.log('Actividad actual:', activity);

    const ActivityComponent = activityComponentsMap[activity.route];

    if (!ActivityComponent) {
        return <p>⚠️ Actividad no implementada: {activity.route}</p>;
    }

    return <ActivityComponent onFinish={handleFinishActivity} />;
    };

        return (
            <div>
            <h2>🧠 Ejecutando sesión: {session.title}</h2>
            {renderActivity()}
            </div>
        );
        };

        export default SesionRunner;
