    import React, { useEffect, useState } from 'react';
    import { useLocation, useNavigate } from 'react-router-dom';
    import { saveSessionActivityResult, updateSesionUsuario } from '../../../services/ApiService';
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

        const [activityStartTime, setActivityStartTime] = useState<Date | null>(null);
        const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

        const [totalScore, setTotalScore] = useState<number>(0);

        useEffect(() => {
            if (activities.length > 0) {
                setIsLoading(false);
                if (!sessionStartTime) {
                    const now = new Date();
                    setSessionStartTime(now);
                    console.log(`🚀 Sesión inició a las ${now.toISOString()}`);
                }
            }
        }, [activities]);

        useEffect(() => {
            if (activities.length > 0 && currentIndex < activities.length) {
                const now = new Date();
                setActivityStartTime(now);
                setActivityScore(null);
                console.log(`⏳ Actividad ${currentIndex + 1} inició a las ${now.toISOString()}`);
            }
        }, [currentIndex, activities]);

        const handleFinishActivity = async (score: number | null) => {
            if (!activityStartTime || !session) {
                console.error('❌ Faltan datos para guardar resultado (startTime o session).');
                return;
            }

            const end = new Date();
            const durationSeconds = Math.floor((end.getTime() - activityStartTime.getTime()) / 1000);

            const token = localStorage.getItem('token');
            const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : null;
            const userId = decodedToken?.userId || 1;

            const activityWrapper = activities[currentIndex];
            const activity = activityWrapper.activity || activityWrapper;

            const payload = {
                sesionId: session.id,
                activityId: activity.id,
                userId: userId,
                result: score !== null ? score : null,
                completedAt: end.toISOString().split('Z')[0],
                durationSeconds,
            };

            try {
                await saveSessionActivityResult(payload);
                console.log('✅ Resultado guardado correctamente');
                if (score !== null) {
                    setTotalScore(prev => prev + score);
                }
            } catch (error) {
                console.error('❌ Error al guardar resultado:', error);
            }

            setActivityScore(score);
        };

        const handleNext = async () => {
            if (currentIndex < activities.length - 1) {
                setCurrentIndex(currentIndex + 1);
            } else {
                console.log(`🎉 Sesión "${session?.title}" terminada.`);

                // Registro de sesión completa
                const sessionEndTime = new Date();
                const sessionDuration = sessionStartTime
                    ? Math.floor((sessionEndTime.getTime() - sessionStartTime.getTime()) / 1000)
                    : 0;

                const token = localStorage.getItem('token');
                const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : null;
                const userId = decodedToken?.userId;

                const payload = {
                    status: 'COMPLETADA',
                    startedAt: sessionStartTime?.toISOString().split('Z')[0],
                    endedAt: sessionEndTime.toISOString().split('Z')[0],
                    sessionDurationSeconds: sessionDuration,
                    result: totalScore / activities.length, // Promedio de score
                };

                try {
                    const sesionUsuarioId = session.sesionUsuarioId;
                    if (!sesionUsuarioId) {
                        console.error('❌ Faltante sesionUsuarioId en el objeto sesión');
                    } else {
                        await updateSesionUsuario(sesionUsuarioId, payload);
                        console.log('📦 SesiónUsuario actualizada correctamente:', payload);
                    }
                } catch (err) {
                    console.error('❌ Error al actualizar SesionUsuario:', err);
                }

                navigate('/user/Sesiones');
            }
        };

        if (isLoading) return <div>Cargando sesión...</div>;
        if (activities.length === 0) return <div>No hay actividades para esta sesión.</div>;

        const currentActivityWrapper = activities[currentIndex];
        const currentActivity = currentActivityWrapper.activity || currentActivityWrapper;
        const resourceUrl = currentActivity.resourceUrl;

        const ActivityComponent = activityComponentsMap[resourceUrl];

        if (!ActivityComponent) {
            console.error('❌ Componente no encontrado para:', resourceUrl, currentActivity);
            return <div>Componente no encontrado para: <strong>{resourceUrl}</strong></div>;
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
