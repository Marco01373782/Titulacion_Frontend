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
    import { Box, Typography, useTheme, useMediaQuery, Paper } from '@mui/material';

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
                fecha: new Date(s.date).toLocaleDateString(),
                resultado: Math.round(s.result),
            }));

        return (
            <Paper
                elevation={2}
                sx={{
                    width: '100%',
                    padding: isMobile ? 2 : 4,
                    borderRadius: 2,
                    boxShadow: theme.shadows[3],
                    minHeight: isMobile ? 320 : 450,
                    bgcolor: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Typography
                    variant={isMobile ? 'h6' : 'h5'}
                    fontWeight={700}
                    color="primary"
                    mb={3}
                    textAlign="center"
                >
                    Evolución de Puntajes
                </Typography>

                {data.length === 0 ? (
                    <Box flexGrow={1} display="flex" justifyContent="center" alignItems="center">
                        <Typography variant="body1" color="text.secondary">
                            No hay datos suficientes aún.
                        </Typography>
                    </Box>
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
            </Paper>
        );
    };

    export default GraphEvolucion;
