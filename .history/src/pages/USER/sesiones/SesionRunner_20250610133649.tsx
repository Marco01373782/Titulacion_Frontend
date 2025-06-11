    import React, { useEffect, useState } from 'react';
    import { useLocation, useNavigate } from 'react-router-dom';
    import { saveSessionActivityResult } from '../../../services/ApiService';
    import activityComponentsMap from '../activityComponentsMap';

    const SesionRunner: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const session = location.state?.session || JSON.parse(localStorage.getItem('selectedSession') || 'null');
    const initialActivities = location.state?.activities || JSON.parse(localStorage.getItem('selectedActivities') || '[]');

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

    const handleFinishActivity = async (score: number) => {
        if (!startTime || !session) {
        console.error('❌ Faltan datos para guardar resultado (startTime o session).');
        return;
        }

        const end = new Date();
        setEndTime(end);
        setActivityScore(score);

        const activityWrapper = activities[currentIndex];
        const activity = activityWrapper.activity || activityWrapper;

        const payload = {
        sessionId: session.id,
        activityId: activity.id,
        startTime: startTime.toISOString(),
        endTime: end.toISOString(),
        score,
        };
           console.log8 
        try {

        await saveSessionActivityResult(payload);
        console.log('✅ Resultado guardado:', payload);
        console.log(`📊 Puntaje: ${score}`);
        console.log(`⏱️ Tiempo actividad: ${(end.getTime() - startTime.getTime()) / 1000} segundos`);
        } catch (error) {
        console.error('❌ Error al guardar resultado:', error);
        }
    };

    const handleNext = () => {
        if (currentIndex < activities.length - 1) {
        setCurrentIndex(currentIndex + 1);
        } else {
        console.log(`🎉 Sesión "${session?.title}" terminada.`);
        navigate('/app/progreso'); // Cambia la ruta si quieres otra
        }
    };

    if (isLoading) return <div>Cargando sesión...</div>;
    if (activities.length === 0) return <div>No hay actividades para esta sesión.</div>;

    const currentActivityWrapper = activities[currentIndex];
    const currentActivity = currentActivityWrapper.activity || currentActivityWrapper;

    const typeMap: Record<string, string> = {
        MEMORIA: 'memoria',
        RAZONAMIENTO: 'razonamiento',
        ATENCION: 'atencion',
    };

    const difficultyMap: Record<string, string> = {
        TEST: 'test',
        PRINCIPIANTE: 'principiante',
        AVANZADO: 'avanzado',
    };

    const resourceUrl = `/actividades/${typeMap[currentActivity.type]}-${difficultyMap[currentActivity.difficulty]}`;
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
