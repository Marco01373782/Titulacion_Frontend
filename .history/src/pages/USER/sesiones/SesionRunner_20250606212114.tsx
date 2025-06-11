import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import activityComponentsMap from '../activityComponentsMap';
import { saveSessionActivityResult } from '../../../services/ApiService';

const SesionRunner = () => {
  const location = useLocation();

  const [session, setSession] = useState<any | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const state = location.state || {
      session: JSON.parse(localStorage.getItem('selectedSession') || 'null'),
      activities: JSON.parse(localStorage.getItem('selectedActivities') || '[]'),
    };

    if (!state.session || !state.activities.length) {
      console.warn('⚠️ Sesión o actividades no encontradas en el state ni en localStorage');
      return;
    }

    setSession(state.session);
    // Transformar [{ sesion, activity }] => [activity]
    const extractedActivities = state.activities.map((sa: any) => sa.activity);
    setActivities(extractedActivities);
  }, [location.state]);

  const handleFinishActivity = async (score: number) => {
    const activity = activities[currentIndex];
    const userRaw = localStorage.getItem('user');

    if (!session || !activity || !userRaw) {
      console.error("❌ Faltan datos: session, activity o usuario.");
      alert("⚠️ Hubo un error. Asegurate de estar logueado y que la sesión esté bien cargada.");
      return;
    }

    const user = JSON.parse(userRaw);

    try {
      await saveSessionActivityResult({
        sesion: { id: session.id },
        activity: { id: activity.id },
        user: { id: user.id },
        result: score.toString(),
      });

      if (currentIndex < activities.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        alert('🎉 ¡Sesión completada!');
        // Opcional: limpiar localStorage al final
        localStorage.removeItem('selectedSession');
        localStorage.removeItem('selectedActivities');
      }
    } catch (error) {
      console.error("❌ Error al guardar resultado:", error);
      alert("No se pudo guardar el resultado. Revisá tu conexión o iniciá sesión de nuevo.");
    }
  };

  const renderActivity = () => {
    const activity = activities[currentIndex];
    const ActivityComponent = activityComponentsMap[activity?.resourceUrl];

    if (!ActivityComponent) {
      return <p>⚠️ Componente no disponible para esta actividad ({activity?.resourceUrl})</p>;
    }

    return <ActivityComponent onFinish={handleFinishActivity} />;
  };

  if (!session || !activities.length) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>⚠️ No se pudo cargar la sesión</h2>
        <p>Volvé a la cuadrícula y seleccioná una sesión válida.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>🧠 Ejecutando sesión: {session.title}</h2>
      {renderActivity()}
    </div>
  );
};

export default SesionRunner;
