import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchAllActivities,
  deleteActivity,
  fetchDifficulties,
  fetchActivityTypes,
} from '../../../../services/ApiService';
import Toast from '../../../../components/toast/Toast';
import LoadingOverlay from '../../../../components/modal/Loading/LoadingOverlay';
import './ActivityList.css';

interface Activity {
  id: number;
  title: string;
  description: string;
  resourceUrl: string;
  type: string; // Cambiado a string
  difficulty: string; // Cambiado a string
}

const ActivityList = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [activities, selectedDifficulty, selectedType]);

  const fetchData = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...activities];

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(act => act.difficulty === selectedDifficulty);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(act => act.type === selectedType);
    }

    setFilteredActivities(filtered);
  };

  const confirmDelete = async () => {
    if (deleteId === null) return;

    setDeleting(true);
    setLoading(true);

    try {
      await deleteActivity(deleteId);
      setDeleteId(null);
      await fetchData();

      setTimeout(() => {
        setToast({ message: 'Actividad eliminada correctamente', type: 'success' });
      }, 300);
    } catch (error) {
      console.error('Error al eliminar la actividad:', error);
      setToast({ message: 'No se pudo eliminar la actividad.', type: 'error' });
      setDeleteId(null);
    } finally {
      setDeleting(false);
      setLoading(false);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/editar-actividad/${id}`);
  };

  const handleCreate = () => {
    navigate('/admin/crear-actividad');
  };

  return (
    <div className="activity-list-container">
      <LoadingOverlay visible={loading} message={deleting ? "Eliminando actividad..." : "Cargando actividades..."} />

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
              onChange={e => setSelectedDifficulty(e.target.value)}
            >
              <option value="all">Todas</option>
              {difficulties.map(diff => (
                <option key={diff} value={diff}>
                  {diff.charAt(0).toUpperCase() + diff.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </label>

          <label>
            Filtrar por Tipo:
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
            >
              <option value="all">Todos</option>
              {types.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
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
              <td>{activity.type}</td>
              <td>{activity.difficulty}</td>
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

      {deleteId !== null && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>¿Estás seguro de eliminar esta actividad?</p>
            <div className="modal-buttons">
              <button
                className="btn-confirm"
                onClick={confirmDelete}
                disabled={deleting}
              >
                Sí, eliminar
              </button>
              <button
                className="btn-cancel"
                onClick={() => setDeleteId(null)}
                disabled={deleting}
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
