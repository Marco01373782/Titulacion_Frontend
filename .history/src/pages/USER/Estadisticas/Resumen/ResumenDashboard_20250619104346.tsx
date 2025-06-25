import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, useTheme, useMediaQuery } from '@mui/material';

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

interface Props {
    sesiones: SesionUsuarioDTO[];
    userId: string | null;
}

const ResumenDashboard: React.FC<Props> = ({ sesiones }) => {
    const [totalSesiones, setTotalSesiones] = useState(0);
    const [promedioGeneral, setPromedioGeneral] = useState(0);
    const [tiempoTotal, setTiempoTotal] = useState(0);
    const [mejorResultado, setMejorResultado] = useState(0);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const completadas = sesiones.filter(s => s.status === 'COMPLETADA');
        setTotalSesiones(completadas.length);

        const promedio = completadas.length > 0
            ? completadas.reduce((acc, s) => acc + s.result, 0) / completadas.length
            : 0;
        setPromedioGeneral(Math.round(promedio));

        const totalTiempo = completadas.reduce((acc, s) => acc + (s.sessionDurationSeconds ?? 0), 0);
        setTiempoTotal(totalTiempo);

        const mejor = completadas.reduce((max, s) => Math.max(max, s.result), 0);
        setMejorResultado(mejor);
    }, [sesiones]);

    const kpis = [
        { label: '✅ Total Sesiones', value: totalSesiones },
        { label: '📈 Promedio General', value: promedioGeneral },
        { label: '⏳ Tiempo Total', value: `${tiempoTotal} s` },
        { label: '🏅 Mejor Resultado', value: mejorResultado },
    ];

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: '1200px',
                margin: '0 auto',
                px: 2,
                py: 4,
                userSelect: 'none',
            }}
        >
            <Typography
                variant={isMobile ? 'h5' : 'h4'}
                component="h2"
                sx={{
                    fontWeight: 700,
                    mb: 4,
                    color: theme.palette.text.primary,
                    textAlign: 'center',
                    letterSpacing: 0.5,
                }}
            >
                📊 Panorama General
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: 3,
                }}
            >
                {kpis.map(({ label, value }) => (
                    <Paper
                        key={label}
                        elevation={1}
                        sx={{
                            flex: '1 1 160px',
                            maxWidth: 220,
                            p: 2,
                            textAlign: 'center',
                            borderRadius: 2,
                            bgcolor: '#ffffff',
                            minWidth: 160,
                        }}
                    >
                        <Typography
                            variant="subtitle2"
                            sx={{ color: theme.palette.text.secondary, fontWeight: 600, mb: 1 }}
                        >
                            {label}
                        </Typography>
                        <Typography
                            variant="h4"
                            sx={{
                                color: theme.palette.primary.main,
                                fontWeight: 700,
                                lineHeight: 1,
                            }}
                        >
                            {value}
                        </Typography>
                    </Paper>
                ))}
            </Box>
        </Box>
    );
};

export default ResumenDashboard;
