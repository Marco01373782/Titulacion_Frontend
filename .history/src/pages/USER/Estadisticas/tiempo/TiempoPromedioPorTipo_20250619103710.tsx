// src/pages/USER/Estadisticas/Tiempo/TempoPromedioPorTipo.tsx
import React, { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import {
    getSesionesUsuario,
    getResultadosActividadPorSesionYUsuario,
    fetchActivityTypes,
} from '../../../../services/ApiService';

import ACTIVITY_TYPE_LABELS from '../../../../data/ACTIVITY_TYPE_LABELS';

interface SessionActivityResult {
    activity: {
        id: number;
        type: string;
    };
    durationSeconds?: number;
}

const TiempoPromedioPorTipo: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [datos, setDatos] = useState<{ tipo: string; promedioTiempo: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return;

            try {
                const tiposRes = await fetchActivityTypes();
                const typeMap: Record<string, string> = {};
                tiposRes.data.forEach((t: string) => {
                    typeMap[t] = ACTIVITY_TYPE_LABELS[t] || t;
                });

                const sesionesRes = await getSesionesUsuario(userId);
                const completadas = sesionesRes.data.filter((s: any) => s.status === 'COMPLETADA');

                const resultados: SessionActivityResult[] = [];
                for (const sesion of completadas) {
                    const res = await getResultadosActividadPorSesionYUsuario(sesion.sesion.id, userId);
                    resultados.push(...res.data);
                }

                const agrupados: Record<string, number[]> = {};
                resultados.forEach((r) => {
                    if (!r.activity || r.durationSeconds === undefined) return;
                    const tipo = r.activity.type;
                    if (!agrupados[tipo]) agrupados[tipo] = [];
                    agrupados[tipo].push(r.durationSeconds);
                });

                const promedios = Object.entries(agrupados).map(([tipo, tiempos]) => ({
                    tipo: typeMap[tipo] || tipo,
                    promedioTiempo: Math.round(
                        tiempos.reduce((a, b) => a + b, 0) / tiempos.length
                    ),
                }));

                setDatos(promedios);
            } catch (err) {
                console.error('❌ Error al calcular tiempos promedio:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    return (
        <Box
            sx={{
                width: '100%',
                minHeight: '45vh',
                mx: 'auto',
                borderRadius: 1,
                bgcolor: theme.palette.background.paper,
                boxShadow: theme.shadows[3],
                p: isMobile ? 2 : 4,
                mt: 3,
                maxWidth: '100%',
                height: isMobile ? 300 : 340,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Typography
                variant={isMobile ? 'h6' : 'h5'}
                component="h3"
                sx={{
                    color: theme.palette.text.primary,
                    fontWeight: 700,
                    mb: isMobile ? 2 : 3,
                    textAlign: 'center',
                    userSelect: 'none',
                    letterSpacing: 0.5,
                }}
            >
                Tiempo promedio por tipo de actividad
            </Typography>

            {loading ? (
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mt: 6, userSelect: 'none' }}
                >
                    Cargando datos...
                </Typography>
            ) : datos.length === 0 ? (
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mt: 6, userSelect: 'none' }}
                >
                    No hay datos suficientes.
                </Typography>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={datos} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                        <XAxis
                            dataKey="tipo"
                            tick={{ fontSize: isMobile ? 10 : 12, fill: theme.palette.text.secondary }}
                            tickLine={false}
                            interval={0}
                            angle={isMobile ? -30 : 0}
                            textAnchor={isMobile ? 'end' : 'middle'}
                            height={isMobile ? 50 : 30}
                        />
                        <YAxis
                            label={{
                                value: 'Segundos',
                                angle: -90,
                                position: 'insideLeft',
                                fill: theme.palette.text.secondary,
                                fontSize: isMobile ? 12 : 14,
                            }}
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
                            formatter={(value: any) => [`${value}`, 'Segundos']}
                        />
                        <Bar
                            dataKey="promedioTiempo"
                            fill={theme.palette.warning.main} // naranja de tu theme
                            radius={[6, 6, 0, 0]}
                            barSize={isMobile ? 18 : 24}
                        />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </Box>
    );
};

export default TiempoPromedioPorTipo;
