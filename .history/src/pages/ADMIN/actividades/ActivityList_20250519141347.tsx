// src/pages/ADMIN/actividades/ActivityList.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../../services/ApiService';
import './ActivityList.css';

interface Activity {
  id: number;
  title: string;
  description: string;
  resourceUrl: string;
  type: {
    id: number;
    name: string;
  };
  difficulty: {
    id: number;
    name: string;
  };
}

const ActivityList = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await ApiService.get('/activities');
      setActivities(response.data);
    } catch (error) {
      console.error('Error al obtener actividades', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta actividad?')) {
      try {
        await ApiService.delete(`/activities/${id}`);
        fetchActivities(); // Recargar la lista
      } catch (error) {
        console.error('Error al eliminar la actividad', error);
      }
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/app/editar-actividad/${id}`);
  };

  const handleCreate = () => {
    navigate('/app/crear-actividad');
  };

  return (
    <div className="activity-list-container">
      <h2>Lista de Actividades</h2>
      <button onClick={handleCreate} className="btn-crear">Crear Nueva Actividad</button>
      <div className="activity-grid">
        {activities.map(activity => (
          <div key={activity.id} className="activity-card">
            <h3>{activity.title}</h3>
            <p>{activity.description}</p>
            <p><strong>Tipo:</strong> {activity.type.name}</p>
            <p><strong>Dificultad:</strong> {activity.difficulty.name}</p>
            <div className="buttons">
              <button onClick={() => handleEdit(activity.id)}>Editar</button>
              <button onClick={() => handleDelete(activity.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityList;
