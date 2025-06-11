    import { useLocation, useParams } from 'react-router-dom';
    import { useEffect, useState } from 'react';
    import { fetchActivitiesBySession, fetchSessionById } from '../../../services/ApiService';

    const SesionRunner = () => {
    const { id } = useParams();
    const location = useLocation();
    const [session, setSession] = useState(location.state?.session || null);
    const [activities, setActivities] = useState(location.state?.activities || []);
    
    // Convertir id a número y validar bien
    const numericId = id ? parseInt(id) : NaN;

    useEffect(() => {
        const loadData = async () => {
        if (isNaN(numericId)) {
            console.error("ID inválido o no definido:", id);
            return;
        }

        if (!session) {
            const sessionRes = await fetchSessionById(numericId);
            setSession(sessionRes.data);
        }

        if (!activities.length) {
            const activitiesRes = await fetchActivitiesBySession(numericId);
            setActivities(activitiesRes.data);
        }
        };

        loadData();
    }, [numericId, session, activities, id]);

    if (!session || !activities.length) return <p>Cargando sesión...</p>;

    return (
        <div>
        <h2>🏁 {session.title}</h2>
        <p>{session.description}</p>
        <div>
            {activities.map((activity: any, idx: number) => (
            <div key={idx}>
                <h4>Actividad {idx + 1}: {activity.title}</h4>
                {/* Renderiza el componente de actividad */}
            </div>
            ))}
        </div>
        </div>
    );
    };

    export default SesionRunner;
