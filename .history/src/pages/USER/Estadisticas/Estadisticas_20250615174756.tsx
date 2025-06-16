    // src/estadisticas/estadisticas.tsx
    import React, { useEffect, useState } from 'react';
    import './estadisticas.css';
    import { getSesionesUsuario, getResultadosActividadPorSesionYUsuario } from '../../../services/ApiService';
    import ActivityResultTable from './ActivityResultTable';
    import GraphEvolucion from './GraphEvolucion/GraphEvolucion';

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
    const [activeTab, setActiveTab] = useState<'sesiones' | 'evolucion'>('sesiones');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (userId) {
        getSesionesUsuario(userId).then(res => setSesiones(res.data));
        }
    }, [userId]);

    const verDetalles = (sesion: any) => {
        if (userId && sesion.sesion && sesion.sesion.id) {
        setSelectedSessionId(sesion.sesion.id);
        getResultadosActividadPorSesionYUsuario(sesion.sesion.id, userId)
            .then(res => setResultados(res.data))
            .catch(err => console.error("❌ Error al obtener resultados:", err));
        }
    };

    const cerrarDetalles = () => {
        setSelectedSessionId(null);
        setResultados([]);
    };

    const getColorByScore = (score: number): string => {
        if (score >= 75) return '#4caf50';
        if (score >= 50) return '#ff9800';
        return '#f44336';
    };

    return (
        <div className="estadisticas-container">
        <nav className="estadisticas-nav">
            <button
            className={activeTab === 'sesiones' ? 'active' : ''}
            onClick={() => setActiveTab('sesiones')}
            >
            📋 Sesiones
            </button>
            <button
            className={activeTab === 'evolucion' ? 'active' : ''}
            onClick={() => setActiveTab('evolucion')}
            >
            📈 Evolución
            </button>
            <button disabled>📊 Promedios</button>
            <button disabled>🧾 Historial</button>
            <button disabled>📤 Exportar</button>
        </nav>

        <h2>Tus Sesiones</h2>

        {!selectedSessionId && activeTab === 'sesiones' && (
            <div className="sesiones-grid">
            {sesiones
                .filter(s => s.status === 'COMPLETADA')
                .map(s => (
                <div key={s.id} className="sesion-card" onClick={() => verDetalles(s)}>
                    <div className="resultado-circle" style={{ borderColor: getColorByScore(s.result) }}>
                    {Math.round(s.result)}
                    </div>
                    <div className="sesion-info">
                    <p className="sesion-fecha">📅 {s.date}</p>
                    <p className="sesion-duracion">⏱️ {s.sessionDurationSeconds ?? 0} s</p>
                    <p className="sesion-modo">🎮 Modo: {s.mode}</p>
                    </div>
                </div>
                ))}
            </div>
        )}

        {selectedSessionId && activeTab === 'sesiones' && (
            <div className="detalles-sesion">
            <button onClick={cerrarDetalles} className="btn-volver">← Volver</button>
            <h3>Resultados de actividades</h3>
            <ActivityResultTable results={resultados} />
            </div>
        )}

        {activeTab === 'evolucion' && (
            <div className="evolucion-container">
            <GraphEvolucion sesiones={sesiones} />
            </div>
        )}
        </div>
    );
    };

    export default Estadisticas;
