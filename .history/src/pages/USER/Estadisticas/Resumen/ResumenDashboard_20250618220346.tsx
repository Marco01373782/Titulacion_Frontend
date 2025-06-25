    // src/pages/USER/Estadisticas/Resumen/ResumenDashboard.tsx
    import React, { useEffect, useState } from 'react';
    import { Box, Typography, Paper, useTheme, useMediaQuery, Grid } from '@mui/material';

    interface SesionUsuarioDTO {
    id: number;
    sesionId: number;
    userId: string;
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
            bgcolor: theme.palette.background.default,
            p: isMobile ? 2 : 4,
            maxWidth: 900,
            mx: 'auto',
            borderRadius: 3,
            boxShadow: theme.shadows[4],
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

        <Grid container spacing={3}>
            {kpis.map(({ label, value }) => (
            <Grid item xs={12} sm={6} md={3} key={label}>
                <Paper
                elevation={3}
                sx={{
                    p: 3,
                    textAlign: 'center',
                    borderRadius: 3,
                    bgcolor: theme.palette.background.paper,
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                    cursor: 'default',
                    '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: theme.shadows[8],
                    },
                    userSelect: 'none',
                }}
                >
                <Typography
                    variant="subtitle1"
                    sx={{ color: theme.palette.text.secondary, fontWeight: 600, mb: 1 }}
                >
                    {label}
                </Typography>
                <Typography
                    variant="h3"
                    sx={{ color: theme.palette.primary.main, fontWeight: 700, lineHeight: 1 }}
                >
                    {value}
                </Typography>
                </Paper>
            </Grid>
            ))}
        </Grid>
        </Box>
    );
    };

    export default ResumenDashboard;
