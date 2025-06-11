    // src/pages/USER/sesiones/SesionRunner.tsx
    import { useLocation, useParams } from 'react-router-dom';
    import { useEffect, useState } from 'react';
    import { fetchActivitiesBySession, fetchSessionById } from '../../../services/ApiService';

    const SesionRunner = () => {
    const { id } = useParams();
    const location = useLocation();

    const [session, setSession] = useState(location.state?.session || null);
    const [activities, setActivities] = useState(location.state?.activities || []);

    const numericId = id ? parseInt(id) : null;

    useEffect(() => {
        const loadData = async () => {
        if (!numericId || isNaN(numericId)) {
            console.error("ID inválido o no definido");
            return;
        }

        try {
            if (!session) {
            const sessionRes = await fetchSessionById(numericId);
            setSession(sessionRes.data);
            }

            if (!activities.length) {
            const activitiesRes = await fetchActivitiesBySession(numericId);
            setActivities(activitiesRes.data);
            }
        } catch (error) {
            console.error("Error al cargar la sesión o actividades:", error);
        }
        };

        loadData();
    }, [numericId]);

    if (!session || !activities.length) return <p>Cargando sesión...</p>;

    return (
        <div>
        <h2>🏁 {session.title}</h2>
        <p>{session.description}</p>
        <div>
            {activities.map((activity: any, idx: number) => (
            <div key={activity.id}>
                <h4>Actividad {idx + 1}: {activity.title}</h4>
                {/* Aquí renderizas tu componente correspondiente */}
            </div>
            ))}
        </div>
        </div>
    );
    };

    export default SesionRunner;
