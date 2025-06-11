import { useEffect, useState } from 'react';
import './SesionGrid.css';
import {
  fetchAllSessions,
  fetchActivitiesBySession,
  fetchSesionUsuarioBySesionAndUser,
} from '../../../services/ApiService';
import { useNavigate } from 'react-router-dom';

const SessionGrid = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllSessions().then(res => setSessions(res.data));
  }, []);

  const handleSessionClick = (session: any) => {
    setSelectedSession(session);
  };

  const handleStart = async () => {
    try {
      const token = localStorage.getItem('token');
      const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : null;
      const userId = decodedToken?.userId;

      if (!userId) {
        console.error('❌ No se pudo obtener el userId del token.');
        return;
      }

      const sesionUsuario = await fetchSesionUsuarioBySesionAndUser(selectedSession.id, userId);
      const sesionUsuarioId = sesionUsuario.id;

      const activities = await fetchActivitiesBySession(selectedSession.id);

      console.log('Actividades para la sesión:', activities);
      console.log('Sesión seleccionada:', selectedSession);
      console.log('🧠 sesionUsuarioId:', sesionUsuarioId);

      localStorage.setItem('selectedSession', JSON.stringify(selectedSession));
      localStorage.setItem('selectedActivities', JSON.stringify(activities));
      localStorage.setItem('selectedSesionUsuarioId', sesionUsuarioId.toString());

      navigate(`/user/terapias-sesiones/${selectedSession.id}`, {
        state: {
          session: { ...selectedSession, sesionUsuarioId },
          activities,
        },
      });
    } catch (error) {
      console.error('❌ Error al iniciar la sesión:', error);
    }
  };

  return (
    <div className="session-grid">
      <h2>🗓️ Sesiones Diarias</h2>
      <div className="circles">
        {sessions.map((session, idx) => (
          <div
            key={session.id}
            className="circle"
            onClick={() => handleSessionClick(session)}
          >
            {idx + 1}
          </div>
        ))}
      </div>

      {selectedSession && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedSession.title}</h3>
            <p>{selectedSession.description}</p>
            <button onClick={handleStart}>Iniciar Sesión</button>
            <button onClick={() => setSelectedSession(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionGrid;
