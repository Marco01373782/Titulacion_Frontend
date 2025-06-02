import React, { useEffect, useState } from 'react';
import './SesionList.css';
import {
  deleteSesion,
  fetchSesiones,
  fetchActivitiesBySession
} from '../../../../services/ApiService';
import { useNavigate } from 'react-router-dom';

interface Sesion {
  id: number;
  name: string;
  description: string;
  difficulty: {
    id: number;
    name: string;
  };
}

const SesionList = () => {
  const [sesiones, setSesiones] = useState<Sesion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [selectedSessionActivities, setSelectedSessionActivities] = useState<string[] | null>(null);
  const [activityModalSessionId, setActivityModalSessionId] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadSesiones = async () => {
      try {
        const response = await fetchSesiones();
        setSesiones(response.data);
      } catch (err) {
        setError('Error al cargar las sesiones');
      } finally {
        setLoading(false);
      }
    };

    loadSesiones();
  }, []);

  const handleDelete = async () => {
    if (deleteId !== null) {
      try {
        await deleteSesion(deleteId);
        setSesiones(sesiones.filter((sesion) => sesion.id !== deleteId));
        setToast({ message: 'Sesión eliminada correctamente', type: 'success' });
      } catch (err) {
        setToast({ message: 'Error al eliminar la sesión', type: 'error' });
      } finally {
        setDeleteId(null);
      }
    }
  };

  const handleViewActivities = async (sessionId: number) => {
    try {
      const res = await fetchActivitiesBySession(sessionId);
      const activityTitles = res.data.map((a: any) => a.title || a.name || `Actividad ${a.id}`);
      setSelectedSessionActivities(activityTitles);
      setActivityModalSessionId(sessionId);
    } catch (err) {
      console.error('Error al obtener actividades', err);
      setToast({ message: 'Error al obtener actividades', type: 'error' });
    }
  };

  return (
    <div className="sesion-list-container">
      <h2>Listado de Sesiones</h2>
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
          <button onClick={() => setToast(null)}>X</button>
        </div>
      )}
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Cargando sesiones...</p>
      ) : (
        <table className="sesion-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Dificultad</th>
              <th>Actividades</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sesiones.map((sesion) => (
              <tr key={sesion.id}>
                <td>{sesion.id}</td>
                <td>{sesion.name}</td>
                <td>{sesion.description}</td>
                <td>{sesion.difficulty.name}</td>
                <td>
                  <button
                    className="btn-ver"
                    onClick={() => handleViewActivities(sesion.id)}
                  >
                    Ver
                  </button>
                </td>
                <td>
                  <button className="btn-edit" onClick={() => navigate(`/app/sesiones/editar/${sesion.id}`)}>Editar</button>
                  <button className="btn-delete" onClick={() => setDeleteId(sesion.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal de confirmación de eliminación */}
      {deleteId !== null && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>¿Estás seguro de que deseas eliminar esta sesión?</p>
            <div className="modal-buttons">
              <button className="btn-delete" onClick={handleDelete}>Sí, eliminar</button>
              <button className="btn-cancel" onClick={() => setDeleteId(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver actividades */}
      {selectedSessionActivities && activityModalSessionId !== null && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Actividades de la Sesión #{activityModalSessionId}</h3>
            <ul style={{ textAlign: 'left' }}>
              {selectedSessionActivities.map((title, idx) => (
                <li key={idx}>{title}</li>
              ))}
            </ul>
            <button
              className="btn-cancel"
              onClick={() => {
                setSelectedSessionActivities(null);
                setActivityModalSessionId(null);
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SesionList;
