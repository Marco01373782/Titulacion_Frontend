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

interface Difficulty {
  id: number;
  name: string;
}

interface ActivityType {
  id: number;
  name: string;
}

const ActivityList = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [difficulties, setDifficulties] = useState<Difficulty[]>([]);
  const [types, setTypes] = useState<ActivityType[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | 'all'>('all');
  const [selectedType, setSelectedType] = useState<number | 'all'>('all');

  const navigate = useNavigate();

  useEffect(() => {
    fetchActivities();
    fetchDifficulties();
    fetchTypes();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await ApiService.get('/activities');
      setActivities(response.data);
      setFilteredActivities(response.data);
    } catch (error) {
      console.error('Error al obtener actividades', error);
    }
  };

  const fetchDifficulties = async () => {
    try {
      const response = await ApiService.get('/difficulty');
      setDifficulties(response.data);
    } catch (error) {
      console.error('Error al obtener dificultades', error);
    }
  };

  const fetchTypes = async () => {
    try {
      const response = await ApiService.get('/activity-type');
      setTypes(response.data);
    } catch (error) {
      console.error('Error al obtener tipos', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta actividad?')) {
      try {
        await ApiService.delete(`/activities/${id}`);
        fetchActivities();
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

  const applyFilters = (difficulty: number | 'all', type: number | 'all') => {
    let result = [...activities];
    if (difficulty !== 'all') {
      result = result.filter(a => a.difficulty.id === difficulty);
    }
    if (type !== 'all') {
      result = result.filter(a => a.type.id === type);
    }
    setFilteredActivities(result);
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === 'all' ? 'all' : parseInt(e.target.value);
    setSelectedDifficulty(value);
    applyFilters(value, selectedType);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === 'all' ? 'all' : parseInt(e.target.value);
    setSelectedType(value);
    applyFilters(selectedDifficulty, value);
  };

  return (
    <div className="activity-list-container">
      <div className="activity-header">
        <h2>Lista de Actividades</h2>
        <div className="header-actions">
          <select value={selectedDifficulty} onChange={handleDifficultyChange}>
            <option value="all">Todas las Dificultades</option>
            {difficulties.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <select value={selectedType} onChange={handleTypeChange}>
            <option value="all">Todos los Tipos</option>
            {types.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <button onClick={handleCreate} className="btn-crear">Crear Nueva Actividad</button>
        </div>
      </div>

      <table className="activity-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Descripción</th>
            <th>Tipo</th>
            <th>Dificultad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredActivities.map(activity => (
            <tr key={activity.id}>
              <td>{activity.id}</td>
              <td>{activity.title}</td>
              <td>{activity.description}</td>
              <td>{activity.type.name}</td>
              <td>{activity.difficulty.name}</td>
              <td>
                <button onClick={() => handleEdit(activity.id)}>Editar</button>
                <button onClick={() => handleDelete(activity.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityList;
