// src/pages/User/SessionGrid.tsx
import { useEffect, useState } from 'react';
import './SesionGrid.css';
import { fetchSesionesUsuarioByUserId, fetchActivitiesBySession } from '../../../services/ApiService';
import { useNavigate } from 'react-router-dom';

const SessionGrid = () => {
  const [sesionesUsuario, setSesionesUsuario] = useState<any[]>([]);
  const [selectedSesionUsuario, setSelectedSesionUsuario] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.id;

    if (!userId) {
      console.error('❌ No se encontró el userId en localStorage');
      return;
    }

    fetchSesionesUsuarioByUserId(userId)
      .then(res => setSesionesUsuario(res.data))
      .catch(err => console.error('❌ Error al obtener sesiones del usuario:', err));
  }, []);

  const handleSessionClick = (sesionUsuario: any) => {
    setSelectedSesionUsuario(sesionUsuario);
  };

  const handleStart = async () => {
    if (!selectedSesionUsuario) return;

    try {
      const activities = await fetchActivitiesBySession(selectedSesionUsuario.sesion.id);

      // Guardar en localStorage si quieres persistencia
      localStorage.setItem('selectedSession', JSON.stringify(selectedSesionUsuario.sesion));
      localStorage.setItem('selectedActivities', JSON.stringify(activities));
      localStorage.setItem('selectedSesionUsuarioId', selectedSesionUsuario.id.toString());

      navigate(`/user/terapias-sesiones/${selectedSesionUsuario.sesion.id}`, {
        state: {
          session: selectedSesionUsuario.sesion,
          activities,
          sesionUsuarioId: selectedSesionUsuario.id,
        }
      });
    } catch (error) {
      console.error('❌ Error al obtener actividades:', error);
    }
  };

  return (
    <div className="session-grid">
      <h2>🗓️ Sesiones Diarias</h2>
      <div className="circles">
        {sesionesUsuario.map((sesionUsuario, idx) => (
          <div
            key={sesionUsuario.id}
            className="circle"
            onClick={() => handleSessionClick(sesionUsuario)}
          >
            {idx + 1}
          </div>
        ))}
      </div>

      {selectedSesionUsuario && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedSesionUsuario.sesion.title}</h3>
            <p>{selectedSesionUsuario.sesion.description}</p>
            <button onClick={handleStart}>Iniciar Sesión</button>
            <button onClick={() => setSelectedSesionUsuario(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionGrid;
