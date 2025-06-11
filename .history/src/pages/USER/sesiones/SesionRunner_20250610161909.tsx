    import React, { useEffect, useState } from 'react';
    import { useLocation, useNavigate } from 'react-router-dom';
    import { saveSessionActivityResult } from '../../../services/ApiService';
    import activityComponentsMap from '../activityComponentsMap';

    // Función para parsear JSON seguro, sin explotar aunque el JSON esté mal o sea null
    function safeParseJSON<T>(value: string | null, fallback: T): T {
    try {
        if (!value) return fallback;
        return JSON.parse(value);
    } catch (e) {
        console.error('JSON parse error:', e);
        return fallback;
    }
    }

    const SesionRunner: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const session = location.state?.session || safeParseJSON(localStorage.getItem('selectedSession'), null);
    const initialActivities = location.state?.activities || safeParseJSON(localStorage.getItem('selectedActivities'), []);

    const [activities, setActivities] = useState<any[]>(initialActivities);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(initialActivities.length === 0);
    const [activityScore, setActivityScore] = useState<number | null>(null);

    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);

    useEffect(() => {
        if (activities.length > 0) setIsLoading(false);
    }, [activities]);

    useEffect(() => {
        if (activities.length > 0 && currentIndex < activities.length) {
        const now = new Date();
        setStartTime(now);
        setEndTime(null);
        setActivityScore(null);
        console.log(`⏳ Actividad ${currentIndex + 1} inició a las ${now.toISOString()}`);
        }
    }, [currentIndex, activities]);

    const handleFinishActivity = async (score: number | null) => {
        if (!startTime || !session) {
        console.error('❌ Faltan datos para guardar resultado (startTime o session).');
        return;
        }

        const end = new Date();
        setEndTime(end);
        setActivityScore(score);

        const activityWrapper = activities[currentIndex];
        const activity = activityWrapper.activity || activityWrapper;

        // Simulación de extracción de userId desde token local
        const token = localStorage.getItem('token');
        const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : null;
        const userId = decodedToken?.userId || 1; // Usa un valor por defecto o lanza error si lo prefieres

        const durationSeconds = Math.floor((end.getTime() - startTime.getTime()) / 1000);

        const payload = {
        sesionId: session.id,
        activityId: activity.id,
        userId: userId,
        result: score !== null ? score : null,
        completedAt: end.toISOString().split('Z')[0], // LocalDateTime style
        durationSeconds,
        };

        console.log('📤 Enviando payload a backend:', payload);

        try {
        await saveSessionActivityResult(payload);
        console.log('✅ Resultado guardado correctamente');
        } catch (error) {
        console.error('❌ Error al guardar resultado:', error);
        }
    };

    const handleNext = () => {
        if (currentIndex < activities.length - 1) {
        setCurrentIndex(currentIndex + 1);
        } else {
        console.log(`🎉 Sesión "${session?.title}" terminada.`);
        navigate('/app/progreso'); // O cualquier ruta final
        }
    };

    if (isLoading) return <div>Cargando sesión...</div>;
    if (activities.length === 0) return <div>No hay actividades para esta sesión.</div>;

    const currentActivityWrapper = activities[currentIndex];
    const currentActivity = currentActivityWrapper.activity || currentActivityWrapper;

    const resourceUrl = currentActivity.resourceUrl; // ← directo del backend

    const ActivityComponent = activityComponentsMap[resourceUrl];

    if (!ActivityComponent) {
        console.error('❌ Componente no encontrado para:', resourceUrl, currentActivity);
        return (
        <div>
            Componente no encontrado para: <strong>{resourceUrl}</strong>
        </div>
        );
    }

    return (
        <div className="sesion-runner">
        <h2>
            Sesión: {session?.title} | Actividad {currentIndex + 1} de {activities.length}
        </h2>

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
