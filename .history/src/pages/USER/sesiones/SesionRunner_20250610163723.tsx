// src/pages/User/SesionRunner.tsx
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { saveSessionActivityResult, saveSesionUsuarioFinalizada } from '../../../services/ApiService';

const SesionRunner = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const session = location.state?.session || JSON.parse(localStorage.getItem('selectedSession') || '{}');
  const activities = location.state?.activities || JSON.parse(localStorage.getItem('selectedActivities') || '[]');
  const sesionUsuarioId = location.state?.sesionUsuarioId || Number(localStorage.getItem('selectedSesionUsuarioId'));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activityStartTime, setActivityStartTime] = useState<number>(Date.now());
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());

  const currentActivity = activities[currentIndex];

  useEffect(() => {
    // Guardar el tiempo de inicio de la sesión al montar
    setSessionStartTime(Date.now());
  }, []);

  const handleFinishActivity = async (score: number) => {
    const endTime = Date.now();
    const duration = endTime - activityStartTime;

    try {
      await saveSessionActivityResult({
        sesionUsuarioId,
        activityId: currentActivity.id,
        score,
        durationMillis: duration
      });

      console.log(`✅ Actividad ${currentActivity.title} completada con score ${score} y duración ${duration}ms`);
    } catch (error) {
      console.error('❌ Error al guardar resultado de actividad:', error);
    }

    if (currentIndex < activities.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setActivityStartTime(Date.now()); // Reiniciar para la siguiente actividad
    } else {
      // Última actividad completada, mostrar botón para finalizar
      console.log('🎉 Todas las actividades completadas');
    }
  };

  const handleFinishSession = async () => {
    const sessionEndTime = Date.now();
    const sessionDuration = sessionEndTime - sessionStartTime;

    try {
      await saveSesionUsuarioFinalizada({
        sesionUsuarioId,
        startTime: new Date(sessionStartTime).toISOString(),
        endTime: new Date(sessionEndTime).toISOString(),
        durationMillis: sessionDuration
      });

      console.log('✅ Sesión completada y registrada con duración total:', sessionDuration);
      navigate('/user/progreso'); // O donde quieras redirigir después
    } catch (error) {
      console.error('❌ Error al finalizar sesión:', error);
    }
  };

  const renderActivityComponent = (activity: any) => {
    const ActivityComponent = require(`../../../components/Activities/${activity.componentName}`).default;

    return (
      <ActivityComponent
        key={activity.id}
        onFinish={(score: number) => handleFinishActivity(score)}
      />
    );
  };

  return (
    <div className="sesion-runner">
      <h2>🧠 Ejecución de Sesión: {session.title}</h2>
      <div className="activity-container">
        {renderActivityComponent(currentActivity)}
      </div>

      {currentIndex === activities.length - 1 && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={handleFinishSession}>🎯 Terminar sesión</button>
        </div>
      )}
    </div>
  );
};

export default SesionRunner;
