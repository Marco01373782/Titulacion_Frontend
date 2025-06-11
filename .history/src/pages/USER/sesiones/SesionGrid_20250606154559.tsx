// src/pages/User/SessionGrid.tsx
import { useEffect, useState } from 'react';
import './SesionGrid.css';
import { fetchAllSessions, fetchActivitiesBySession } from '../../../services/ApiService';
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
    const activitiesRes = await fetchActivitiesBySession(selectedSession.id);
    navigate(`user//terapias-sesiones/${selectedSession.id}`, {
      state: { session: selectedSession, activities: activitiesRes.data }
    });
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
