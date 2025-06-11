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

    const session = state.session;
    const sessionActivities = state.activities;

    if (!session || !sessionActivities.length) {
        return <p>⚠️ No se pudo cargar la sesión. Volvé a la cuadrícula e intentá de nuevo.</p>;
    }

    const activities = sessionActivities.map((sa: any) => sa.activity);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleFinishActivity = async (score: number) => {
        const activity = activities[currentIndex];
        const user = JSON.parse(localStorage.getItem('user') || 'null');
            console.log("🧠 session:", session);
console.log("🎯 activity:", activity);
console.log("👤 user:", JSON.parse(localStorage.getItem('user')!));

        // Validaciones completas
        if (!session || !activity || !user) {
        console.error("❌ Faltan datos:", {
            session,
            activity,
            user,
        });
        alert("❌ Hubo un error. Asegurate de estar logueado y que la sesión esté bien cargada.");
        return;
        }

        try {
        await saveSessionActivityResult({
            sesion: { id: session.id },
            activity: { id: activity.id },
            user: { id: user.id },
            result: score.toString()
        });

        if (currentIndex < activities.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            alert('🎉 ¡Sesión completada!');
        }
        } catch (error) {
        console.error("❌ Error al guardar resultado:", error);
        alert("Error al guardar el resultado. Intenta nuevamente.");
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
