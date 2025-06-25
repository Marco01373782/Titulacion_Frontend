    // src/estadisticas/GraphEvolucion.tsx
    import React from 'react';
    import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    } from 'recharts';
    import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';

    interface SesionUsuarioDTO {
    id: number;
    sesionId: number;
    userId: number;
    status: string;
    date: string;
    result: number;
    }

    interface Props {
    sesiones: SesionUsuarioDTO[];
    }

    const GraphEvolucion: React.FC<Props> = ({ sesiones }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const data = sesiones
        .filter((s) => s.status === 'COMPLETADA')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((s) => ({
        fecha: new Date(s.date).toLocaleDateString(), // más legible
        resultado: Math.round(s.result),
        }));

    return (
        <Box
        sx={{
            bgcolor: theme.palette.background.paper,
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.shadows[3],
            p: isMobile ? 2 : 4,
            mt: 3,
            maxWidth: '100%',
            width: '100%',
            height: isMobile ? 280 : 320,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}
        >
        <Typography
            variant={isMobile ? 'h6' : 'h5'}
            component="h3"
            sx={{
            color: theme.palette.primary.main,
            fontWeight: 700,
            mb: 2,
            textAlign: 'center',
            userSelect: 'none',
            letterSpacing: 0.5,
            }}
        >
            Evolución de Puntajes
        </Typography>

        {data.length === 0 ? (
            <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mt: 6, userSelect: 'none' }}
            >
            No hay datos suficientes aún.
            </Typography>
        ) : (
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis
                dataKey="fecha"
                tick={{ fontSize: isMobile ? 10 : 12, fill: theme.palette.text.secondary }}
                tickLine={false}
                interval="preserveStartEnd"
                minTickGap={10}
                />
                <YAxis
                domain={[0, 100]}
                tick={{ fontSize: isMobile ? 10 : 12, fill: theme.palette.text.secondary }}
                tickLine={false}
                />
                <Tooltip
                contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: theme.shape.borderRadius,
                    boxShadow: theme.shadows[2],
                    border: `1px solid ${theme.palette.divider}`,
                }}
                labelStyle={{ fontWeight: 'bold' }}
                formatter={(value: any) => [`${value}`, 'Puntaje']}
                />
                <Line
                type="monotone"
                dataKey="resultado"
                stroke={theme.palette.primary.main}
                strokeWidth={3}
                dot={{ r: isMobile ? 3 : 5, strokeWidth: 2 }}
                activeDot={{ r: isMobile ? 5 : 7 }}
                />
            </LineChart>
            </ResponsiveContainer>
        )}
        </Box>
    );
    };

    export default GraphEvolucion;
