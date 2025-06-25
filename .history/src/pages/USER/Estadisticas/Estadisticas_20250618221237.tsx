import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Tabs, Tab, Paper, Avatar, Button, CircularProgress, useTheme, useMediaQuery,
} from '@mui/material';
import SesionesList from './SesionesList'; // componente separado de sesiones
import {
  getSesionesUsuario,
} from '../../../services/ApiService';

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

const Estadisticas: React.FC = () => {
  const [sesiones, setSesiones] = useState<SesionUsuarioDTO[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const userId = localStorage.getItem('userId');
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Datos resumen
  const [totalSesiones, setTotalSesiones] = useState(0);
  const [promedioGeneral, setPromedioGeneral] = useState(0);
  const [tiempoTotal, setTiempoTotal] = useState(0);
  const [mejorResultado, setMejorResultado] = useState(0);

  useEffect(() => {
    if (userId) {
      getSesionesUsuario(userId).then(res => {
        setSesiones(res.data);
        setLoading(false);
      });
    }
  }, [userId]);

  useEffect(() => {
    // Actualizar KPIs cuando cambien sesiones
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const kpis = [
    { label: '✅ Total Sesiones', value: totalSesiones },
    { label: '📈 Promedio General', value: promedioGeneral },
    { label: '⏳ Tiempo Total', value: `${tiempoTotal} s` },
    { label: '🏅 Mejor Resultado', value: mejorResultado },
  ];

  return (
    <Box width="100%" height="100%" p={2} bgcolor="#f5f7fa">
      <Paper elevation={3} sx={{ padding: isMobile ? 2 : 4, marginBottom: 4 }}>
        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          component="h2"
          sx={{ fontWeight: 700, mb: 4, color: theme.palette.text.primary, textAlign: 'center' }}
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
      </Paper>

      <Paper elevation={3} sx={{ padding: 1, marginBottom: 2 }}>
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
        {activeTab === 0 && (
          // Aquí está el resumen, todo inline, sin componente aparte
          <></> // ya mostraste resumen arriba, o aquí si querés duplicar con otra UI, pero yo lo dejé arriba para que sea limpio
        )}
        {activeTab === 1 && <SesionesList sesiones={sesiones} userId={userId} />}
        {activeTab === 2 && <GraphEvolucion sesiones={sesiones} />}
        {activeTab === 3 && <PromedioPorTipo />}
        {activeTab === 4 && <TiempoPromedioPorTipo />}
        {activeTab === 5 && <ResumenComparativo sesiones={sesiones} />}
      </Box>
    </Box>
  );
};

export default Estadisticas;
