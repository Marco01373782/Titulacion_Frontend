    import React, { useEffect, useState } from 'react';
    import {
        Box, Typography, Tabs, Tab, Paper, Avatar, Button, CircularProgress, useTheme, useMediaQuery
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

        const theme = useTheme();
        const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

        useEffect(() => {
    if (userId) {
        getSesionesUsuario(userId).then(async res => {
            const sesionesConPromedio = await Promise.all(res.data.map(async (s: SesionUsuarioDTO) => {
                try {
                    const avgRes = await getAverageForSessionAndUser(s.sesionId, parseInt(userId));
                    return { ...s, result: avgRes.data }; // Sobrescribe el result
                } catch {
                    return { ...s, result: 0 };
                }
            }));

            setSesiones(sesionesConPromedio);
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
            <Box width="100%" minHeight="100%" bgcolor="#e9edf3">
                {/* Header general */}
                <Box sx={{
                    maxWidth: 1200,
                    margin: '0 auto',
                    padding: isMobile ? '16px' : '24px 32px',
                }}>
                    <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold" color="primary">
                        Panel de Estadísticas
                    </Typography>
                    <Typography variant="body1" mt={1}>
                        Visualiza el rendimiento, progreso y evolución de tu ser querido🚀
                    </Typography>
                </Box>

                {/* Sticky Tabs */}
                <Paper
                    elevation={1}
                    sx={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 1000,
                        backgroundColor: '#ffffff',
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

                {/* Contenido de cada Tab */}
                <Box sx={{
                    maxWidth: 1200,
                    margin: '0 auto',
                    padding: isMobile ? '16px' : '24px 32px',
                }}>
                    {activeTab === 0 && <ResumenDashboard sesiones={sesiones} userId={userId} />}
                    {activeTab === 1 && (
                        <>
                            {!selectedSessionId ? (
                                <>
                                    <Typography variant="h5" mb={2}>Tus Sesiones Completadas</Typography>
                                    <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
                                        {sesiones.filter(s => s.status === 'COMPLETADA').map(s => (
                                            <Paper
                                                key={s.id}
                                                onClick={() => handleSessionClick(s)}
                                                elevation={2}
                                                sx={{
                                                    padding: 2,
                                                    borderRadius: 2,
                                                    cursor: 'pointer',
                                                    width: 250,
                                                    transition: 'transform 0.3s',
                                                    '&:hover': { transform: 'translateY(-5px)' },
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
