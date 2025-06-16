    // src/pages/User/SessionGrid.tsx
    import  { useEffect, useState } from 'react';
    import './SesionGrid.css';
    import { fetchSessionsByUser, fetchActivitiesBySession } from '../../../../services/ApiService';
    import { useNavigate } from 'react-router-dom';

    const SessionGrid = () => {
      
      const [sessions, setSessions] = useState<any[]>([]);
      const [selectedSession, setSelectedSession] = useState<any | null>(null);
      const navigate = useNavigate();

      useEffect(() => {
        

    const userId = Number(localStorage.getItem('userId'));
    console.log("UserID cargado desde localStorage:", userId);

    if (!userId) return;

    async function loadSessions() {
      try {
        const res = await fetchSessionsByUser(userId);
        console.log("Respuesta completa:", res);
        console.log("Datos en res.data:", res.data);
        setSessions(Array.isArray(res) ? res : []);
      } catch (error) {
        console.error('Error al obtener sesiones por usuario:', error);
        setSessions([]);
      }
    }

    loadSessions();
  }, []);



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
            state: { session: selectedSession, activities }
          });
        } catch (error) {
          console.error('Error al obtener actividades:', error);
          
        }
        

      };
      /*console.log("Sesiones en estado:", sessions);
          console.log('Render sessions:', sessions);*/
      return (
        <div className="session-grid">
          <h2>🗓️ Sesiones Diarias</h2>
          <div className="circles">
            {sessions.map((s, idx) => (
              <div
                key={s.id}
                className={`circle ${s.status === 'COMPLETADA' ? 'blue' :
                  s.status === 'ACTIVA' ? 'green' : 'gray'}`}
                onClick={() => handleSessionClick(s)}
              >
                {idx + 1}
              </div>
            ))}
          </div>

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
