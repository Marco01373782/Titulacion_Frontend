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
            bgcolor: theme.palette.background.default,
            p: isMobile ? 2 : 4,
            maxWidth: '100%',
            height:'0',
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
                elevation={3}
                sx={{
                flex: '1 1 180px',
                maxWidth: 220,
                p: 3,
                textAlign: 'center',
                borderRadius: 3,
                bgcolor: theme.palette.background.paper,
                transition: 'transform 0.25s ease, boxShadow 0.25s ease',
                cursor: 'default',
                '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: theme.shadows[8],
                },
                userSelect: 'none',
                minWidth: 180,
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
            ))}
        </Box>
        </Box>
    );
    };

    export default ResumenDashboard;
