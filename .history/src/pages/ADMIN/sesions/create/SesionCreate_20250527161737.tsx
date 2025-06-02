import React, { useState, useEffect } from 'react';
import {
  createSession,
  fetchDifficulties,
  assignActivitiesAuto,
  fetchAllActivities,
  assignActivitiesManual
} from '../../../../services/ApiService';
import { useNavigate } from 'react-router-dom';
import ActivitySelector from '../../../../components/modal/Activity-Selector/ActivitySelector';
import LoadingOverlay from '../../../../components/loading/LoadingOverlay'; // ajusta ruta si es necesario
import './SesionCreate.css';

interface Difficulty {
  id: number;
  name: string;
}

interface Activity {
  id: number;
  title: string;
  type: { name: string };
  difficulty: { id: number };
}

const SesionCreate: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficultyId, setDifficultyId] = useState<number | null>(null);
  const [difficulties, setDifficulties] = useState<Difficulty[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [sesionId, setSesionId] = useState<number | null>(null);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivityIds] = useState<number[]>([]);
  const [showManualSelect, setShowManualSelect] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchDifficulties()
      .then((res) => setDifficulties(res.data))
      .catch(() => setMensaje('Error al cargar dificultades'));
  }, []);

  useEffect(() => {
    if (sesionId) {
      fetchAllActivities()
        .then((res) => setActivities(res.data))
        .catch(() => setMensaje('Error al cargar actividades'));
    }
  }, [sesionId]);

  const handleAsignarManual = () => {
    if (!sesionId) return;
    setShowManualSelect(true);
  };

  const handleAsignarAuto = () => {
    if (!sesionId) return;

    setLoading(true);
    setLoadingMessage('Asignando actividades...');

    assignActivitiesAuto(sesionId)
      .then(() => {
        setMensaje('Actividades asignadas automáticamente');
        setTimeout(() => {
          setLoading(false);
          navigate('/app/gestionar-sesiones');
        }, 1000);
      })
      .catch(() => {
        setMensaje('Error al asignar actividades automáticamente');
        setLoading(false);
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!difficultyId) {
      setMensaje('Selecciona una dificultad');
      return;
    }

    setLoading(true);
    setLoadingMessage('Creando sesión...');

    const sesionPayload = {
      title,
      description,
      difficulty: { id: difficultyId }
    };

    createSession(sesionPayload)
      .then((res) => {
        setSesionId(res.data.id);
        setMensaje('Sesión creada exitosamente');
        setLoading(false);
      })
      .catch(() => {
        setMensaje('Error al crear la sesión');
        setLoading(false);
      });
  };

  const filteredActivities = activities.filter(
    (a) => a.difficulty?.id === difficultyId
  );

  return (
    <div className="sesion-create-container">
      <h2>Crear nueva sesión</h2>
      <form onSubmit={handleSubmit} className="sesion-form">
        <label>Título:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={loading}
        />

        <label>Descripción:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          disabled={loading}
        />

        <label>Dificultad:</label>
        <select
          value={difficultyId || ''}
          onChange={(e) => setDifficultyId(Number(e.target.value))}
          required
          disabled={loading}
        >
          <option value="" disabled>
            Selecciona una dificultad
          </option>
          {difficulties.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <button type="submit" disabled={loading}>
          Crear sesión
        </button>
      </form>

      {sesionId && (
        <div className="asignar-buttons">
          <button onClick={handleAsignarManual} disabled={loading}>
            Asignar manualmente
          </button>
          <button onClick={handleAsignarAuto} disabled={loading}>
            Asignar automáticamente
          </button>
        </div>
      )}

      {showManualSelect && sesionId && (
        <ActivitySelector
          activities={filteredActivities}
          selectedActivityIds={selectedActivityIds}
          onClose={() => setShowManualSelect(false)}
          onConfirm={(selectedIds) => {
            if (selectedIds.length === 0) {
              setMensaje('Selecciona al menos una actividad');
              return;
            }

            setLoading(true);
            setLoadingMessage('Asignando actividades...');

            assignActivitiesManual(sesionId, selectedIds)
              .then(() => {
                setMensaje('Actividades asignadas manualmente');
                setShowManualSelect(false);
                setLoading(false);
                setTimeout(() => {
                  navigate('/app/gestionar-sesiones');
                }, 1000);
              })
              .catch(() => {
                setMensaje('Error al asignar manualmente');
                setLoading(false);
              });
          }}
          loading={loading}
        />
      )}

      {mensaje && <p className="mensaje">{mensaje}</p>}

      {/* Loading Overlay en toda la pantalla */}
      <LoadingOverlay visible={loading} message={loadingMessage} />
    </div>
  );
};

export default SesionCreate;
