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
       if (!numericId) return;
        const sessionRes = await fetchSessionById(id);
        setSession(sessionRes.data);
      }

      if (!activities.length) {
        const activitiesRes = await fetchActivitiesBySession(id);
        setActivities(activitiesRes.data);
      }
    };

    loadData();
  }, [id, session, activities]);

  if (!session || !activities.length) return <p>Cargando sesión...</p>;

  return (
    <div>
      <h2>🏁 {session.title}</h2>
      <p>{session.description}</p>
      <div>
        {activities.map((activity: any, idx: number) => (
          <div key={idx}>
            <h4>Actividad {idx + 1}: {activity.title}</h4>
            {/* Aquí renderizas tu componente correspondiente */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SesionRunner;
