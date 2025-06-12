    import React, { useEffect, useState } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import ApiService from '../../../../services/ApiService';
    import activityComponentsMap from '../activityComponentsMap';

    const GroupSesionRunner: React.FC = () => {
    const { sesionId } = useParams();
    const navigate = useNavigate();
    const [activities, setActivities] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isFinished, setIsFinished] = useState<boolean>(false);
    const [lastScore, setLastScore] = useState<number | null>(null);
    const [showFeedback, setShowFeedback] = useState<boolean>(false);

    useEffect(() => {
        const fetchActivities = async () => {
        try {
            const data = await ApiService.fetchActivitiesBySession(Number(sesionId));
            setActivities(data);
        } catch (error) {
            console.error('❌ Error al cargar actividades de la sesión:', error);
        }
        };

        fetchActivities();
    }, [sesionId]);

    const handleFinishActivity = (score: number) => {
        setLastScore(score);
        setShowFeedback(true); // Mostramos retroalimentación antes de pasar
    };

    const handleContinue = () => {
        setShowFeedback(false);
        setLastScore(null);
        if (currentIndex < activities.length - 1) {
        setCurrentIndex(currentIndex + 1);
        } else {
        setIsFinished(true);
        }
    };

    const handleGoBack = () => {
        navigate('/app/sesion-grupal-grid'); // Ajustá esta ruta si es diferente
    };

    const activity = activities[currentIndex]?.activity;
    const resourceUrl = activity?.resourceUrl;
    const CurrentActivity = activityComponentsMap[resourceUrl];

    return (
        <div style={{ padding: '2rem' }}>
        {!isFinished ? (
            showFeedback ? (
            <div style={{ textAlign: 'center' }}>
                <h3>Resultado de la actividad:</h3>
                <p>Puntaje obtenido: <strong>{lastScore}</strong></p>
                <button onClick={handleContinue} style={{ marginTop: '1rem' }}>
                Continuar a la siguiente actividad
                </button>
            </div>
            ) : CurrentActivity ? (
            <CurrentActivity onFinish={handleFinishActivity} />
            ) : (
            <p>Cargando actividad...</p>
            )
        ) : (
            <div style={{ textAlign: 'center' }}>
            <h2>¡Sesión completada! 🎉</h2>
            <p>Gracias por participar 💪🧠</p>
            <button onClick={handleGoBack} style={{ marginTop: '1rem' }}>
                Volver al panel grupal
            </button>
            </div>
        )}
        </div>
    );
    };

    export default GroupSesionRunner;
