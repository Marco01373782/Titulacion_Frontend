    import React, { useEffect, useState } from 'react';
    import { useLocation, useNavigate } from 'react-router-dom';
    import { saveSessionActivityResult } from '../../../services/ApiService';
    import activityComponentsMap from '../activityComponentsMap';

    const SesionRunner: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const session = location.state?.session;
    const initialActivities = location.state?.activities || [];

    const [activities, setActivities] = useState<any[]>(initialActivities);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(!initialActivities.length);
    const [activityScore, setActivityScore] = useState<number | null>(null);

    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);

    // Marcar inicio de cada actividad
    useEffect(() => {
        if (activities.length > 0 && currentIndex < activities.length) {
        setStartTime(new Date());
        setEndTime(null);
        setActivityScore(null);
        }
    }, [currentIndex, activities]);

    const handleFinishActivity = async (score: number) => {
        if (!startTime || !session) {
        console.error('Faltan datos para guardar resultado');
        return;
        }

        const end = new Date();
        setEndTime(end);
        setActivityScore(score);

        const activityWrapper = activities[currentIndex];
        const activity = activityWrapper.activity;

        const payload = {
        sessionId: session.id,
        activityId: activity.id,
        startTime: startTime.toISOString(),
        endTime: end.toISOString(),
        score,
        };

        try {
        await saveSessionActivityResult(payload);
        console.log('Resultado guardado:', payload);
        } catch (error) {
        console.error('Error al guardar resultado:', error);
        }
    };

    const handleNext = () => {
        if (currentIndex < activities.length - 1) {
        setCurrentIndex(currentIndex + 1);
        } else {
        navigate('/app/progreso');
        }
    };

    if (isLoading) return <div>Cargando sesión...</div>;
    if (activities.length === 0) return <div>No hay actividades para esta sesión.</div>;

    const currentActivityWrapper = activities[currentIndex];
    const currentActivity = currentActivityWrapper.activity;
    const ActivityComponent = activityComponentsMap[currentActivity.componentPath];

    if (!ActivityComponent) {
        return (
        <div>
            Componente no encontrado para: <strong>{currentActivity.componentPath}</strong>
        </div>
        );
    }

    return (
        <div className="sesion-runner">
        <h2>Actividad {currentIndex + 1} de {activities.length}</h2>

        <div className="actividad-container">
            <ActivityComponent onFinish={handleFinishActivity} />
        </div>

        {activityScore !== null && (
            <div className="post-actividad">
            <p>Puntaje obtenido: {activityScore}</p>
            <button onClick={handleNext}>
                {currentIndex < activities.length - 1 ? 'Continuar' : 'Terminar sesión'}
            </button>
            </div>
        )}
        </div>
    );
    };

    export default SesionRunner;
