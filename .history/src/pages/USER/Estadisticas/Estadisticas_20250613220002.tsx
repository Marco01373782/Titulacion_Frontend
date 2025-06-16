        // src/estadisticas/estadisticas.tsx
        import React, { useEffect, useState } from 'react';
        import './estadisticas.css';
        import { getSesionesUsuario, getResultadosActividadPorSesionYUsuario } from '../../../services/ApiService';
        import ActivityResultTable from './ActivityResultTable'; // importamos el nuevo componente

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
        id: number;
        result?: number;
        durationSeconds?: number;
        completedAt?: string;
        activity: {
            id: number;
        };
        }

        const Estadisticas: React.FC = () => {
        const [sesiones, setSesiones] = useState<SesionUsuarioDTO[]>([]);
        const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
        const [resultados, setResultados] = useState<SessionActivityResultDTO[]>([]);
        const userId = localStorage.getItem('userId');

        useEffect(() => {
            if (userId) {
            getSesionesUsuario(userId).then(res => {
                setSesiones(res.data);
            });
            }
        }, [userId]);

        const verDetalles = (sesion: any) => {
    console.log("📦 Sesión seleccionada:", sesion);
    console.log("🧠 sessionId:", sesion.sesion?.id);
    console.log("👤 userId:", userId);

    if (userId && sesion.sesion && sesion.sesion.id) {
        setSelectedSessionId(sesion.sesion.id);

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
    };


        const cerrarDetalles = () => {
            setSelectedSessionId(null);
            setResultados([]);
        };

        return (
            <div className="estadisticas-container">
            <h2>Tus Sesiones</h2>

            {!selectedSessionId && (
                <div className="sesiones-grid">
                {sesiones
  .filter(s => s.status === 'COMPLETADA') // 👈 aquí filtramos
  .map(s => (
    <div key={s.id} className="sesion-card" onClick={() => verDetalles(s)}>

                    <p><strong>Fecha:</strong> {s.date}</p>
                    <p><strong>Resultado:</strong> {s.result ?? 'Sin completar'}</p>
                    <p><strong>Duración:</strong> {s.sessionDurationSeconds ?? 0} s</p>
                    <p><strong>Estado:</strong> {s.status}</p>
                    </div>
                ))}
                </div>
            )}

            {selectedSessionId && (
                <div className="detalles-sesion">
                <button onClick={cerrarDetalles} className="btn-volver">← Volver</button>
                <h3>Resultados de actividades</h3>
                <ActivityResultTable results={resultados} />
                </div>
            )}
            </div>
        );
        };

        export default Estadisticas;
