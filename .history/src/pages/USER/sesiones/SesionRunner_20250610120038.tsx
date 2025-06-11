    import React, { useEffect, useState } from 'react';
    import { useLocation, useNavigate } from 'react-router-dom';
    import {
    getActivitiesBySession,
    saveSessionActivityResult,
    } from '../../../services/ApiService';

    import activityComponentsMap from '../activityComponentsMap';

    const SesionRunner: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const sesionId = searchParams.get('sesionId');

    const [activities, setActivities] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [activityScore, setActivityScore] = useState<number | null>(null);

    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);

    // Cargar las actividades al inicio
    useEffect(() => {
        const fetchActivities = async () => {
        if (sesionId) {
            try {
            const result = await getActivitiesBySession(parseInt(sesionId));
            setActivities(result);
            } catch (error) {
            console.error('Error fetching activities:', error);
            } finally {
            setIsLoading(false);
            }
        } else {
            console.error('sesionId no está definido en la URL');
            setIsLoading(false);
        }
        };
        fetchActivities();
    }, [sesionId]);

    // Marcar inicio de cada actividad
    useEffect(() => {
        if (activities.length > 0 && currentIndex < activities.length) {
        setStartTime(new Date());
        setEndTime(null);
        setActivityScore(null);
        }
    }, [currentIndex, activities]);

    const handleFinishActivity = async (score: number) => {
        if (!startTime) {
        console.error('startTime no está definido. No se puede guardar el resultado.');
        return;
        }

        const end = new Date();
        setEndTime(end);
        setActivityScore(score);

        const activityWrapper = activities[currentIndex];
        const activity = activityWrapper.activity;

        const payload = {
        sessionId: parseInt(sesionId!),
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
        // Sesión terminada
        navigate('/app/progreso'); // Puedes cambiar esta ruta si lo necesitas
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
