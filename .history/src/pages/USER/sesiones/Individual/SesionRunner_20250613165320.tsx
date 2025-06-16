        // src/pages/User/SesionRunner.tsx
        import React, { useEffect, useState } from 'react';
        import { useLocation, useNavigate } from 'react-router-dom';

        import {
            saveSessionActivityResult,
            updateSesionUsuario,
            getSesionUsuarioById
        } from '../../../../services/ApiService';
        import activityComponentsMap from '../activityComponentsMap';

        const SesionRunner: React.FC = () => {
            const location = useLocation();
            const navigate = useNavigate();

            const session = location.state?.session || JSON.parse(localStorage.getItem('selectedSession') || 'null');
            const initialActivities = location.state?.activities || JSON.parse(localStorage.getItem('selectedActivities') || '[]');
            
            const [activities] = useState<any[]>(initialActivities);
            const [currentIndex, setCurrentIndex] = useState(0);
            const [isLoading, setIsLoading] = useState(initialActivities.length === 0);
            const [activityScore, setActivityScore] = useState<number | null>(null);
            const [startTime, setStartTime] = useState<Date | null>(null);
            const [durations, setDurations] = useState<number[]>([]);
            const [scores, setScores] = useState<number[]>([]);

            const userId = Number(localStorage.getItem('userId'));
            //console.log("Usuario ID cargado", userId);
            const sesionUsuarioId = Number(localStorage.getItem('selectedSesionUsuarioId'));
            //console.log("🧠 SesionUsuarioId cargado:", sesionUsuarioId);

            useEffect(() => {
            if (activities.length > 0) {
               // console.log('✅ Actividades cargadas:', activities);
                setIsLoading(false);
            } else {
                console.warn('⚠️ No se encontraron actividades');
            }
        }, [activities]);

        useEffect(() => {
            if (activities.length > 0 && currentIndex < activities.length) {
                setStartTime(new Date());
                setActivityScore(null);
               // console.log(`🕒 Iniciando actividad ${currentIndex + 1}...`);
            }
        }, [currentIndex, activities]);

        const handleFinishActivity = async (score: number | null) => {
            if (!startTime || !session || userId == null) {
                console.error('❌ Faltan datos críticos (startTime, session o userId)');
                return;
            }

            const end = new Date();
            const durationSeconds = Math.floor((end.getTime() - startTime.getTime()) / 1000);
            const wrapper = activities[currentIndex];
            const activity = wrapper.activity || wrapper;
            const completedAt = end.toISOString().split('.')[0];

            const payload = {
                sesionUsuarioId,
                activityId: Number(activity.id),
                result: score !== null ? Number(score) : null,
                completedAt,
                durationSeconds,
            };

       // console.log(`📤 Enviando resultado de actividad ${currentIndex + 1}:`, payload);

            try {
                await saveSessionActivityResult(payload);
           /*  console.log('✅ Resultado guardado correctamente');
                setDurations(prev => [...prev, durationSeconds]);
                if (score !== null) setScores(prev => [...prev, score]);
            } catch (e) {
                console.error('❌ Error al guardar el resultado de la actividad:', e);
            }

            setActivityScore(score);
        };

        const handleNext = async () => {
    if (currentIndex < activities.length - 1) {
        setCurrentIndex(prev => prev + 1);
    } else {
        console.log('🏁 Sesión completada. Preparando payload final...');

        const totalDuration = durations.reduce((acc, cur) => acc + cur, 0);
        const activitiesResultAverage = scores.length > 0
        ? scores.reduce((a, b) => a + b, 0) / scores.length
        : null;

        const endedAt = new Date().toISOString().split('.')[0];
        const mode = localStorage.getItem('selectedMode') || 'INDIVIDUAL';

        try {
        // ⏳ Paso 1: Obtener la sesión actual
        const existingSession = await getSesionUsuarioById(sesionUsuarioId);

        // 📦 Paso 2: Preparar el nuevo objeto completo
        const updatedPayload = {
            ...existingSession,
            status: 'COMPLETADA',
            endedAt,
            sessionDurationSeconds: totalDuration,
            result: activitiesResultAverage,
            mode, // ← desde localStorage
            startedAt: existingSession.startedAt || new Date().toISOString().split('.')[0],
            date: existingSession.date || new Date().toISOString().split('T')[0]
        };

        // 📤 Paso 3: Enviar la actualización completa
        await updateSesionUsuario(sesionUsuarioId, updatedPayload);

        //console.log('✅ Sesión marcada como COMPLETADA con todos los campos.');
       // console.log('✅ Sesión completada');
        navigate('/user/Sesiones');
        } catch (error) {
        console.error('❌ Error al actualizar sesión del usuario:', error);
        alert('❌ No se pudo completar la sesión.');
        }
    }
    };




            if (isLoading) return <div>Cargando sesión...</div>;
            if (!activities.length) return <div>No hay actividades para esta sesión.</div>;

            const wrapper = activities[currentIndex];
            const activity = wrapper.activity || wrapper;
            const resourceUrl = activity.resourceUrl;
            const ActivityComponent = activityComponentsMap[resourceUrl];

            if (!ActivityComponent) {
                return <div>No se encontró el componente para: {resourceUrl}</div>;
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
