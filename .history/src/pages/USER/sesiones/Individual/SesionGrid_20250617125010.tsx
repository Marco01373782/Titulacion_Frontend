import { useEffect, useState } from 'react';
import './SesionGrid.css';
import { fetchSessionsByUser, fetchActivitiesBySession, fetchDifficulties } from '../../../../services/ApiService';
import { useNavigate } from 'react-router-dom';

const MAX_SLOTS = 10; // Máximo círculos que mostrar (bloqueados o no)

const SessionGrid = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<any | null>(null);
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const userId = Number(localStorage.getItem('userId'));
    if (!userId) return;

    // Carga dificultades
    fetchDifficulties()
      .then(diff => {
        setDifficulties(diff);
        if (diff.length > 0) setSelectedDifficulty(diff[0]); // Selecciona la primera por defecto
      })
      .catch(e => console.error('Error al cargar dificultades:', e));

    // Carga sesiones del usuario
    fetchSessionsByUser(userId)
      .then(res => {
        const data = Array.isArray(res) ? res : [];
        setSessions(data);
      })
      .catch(e => {
        console.error('Error al obtener sesiones por usuario:', e);
        setSessions([]);
      });
  }, []);

  // Filtrar sesiones cuando cambie la dificultad o sesiones
  useEffect(() => {
    if (!selectedDifficulty) {
      setFilteredSessions(sessions);
      return;
    }
    const filtered = sessions.filter(s => s.sesion.difficulty === selectedDifficulty);
    setFilteredSessions(filtered);
    setSelectedSession(null); // Reset al cambiar filtro
  }, [selectedDifficulty, sessions]);

  const handleSessionClick = (session: any) => {
    if (session.status === 'ACTIVA') {
      setSelectedSession(session);
    }
  };

  const handleStart = async () => {
    if (!selectedSession) return;

    try {
      const activities = await fetchActivitiesBySession(selectedSession.sesion.id);
      localStorage.setItem('selectedSesionUsuarioId', selectedSession.id.toString());
      localStorage.setItem('selectedSession', JSON.stringify(selectedSession));
      localStorage.setItem('selectedActivities', JSON.stringify(activities));
      navigate(`/user/terapias-sesiones/${selectedSession.id}`, {
        state: { session: selectedSession, activities },
      });
    } catch (error) {
      console.error('Error al obtener actividades:', error);
    }
  };

  // Construir array para mostrar círculos bloqueados (grises)
  const totalSlots = MAX_SLOTS;
  const slots = [...filteredSessions];
  while (slots.length < totalSlots) {
    slots.push(null); // null representa slot bloqueado
  }

  return (
    <div className="session-grid">
      <h2>🗓️ Sesiones Diarias</h2>

      {/* Selector de dificultad */}
      <select
        value={selectedDifficulty}
        onChange={e => setSelectedDifficulty(e.target.value)}
        style={{ marginBottom: '1rem', padding: '0.5rem', fontSize: '1rem' }}
      >
        {difficulties.map(diff => (
          <option key={diff} value={diff}>
            {diff}
          </option>
        ))}
      </select>

      {/* Círculos de sesiones */}
      <div className="circles">
        {slots.map((session, idx) => {
          if (session === null) {
            // Slot bloqueado
            return (
              <div key={`locked-${idx}`} className="circle gray" style={{ cursor: 'default', opacity: 0.5 }}>
                {idx + 1}
              </div>
            );
          } else {
            // Sesión real
            const colorClass =
              session.status === 'COMPLETADA'
                ? 'blue'
                : session.status === 'ACTIVA'
                ? 'green'
                : 'gray';

            return (
              <div
                key={session.id}
                className={`circle ${colorClass}`}
                onClick={() => handleSessionClick(session)}
                title={`${session.sesion.title} - ${session.status}`}
              >
                {idx + 1}
              </div>
            );
          }
        })}
      </div>

      {/* Modal para sesión seleccionada */}
      {selectedSession && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedSession.sesion.title}</h3>
            <p>{selectedSession.sesion.description}</p>

            <button onClick={handleStart}>Iniciar Sesión</button>
            <button onClick={() => setSelectedSession(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionGrid;
