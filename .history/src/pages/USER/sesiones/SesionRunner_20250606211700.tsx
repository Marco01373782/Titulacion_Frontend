    import { useLocation } from 'react-router-dom';
    import { useState } from 'react';
    import activityComponentsMap from '../activityComponentsMap';
    import { saveSessionActivityResult } from '../../../services/ApiService';

    const SesionRunner = () => {
    const location = useLocation();

    // Intentamos recuperar de location.state o del localStorage
    const rawSession = location.state?.session || localStorage.getItem('selectedSession');
    const rawActivities = location.state?.activities || localStorage.getItem('selectedActivities');

    const session = typeof rawSession === 'string' ? JSON.parse(rawSession) : rawSession;
    const sessionActivities = typeof rawActivities === 'string' ? JSON.parse(rawActivities) : rawActivities || [];

    if (!session || !session.id || sessionActivities.length === 0) {
        return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>⚠️ No se pudo cargar la sesión.</h2>
            <p>Volvé a la cuadrícula e iniciá la sesión de nuevo.</p>
        </div>
        );
    }

    // Transformar [{ sesion, activity }] => [activity]
    const activities = sessionActivities.map((sa: any) => sa.activity);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleFinishActivity = async (score: number) => {
        const activity = activities[currentIndex];

        if (!session || !activity || !activity.id) {
        console.error("❌ Error: session o activity vacíos o mal cargados");
        return;
        }

        try {
        await saveSessionActivityResult({
            sesion: { id: session.id },
            activity: { id: activity.id },
            user: { id: JSON.parse(localStorage.getItem('user')!).id },
            result: score.toString()
        });

        if (currentIndex < activities.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            alert('🎉 Sesión completada');
        }
        } catch (error) {
        console.error("Error al guardar resultado:", error);
        }
    };

    const renderActivity = () => {
        const activity = activities[currentIndex];
        const ActivityComponent = activityComponentsMap[activity.resourceUrl];

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
