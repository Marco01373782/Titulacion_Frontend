import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../../../services/ApiService';
import activityComponentsMap from '../activityComponentsMap';

const GroupSesionRunner: React.FC = () => {
  const { sesionId } = useParams();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await ApiService.getSessionActivitiesBySesionId(sesionId as string);
        setActivities(response);
      } catch (error) {
        console.error('Error al cargar actividades de la sesión:', error);
      }
    };

    fetchActivities();
  }, [sesionId]);

  const handleFinishActivity = () => {
    if (currentIndex < activities.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleGoBack = () => {
    navigate('/app/sesion-grupal-grid'); // ⚠️ Asegurate de que esta ruta exista
  };

  const activity = activities[currentIndex]?.activity;
  const resourceUrl = activity?.resourceUrl;
  const CurrentActivity = activityComponentsMap[resourceUrl];

  return (
    <div>
      {!isFinished ? (
        CurrentActivity ? (
          <CurrentActivity onFinish={handleFinishActivity} />
        ) : (
          <p>Cargando actividad...</p>
        )
      ) : (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <h2>¡Sesión completada! 🎉</h2>
          <p>¡Buen trabajo! Seguimos fortaleciendo la mente 💪🧠</p>
          <button onClick={handleGoBack} style={{ marginTop: '1rem', padding: '10px 20px' }}>
            Volver al panel grupal
          </button>
        </div>
      )}
    </div>
  );
};

export default GroupSesionRunner;
