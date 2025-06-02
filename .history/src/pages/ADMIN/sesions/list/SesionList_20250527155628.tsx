import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchAllSessions,
  fetchDifficulties,
  deleteSession,
  fetchActivitiesBySession
} from '../../../../services/ApiService';
import Toast from '../../../../components/toast/Toast';
import LoadingOverlay from '../../../../components/loaders/LoadingOverlay';
import './SesionList.css';

interface Difficulty {
  id: number;
  name: string;
}

interface Session {
  id: number;
  title: string;
  description: string;
  difficulty: Difficulty;
}

const SessionList = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
  const [difficulties, setDifficulties] = useState<Difficulty[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | 'all'>('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [activitiesModal, setActivitiesModal] = useState<{ sessionId: number; activities: string[] } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [sessions, selectedDifficulty]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const sesRes = await fetchAllSessions();
      setSessions(sesRes.data);

      const diffRes = await fetchDifficulties();
      setDifficulties(diffRes.data);
    } catch (err) {
      console.error('Error al cargar sesiones o dificultades', err);
      setToast({ message: 'Error al cargar datos', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...sessions];
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(s => s.difficulty.id === selectedDifficulty);
    }
    setFilteredSessions(filtered);
  };

  const handleCreate = () => {
    navigate('/app/crear-sesiones');
  };

  const handleEdit = (id: number) => {
    navigate(`/app/editar-sesiones/${id}`);
  };

  const confirmDelete = async () => {
    if (deleteId === null) return;
    setDeleting(true);
    try {
      await deleteSession(deleteId);
      setToast({ message: 'Sesión eliminada correctamente', type: 'success' });
      setDeleteId(null);
      fetchData();
    } catch (error) {
      console.error('Error al eliminar la sesión:', error);
      setToast({ message: 'No se pudo eliminar la sesión.', type: 'error' });
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleViewActivities = async (sessionId: number) => {
    try {
      const res = await fetchActivitiesBySession(sessionId);
      const activityTitles = res.data.map((a: any) =>
        a.activity?.title || a.activity?.name || `Actividad ${a.activity?.id ?? a.id}`
      );
      setActivitiesModal({ sessionId, activities: activityTitles });
    } catch (err) {
      console.error('Error al obtener actividades:', err);
      setToast({ message: 'Error al obtener actividades', type: 'error' });
    }
  };

  return (
    <div className="session-list-container">
      <h2>Lista de Sesiones</h2>

      {loading && <LoadingOverlay text="Cargando sesiones..." />}
      {deleting && <LoadingOverlay text="Eliminando sesión..." />}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="actions-bar">
        <button onClick={handleCreate} className="btn-crear">Crear Nueva Sesión</button>

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
              {difficulties.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
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
            <th>Dificultad</th>
            <th>Actividades</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredSessions.map(session => (
            <tr key={session.id}>
              <td>{session.id}</td>
              <td>{session.title}</td>
              <td>{session.description}</td>
              <td>{session.difficulty.name}</td>
              <td>
                <button className="btn-ver" onClick={() => handleViewActivities(session.id)}>Ver</button>
              </td>
              <td>
                <button onClick={() => handleEdit(session.id)} className="btn-edit">Editar</button>
                <button onClick={() => setDeleteId(session.id)} className="btn-delete">Eliminar</button>
              </td>
            </tr>
          ))}
          {filteredSessions.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center' }}>
                No hay sesiones para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal de confirmación */}
      {deleteId !== null && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>¿Estás seguro de eliminar esta sesión?</p>
            <div className="modal-buttons">
              <button className="btn-confirm" onClick={confirmDelete}>Sí, eliminar</button>
              <button className="btn-cancel" onClick={() => setDeleteId(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de actividades */}
      {activitiesModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Actividades de la Sesión #{activitiesModal.sessionId}</h3>
            {activitiesModal.activities.length > 0 ? (
              <ul style={{ textAlign: 'left' }}>
                {activitiesModal.activities.map((title, idx) => (
                  <li key={idx}>{title}</li>
                ))}
              </ul>
            ) : (
              <p>No hay actividades asignadas a esta sesión.</p>
            )}
            <button className="btn-cancel" onClick={() => setActivitiesModal(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionList;
