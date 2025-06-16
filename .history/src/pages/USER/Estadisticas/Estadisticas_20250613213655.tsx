    // src/estadisticas/estadisticas.tsx
    import React, { useEffect, useState } from 'react';
    import './estadisticas.css';
    import { getSesionesUsuario, getResultadosActividadPorSesionYUsuario } from '../../../services/ApiService';

    interface SesionUsuarioDTO {
    id: number;
    sesionId: number;
    userId: number;
    status: string;
    startedAt: string;
    endedAt: string;
    sessionDurationSeconds: number;
    result: number;
    mode: string;
    date: string;
    }

    interface SessionActivityResultDTO {
    sesionUsuarioId: number;
    activityId: number;
    result: number;
    completedAt: string;
    durationSeconds: number;
    }

    const Estadisticas: React.FC = () => {
    const [sesiones, setSesiones] = useState<SesionUsuarioDTO[]>([]);
    const [selectedSession, setSelectedSession] = useState<SesionUsuarioDTO | null>(null);
    const [resultados, setResultados] = useState<SessionActivityResultDTO[]>([]);
    const userId = localStorage.getItem('userId'); // Asumiendo que lo guardas así

    useEffect(() => {
        if (userId) {
        getSesionesUsuario(userId).then(res => {
            setSesiones(res.data);
        });
        }
    }, [userId]);

    const verDetalles = (sesion: any) => {
        

        if (userId && sesion.sesion && sesion.sesion.id) {
            setSelectedSession(sesion);
            getResultadosActividadPorSesionYUsuario(sesion.sesion.id, userId)
            .then(res => {
                setResultados(res.data);
            })
            .catch(err => {
                console.error("❌ Error al obtener resultados de actividades:", err);
            });
        } else {
            console.error("❌ ID inválido: sessionId o userId es NaN");
        }

console.log("🧠 sesionId:", sesion.sesionId);
console.log("👤 userId:", userId);

            };


    const cerrarDetalles = () => {
        setSelectedSession(null);
        setResultados([]);
    };

    return (
        <div className="estadisticas-container">
        <h2>Tus Sesiones</h2>
        <div className="sesiones-grid">
            {sesiones.map(s => (
            <div key={s.id} className="sesion-card" onClick={() => verDetalles(s)}>
                <p><strong>Fecha:</strong> {s.date}</p>
                <p><strong>Resultado:</strong> {s.result ?? 'Sin completar'}</p>
                <p><strong>Duración:</strong> {s.sessionDurationSeconds ?? 0} s</p>
                <p><strong>Estado:</strong> {s.status}</p>
            </div>
            ))}
        </div>

        {selectedSession && (
            <div className="modal-detalles">
            <div className="modal-content">
                <h3>Detalles de la sesión del {selectedSession.date}</h3>
                <button onClick={cerrarDetalles}>Cerrar</button>
                <table>
                <thead>
                    <tr>
                    <th>ID Actividad</th>
                    <th>Puntaje</th>
                    <th>Duración (s)</th>
                    <th>Fecha completada</th>
                    </tr>
                </thead>
                <tbody>
                        {resultados
  .filter(r => r.sesionUsuarioId !== undefined && r.activityId !== undefined)
  .map(r => (
    <tr key={`${r.sesionUsuarioId}-${r.activityId}`}>
      <td>{r.activityId}</td>
      <td>{r.result ?? 'N/A'}</td>
      <td>{r.durationSeconds ?? 0}</td>
      <td>{r.completedAt ? new Date(r.completedAt).toLocaleString() : 'N/A'}</td>
    </tr>
))}


                </tbody>
                </table>
            </div>
            </div>
        )}
        </div>
    );
    };

    export default Estadisticas;
