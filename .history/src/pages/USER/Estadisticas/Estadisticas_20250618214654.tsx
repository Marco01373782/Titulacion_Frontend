    // src/pages/USER/Estadisticas/Estadisticas.tsx
    import React, { useEffect, useState } from 'react';
    import { Box, Typography, Tabs, Tab, CircularProgress, Paper, useMediaQuery, useTheme } from '@mui/material';
    import { getSesionesUsuario, getResultadosActividadPorSesionYUsuario } from '../../../services/ApiService';
    import ResumenDashboard from './Resumen/ResumenDashboard';
    import ActivityResultTable from './ActivityResultTable';
    import GraphEvolucion from './GraphEvolucion/GraphEvolucion';
    import PromedioPorTipo from './Promedio/PromedioPorTipo';
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
        const theme = useTheme();
        const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
        const [tabIndex, setTabIndex] = useState(0);
        const [sesiones, setSesiones] = useState<SesionUsuarioDTO[]>([]);
        const [loading, setLoading] = useState(true);
        const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
        const [resultados, setResultados] = useState<SessionActivityResultDTO[]>([]);
        const userId = localStorage.getItem('userId');

        useEffect(() => {
            if (userId) {
                getSesionesUsuario(userId)
                    .then(res => setSesiones(res.data))
                    .finally(() => setLoading(false));
            }
        }, [userId]);

        const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
            setTabIndex(newValue);
        };

        const verDetalles = (sesion: SesionUsuarioDTO) => {
            setSelectedSessionId(sesion.id);
            if (userId) {
                getResultadosActividadPorSesionYUsuario(sesion.sesionId, userId)
                    .then(res => setResultados(res.data))
                    .catch(err => console.error('Error al obtener resultados', err));
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
            <Box p={isMobile ? 1 : 3}>
                <Paper elevation={3} sx={{ padding: 2, mb: 3 }}>
                    <Tabs
                        value={tabIndex}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        textColor="primary"
                        indicatorColor="primary"
                    >
                        <Tab label="📌 General" />
                        <Tab label="📋 Sesiones" />
                        <Tab label="📈 Evolución" />
                        <Tab label="📊 Promedios" />
                        <Tab label="⏱ Tiempo" />
                        <Tab label="📤 Exportar" />
                    </Tabs>
                </Paper>

                {tabIndex === 0 && (
                    <>
                        <Typography variant="h5" mb={2}>Tus Sesiones</Typography>
                        <Box
                            display="grid"
                            gridTemplateColumns={isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))'}
                            gap={2}
                        >
                            {sesiones
                                .filter(s => s.status === 'COMPLETADA')
                                .map(s => (
                                    <Paper key={s.id} sx={{ p: 2, position: 'relative', cursor: 'pointer' }} onClick={() => verDetalles(s)}>
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 10,
                                                right: 10,
                                                width: 50,
                                                height: 50,
                                                borderRadius: '50%',
                                                border: `3px solid ${getColorByScore(s.result)}`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 'bold',
                                                background: '#fff',
                                            }}
                                        >
                                            {Math.round(s.result)}
                                        </Box>
                                        <Typography variant="subtitle1">📅 {s.date}</Typography>
                                        <Typography variant="body2">⏱ {s.sessionDurationSeconds ?? 0} s</Typography>
                                        <Typography variant="body2">🎮 Modo: {s.mode}</Typography>
                                    </Paper>
                                ))}
                        </Box>

                        {selectedSessionId && (
                            <Box mt={3}>
                                <Typography variant="h6">Resultados de actividades</Typography>
                                <ActivityResultTable results={resultados} />
                                <Box mt={1}>
                                    <button onClick={cerrarDetalles}>← Volver</button>
                                </Box>
                            </Box>
                        )}
                    </>
                )}

                {tabIndex === 1 && <ResumenDashboard sesiones={sesiones} userId={userId} />}
                {tabIndex === 2 && <GraphEvolucion sesiones={sesiones} />}
                {tabIndex === 3 && <PromedioPorTipo />}
                {tabIndex === 4 && <TiempoPromedioPorTipo />}
                {tabIndex === 5 && <ResumenComparativo sesiones={sesiones} />}
            </Box>
        );
    };

    export default Estadisticas;
