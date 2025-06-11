        import React, { useEffect, useState } from 'react';
        import { useLocation, useNavigate } from 'react-router-dom';
        import { saveSessionActivityResult } from '../../../services/ApiService';
        import activityComponentsMap from '../activityComponentsMap';

        const SesionRunner: React.FC = () => {
        const location = useLocation();
        const navigate = useNavigate();

        // Tomamos sesión y actividades del state o localStorage
        const session = location.state?.session || JSON.parse(localStorage.getItem('selectedSession') || 'null');
        const initialActivities = location.state?.activities || JSON.parse(localStorage.getItem('selectedActivities') || '[]');

        const [activities, setActivities] = useState<any[]>(initialActivities);
        const [currentIndex, setCurrentIndex] = useState(0);
        const [isLoading, setIsLoading] = useState(initialActivities.length === 0);
        const [activityScore, setActivityScore] = useState<number | null>(null);
        const [startTime, setStartTime] = useState<Date | null>(null);

        // Extraemos userId del token JWT en localStorage
        const token = localStorage.getItem('token');
        const userId = token
            ? (() => {
                try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                return payload.userId as number;
                } catch {
                return null;
                }
            })()
            : null;

        // Cuando carguen actividades, desactivamos el loading
        useEffect(() => {
            if (activities.length > 0) setIsLoading(false);
        }, [activities]);

        // Al cambiar de actividad, marcamos el startTime
        useEffect(() => {
            if (activities.length > 0 && currentIndex < activities.length) {
            const now = new Date();
            setStartTime(now);
            setActivityScore(null);
            console.log(`⏳ Actividad ${currentIndex + 1} inició a las ${now.toISOString()}`);
            }
        }, [currentIndex, activities]);

        const handleFinishActivity = async (score: number | null) => {
            console.log('startTime:', startTime);
console.log('session:', session);
console.log('userId:', userId);

    if (!startTime || !session || userId == null) {
        console.error('❌ Falta startTime, session o userId.');
        return;
    }

    const end = new Date();
    setActivityScore(score);
    const durationSeconds = Math.floor((end.getTime() - startTime.getTime()) / 1000);

    const wrapper = activities[currentIndex];
    const activity = wrapper.activity || wrapper;

    // Formato sin milisegundos ni zona para LocalDateTime
    const completedAt = end.toISOString().split('.')[0];

    const payload = {
        sesionId: Number(session.id),
        activityId: Number(activity.id),
        userId: Number(userId),
        result: score !== null ? Number(score) : null,
        completedAt,           // "2025-06-10T15:30:45"
        durationSeconds,
    };

    console.log('📤 Payload enviado:', payload);

    try {
        await saveSessionActivityResult(payload);
        console.log('✅ Resultado guardado');
    } catch (e) {
        console.error('❌ Error al guardar resultado:', e);
        alert('No se pudo guardar el resultado. Intenta de nuevo.');
    }
    };


        const handleNext = () => {
            if (currentIndex === activities.length - 1) {
  const sesionUsuarioId = Number(localStorage.getItem('selectedSesionUsuarioId'));
  const totalDuration = ...; // suma o cálculo
  const payload = {
    status: 'COMPLETADA',
    endedAt: new Date().toISOString().split('.')[0],
    sessionDurationSeconds: totalDuration,
    result: activitiesResultAverage,
  };
  await saveSesionUsuarioUpdate(sesionUsuarioId, payload);
  navigate('/user/dashboard'); // o donde sea
}

        };

        if (isLoading) return <div>Cargando sesión...</div>;
        if (!activities.length) return <div>No hay actividades para esta sesión.</div>;

        const wrapper = activities[currentIndex];
        const activity = wrapper.activity || wrapper;

        // Usamos el resourceUrl que trae la actividad
        const resourceUrl = activity.resourceUrl; // por ej "/actividades/razonamiento-test"
        const ActivityComponent = activityComponentsMap[resourceUrl];

        if (!ActivityComponent) {
            console.error('❌ Componente no encontrado para:', resourceUrl, activity);
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
