    import { useLocation } from 'react-router-dom';
    import { useState } from 'react';
    import activityComponentsMap from '../activityComponentsMap';
    import { saveSessionActivityResult } from '../../../services/ApiService';

    const SesionRunner = () => {
    const location = useLocation();
    const state = location.state || {
        session: JSON.parse(localStorage.getItem('selectedSession') || 'null'),
        activities: JSON.parse(localStorage.getItem('selectedActivities') || '[]'),
};
    const { session, activities: sessionActivities } = state;
    

    // Transformar [{ sesion, activity }] => [activity]Ñ
    const activities = sessionActivities.map((sa: any) => sa.activity);

    const [currentIndex, setCurrentIndex] = useState(0);
        if (!session || !activities) {
    return <p>⚠️ No se pudo cargar la sesión. Regresa a la cuadrícula e intentá de nuevo.</p>;
        }

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
        
        }
    };

    const renderActivity = () => {
        const activity = activities[currentIndex];
        const ActivityComponent = activityComponentsMap[activity.resourceUrl];
        console.log("resourceUrl:", activity.resourceUrl);

        if (!ActivityComponent) {
        return <p>Componente no disponible para {activity.resourceUrl}</p>;
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
