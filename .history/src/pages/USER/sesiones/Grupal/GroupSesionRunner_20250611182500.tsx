    // src/pages/User/GroupSesionRunner.tsx
    import { useEffect, useState } from 'react';
    import { useParams } from 'react-router-dom';
    import { fetchActivitiesBySession } from '../../../../services/ApiService';

    const GroupSesionRunner = () => {
    const { sesionId } = useParams<{ sesionId: string }>();
    const [activities, setActivities] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [sessionCompleted, setSessionCompleted] = useState(false);

    useEffect(() => {
        if (sesionId) {
        fetchActivitiesBySession(Number(sesionId)).then((data) => setActivities(data));
        }
    }, [sesionId]);

    const handleFinishActivity = () => {
        if (currentIndex < activities.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        
        } else {
        setSessionCompleted(true);
        }
    };

    if (sessionCompleted)
        return (
        <div style={{ textAlign: 'center', marginTop: '5rem' }}>
            <h2>🎉 ¡Sesión Grupal Completada!</h2>
            <p>¡Buen trabajo equipo!</p>
        </div>
        );

    const CurrentActivity = activities[currentIndex]?.activity?.resourceUrl;

    return (
        <div style={{ padding: '2rem' }}>
        <h2>Ejecutando sesión grupal</h2>
        {CurrentActivity ? (
            <CurrentActivity onFinish={handleFinishActivity} />
        ) : (
            <p>Cargando actividad...</p>
        )}
        </div>
    );
    };

    export default GroupSesionRunner;
