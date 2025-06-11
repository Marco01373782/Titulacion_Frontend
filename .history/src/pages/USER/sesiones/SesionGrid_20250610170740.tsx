// src/pages/User/SessionGrid.tsx
import React, { useEffect, useState } from 'react';
import './SesionGrid.css';
import { fetchAllSessions, fetchActivitiesBySession } from '../../../services/ApiService';
import { useNavigate } from 'react-router-dom';

const SessionGrid = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
  const userId = Number(localStorage.getItem('userId'));
  if (!userId) return;

  fetchSessionsByUser(userId)
    .then(res => {
      const sesionesUsuario = res.data; // <--- aquí obtienes status, sesionId, etc.
      // Opcional: hacer join para obtener nombre y descripción de la sesión plantilla.
      setSessions(sesionesUsuario);
    })
    .catch(err => {
      console.error('Error al obtener sesiones por usuario:', err);
      setSessions([]);
    });
}, []);


  const handleSessionClick = (session: any) => {
    setSelectedSession(session);
  };

  const handleStart = async () => {
    if (!selectedSession) return;

    try {
      const activities = await fetchActivitiesBySession(selectedSession.id) || [];


      console.log('Actividades para la sesión:', activities);
      console.log('Sesión seleccionada:', selectedSession);

      // Guardamos en localStorage con seguridad
      localStorage.setItem('selectedSession', JSON.stringify(selectedSession || {}));
      localStorage.setItem('selectedActivities', JSON.stringify(activities));

      // Navegamos a la pantalla runner, pasando datos por estado
      navigate(`/user/terapias-sesiones/${selectedSession.id}`, {
        state: { session: selectedSession, activities }
      });
    } catch (error) {
      console.error('Error al obtener actividades:', error);
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
