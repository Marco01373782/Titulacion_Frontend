import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchAllActivities,
  deleteActivity,
  fetchDifficulties,
  fetchActivityTypes,
} from '../../../services/ApiService';
import Toast from '../../../components/toast/Toast'; // Importa Toast
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

  // Estado para toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Estado para confirmar borrado
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [activities, selectedDifficulty, selectedType]);

  const fetchData = async () => {
    try {
      const activitiesRes = await fetchAllActivities();
      setActivities(activitiesRes.data);

      const difficultiesRes = await fetchDifficulties();
      setDifficulties(difficultiesRes.data);

      const typesRes = await fetchActivityTypes();
      setTypes(typesRes.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setToast({ message: 'Error cargando datos', type: 'error' });
    }
  };

  const applyFilters = () => {
    let filtered = [...activities];

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(act => act.difficulty.id === selectedDifficulty);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(act => act.type.id === selectedType);
    }

    setFilteredActivities(filtered);
  };

  // Función para eliminar actividad, llamada tras confirmación
  const confirmDelete = async () => {
    if (deleteId === null) return;

    try {
      await deleteActivity(deleteId);
      setToast({ message: 'Actividad eliminada correctamente', type: 'success' });
      setDeleteId(null);
      fetchData();
    } catch (error) {
      console.error('Error al eliminar la actividad:', error);
      setToast({ message: 'No se pudo eliminar la actividad.', type: 'error' });
      setDeleteId(null);
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

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="actions-bar">
        <button onClick={handleCreate} className="btn-crear">
          Crear Nueva Actividad
        </button>

        <div className="filters">
          <label>
            Filtrar por Dificultad:
            <select
              value={selectedDifficulty}
              onChange={e =>
                setSelectedDifficulty(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
            >
              <option value="all">Todas</option>
              {difficulties.map(diff => (
                <option key={diff.id} value={diff.id}>
                  {diff.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Filtrar por Tipo:
            <select
              value={selectedType}
              onChange={e =>
                setSelectedType(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
            >
              <option value="all">Todos</option>
              {types.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </label>
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
            <th>URL</th>
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
                <a href={activity.resourceUrl} target="_blank" rel="noopener noreferrer">
                  Ver recurso
                </a>
              </td>
              <td>
                <button onClick={() => handleEdit(activity.id)} className="btn-edit">
                  Editar
                </button>
                <button onClick={() => setDeleteId(activity.id)} className="btn-delete">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {filteredActivities.length === 0 && (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center' }}>
                No hay actividades para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal de confirmación */}
      {deleteId !== null && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>¿Estás seguro de eliminar esta actividad?</p>
            <div className="modal-buttons">
              <button
                className="btn-confirm"
                onClick={confirmDelete}
              >
                Sí, eliminar
              </button>
              <button
                className="btn-cancel"
                onClick={() => setDeleteId(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityList;
