import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Tabs, Tab, Paper, Avatar, Button, CircularProgress
} from '@mui/material';
import {
    getSesionesUsuario,
    getResultadosActividadPorSesionYUsuario
} from '../../../services/ApiService';
import ActivityResultTable from './ActivityResultTable';
import GraphEvolucion from './GraphEvolucion/GraphEvolucion';
import PromedioPorTipo from './Promedio/PromedioPorTipo';
import ResumenDashboard from './Resumen/ResumenDashboard';
import TiempoPromedioPorTipo from './tiempo/TiempoPromedioPorTipo';
import ResumenComparativo from './Exportar/ResumenComparativo';

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
    activity: { id: number };
}

const Estadisticas: React.FC = () => {
    const [sesiones, setSesiones] = useState<SesionUsuarioDTO[]>([]);
    const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
    const [resultados, setResultados] = useState<SessionActivityResultDTO[]>([]);
    const [activeTab, setActiveTab] = useState(0);
    const userId = localStorage.getItem('userId');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            getSesionesUsuario(userId).then(res => {
                setSesiones(res.data);
                setLoading(false);
            });
        }
    }, [userId]);

    const handleSessionClick = (sesion: any) => {
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

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box width="100%" height="100%" p={2} bgcolor="#f5f7fa">
            <Paper elevation={3} style={{ padding: 16, marginBottom: 16 }}>
                <Typography variant="h4" fontWeight="bold" color="primary">
                    Panel de Estadísticas
                </Typography>
                <Typography variant="body1" style={{ marginTop: 8 }}>
                    Visualiza tu rendimiento, progreso y evolución en las sesiones. 🚀
                </Typography>
            </Paper>

            <Paper
                elevation={3}
                style={{
                    padding: 8,
                    marginBottom: 16,
                    position: 'sticky',   // <--- sticky aquí
                    top: 0,
                    zIndex: 1100,         // que quede arriba de todo
                    backgroundColor: '#A7A7A7' // fondo blanco para que no sea transparente al pegarse
                }}
            >
                <Tabs
                    value={activeTab}
                    onChange={(_, newValue) => setActiveTab(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab label="📌 General" />
                    <Tab label="📋 Sesiones" />
                    <Tab label="📈 Evolución" />
                    <Tab label="📊 Promedios" />
                    <Tab label="⏱ Tiempo" />
                    <Tab label="📤 Exportar" />
                </Tabs>
            </Paper>


            <Box>
                {activeTab === 0 && <ResumenDashboard sesiones={sesiones} userId={userId} />}
                {activeTab === 1 && (
                    <>
                        {!selectedSessionId ? (
                            <>
                                <Typography variant="h5" mb={2}>Tus Sesiones Completadas</Typography>
                                <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
                                    {sesiones
                                        .filter(s => s.status === 'COMPLETADA')
                                        .map(s => (
                                            <Paper
                                                key={s.id}
                                                onClick={() => handleSessionClick(s)}
                                                style={{
                                                    padding: 16,
                                                    borderRadius: 16,
                                                    cursor: 'pointer',
                                                    width: 250,
                                                    transition: 'all 0.3s',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                }}
                                            >
                                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                                    <Typography variant="h6">{s.date}</Typography>
                                                    <Avatar sx={{ bgcolor: getColorByScore(s.result), color: 'white' }}>
                                                        {Math.round(s.result)}
                                                    </Avatar>
                                                </Box>
                                                <Typography variant="body2" mt={1}>⏱ {s.sessionDurationSeconds}s</Typography>
                                                <Typography variant="body2">🎮 Modo: {s.mode}</Typography>
                                            </Paper>
                                        ))}
                                </Box>
                            </>
                        ) : (
                            <Box>
                                <Button onClick={cerrarDetalles} variant="contained" sx={{ mb: 2 }}>← Volver</Button>
                                <Typography variant="h5" mb={2}>Resultados de Actividades</Typography>
                                <ActivityResultTable results={resultados} />
                            </Box>
                        )}
                    </>
                )}
                {activeTab === 2 && <GraphEvolucion sesiones={sesiones} />}
                {activeTab === 3 && <PromedioPorTipo />}
                {activeTab === 4 && <TiempoPromedioPorTipo />}
                {activeTab === 5 && <ResumenComparativo sesiones={sesiones} />}
            </Box>
        </Box>
    );
};

export default Estadisticas;
