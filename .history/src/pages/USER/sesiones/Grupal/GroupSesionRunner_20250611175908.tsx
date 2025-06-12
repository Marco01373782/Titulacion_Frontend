    // src/pages/User/GroupSesionRunner.tsx
    import { useEffect, useState } from 'react';
    import { useParams } from 'react-router-dom';
    import { fetchActivitiesBySession } from '../../../../services/ApiService';

    const GroupSesionRunner = () => {
    const { sesionId } = useParams();
    const [activities, setActivities] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [sessionCompleted, setSessionCompleted] = useState(false);

    useEffect(() => {
        fe(sesionId).then(setActivities);
    }, [sesionId]);

    const handleFinishActivity = () => {
        if (currentIndex < activities.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        } else {
        setSessionCompleted(true);
        }
    };

    if (sessionCompleted) return <div>🎉 ¡Sesión Grupal Completada!</div>;

    const CurrentActivity = activities[currentIndex]?.activity?.resourceUrl;

    return (
        <div>
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
