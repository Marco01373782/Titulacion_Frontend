    import React, { useEffect, useState } from 'react';
    import { useNavigate, useParams } from 'react-router-dom';
    import { fetchActivitiesBySession } from '../../../../services/ApiService'; // ✅ usá la función directamente
    import activityComponentsMap from '../activityComponentsMap';

    const GroupSesionRunner: React.FC = () => {
    const { sesionId } = useParams();
    const navigate = useNavigate();
    const [activities, setActivities] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [activityScore, setActivityScore] = useState<number | null>(null);
    const [showContinue, setShowContinue] = useState<boolean>(false);
    const [isFinished, setIsFinished] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const data = await fetchActivitiesBySession(Number(sesionId));
            setActivities(data);
        } catch (error) {
            console.error('Error al obtener actividades:', error);
        }
        };

        fetchData();
    }, [sesionId]);

    const handleFinishActivity = (score: number) => {
        setActivityScore(score);
        setShowContinue(true); // muestra el botón "Continuar"
    };

    const handleContinue = () => {
        setShowContinue(false);
        setActivityScore(null);
        if (currentIndex < activities.length - 1) {
        setCurrentIndex(currentIndex + 1);
        } else {
        setIsFinished(true);
        }
    };

    const handleFinishSession = () => {
        navigate('/app/sesion-grupal-grid'); // 🔁 ruta del grid grupal
    };

    const activity = activities[currentIndex]?.activity;
    const resourceUrl = activity?.resourceUrl;
    const CurrentActivity = activityComponentsMap[resourceUrl];

    return (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        {!isFinished ? (
            <>
            {CurrentActivity ? (
                <div>
                <CurrentActivity onFinish={handleFinishActivity} />
                {showContinue && (
                    <div style={{ marginTop: '1.5rem' }}>
                    <p>✅ Resultado de la actividad: <strong>{activityScore}</strong></p>
                    <button onClick={handleContinue} style={styles.button}>
                        Continuar
                    </button>
                    </div>
                )}
                </div>
            ) : (
                <p>Cargando actividad...</p>
            )}
            </>
        ) : (
            <div>
            <h2>🎉 ¡Sesión completada!</h2>
            <p>Gracias por participar 💪🧠</p>
            <button onClick={handleFinishSession} style={styles.button}>
                Terminar sesión
            </button>
            </div>
        )}
        </div>
    );
    };

    const styles = {
    button: {
        marginTop: '1rem',
        padding: '0.7rem 1.5rem',
        fontSize: '1rem',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
    },
    };

    export default GroupSesionRunner;
