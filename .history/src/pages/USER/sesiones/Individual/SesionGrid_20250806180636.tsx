import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  fetchSessionsByUser,
  fetchActivitiesBySession,
} from '../../../../services/ApiService';
import { useNavigate } from 'react-router-dom';

const MAX_SLOTS = 10;

const SessionGrid = () => {
  const [slots, setSlots] = useState<(any | null)[]>([]);
  const [selectedSession, setSelectedSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = Number(localStorage.getItem('userId'));
    if (!userId) return;

    fetchSessionsByUser(userId)
      .then(res => {
        const sessions = Array.isArray(res) ? res : [];

        const completadas = sessions.filter((s: any) => s.status === 'COMPLETADA');
        const activas = sessions.filter((s: any) => s.status === 'ACTIVA');
        const otras = sessions.filter((s: any) => s.status !== 'ACTIVA' && s.status !== 'COMPLETADA');

        const ordenadas = [...completadas, ...activas, ...otras];

        // Rellenar con nulls si no hay suficientes sesiones
        while (ordenadas.length < MAX_SLOTS) {
          ordenadas.push(null);
        }

        setSlots(ordenadas.slice(0, MAX_SLOTS));
      })
      .catch(e => {
        console.error('Error al obtener sesiones por usuario:', e);
        setSlots(Array(MAX_SLOTS).fill(null));
      });
  }, []);

  const handleSessionClick = (session: any) => {
    if (session.status === 'ACTIVA') {
      setSelectedSession(session);
    }
  };

  const handleStart = async () => {
    if (!selectedSession) return;
    try {
      setLoading(true);
      const activities = await fetchActivitiesBySession(selectedSession.sesion.id);
      localStorage.setItem('selectedSesionUsuarioId', selectedSession.id.toString());
      localStorage.setItem('selectedSession', JSON.stringify(selectedSession));
      localStorage.setItem('selectedActivities', JSON.stringify(activities));
      navigate(`/user/terapias-sesiones/${selectedSession.id}`, {
        state: { session: selectedSession, activities },
      });
    } catch (error) {
      console.error('Error al obtener actividades:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%', p: 2, bgcolor: '#f4f5fa', boxSizing: 'border-box' }}>
      <Paper elevation={3} sx={{ height: '100%', p: 3, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4" sx={{ mb: 2, textAlign: 'center', fontWeight: 700 }}>
          🧠 Sesiones Disponibles
        </Typography>

        <Typography variant="subtitle1" sx={{ mb: 3, textAlign: 'center', color: '#555' }}>
          Cada Se es una oportunidad para fortalecer tu mente. ¡Haz clic en una sesión activa y comienza!
        </Typography>

        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            {slots.map((session, idx) => {
              if (session === null) {
                return (
                  <Paper key={`locked-${idx}`} elevation={2}
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      bgcolor: '#ccc',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: '#fff',
                      fontWeight: 600,
                      opacity: 0.4,
                    }}>
                    {idx + 1}
                  </Paper>
                );
              } else {
                let bgColor = '#999';
                if (session.status === 'ACTIVA') bgColor = '#4CAF50';
                if (session.status === 'COMPLETADA') bgColor = '#6C63FF';

                return (
                  <Paper
                    key={session.id}
                    elevation={4}
                    onClick={() => handleSessionClick(session)}
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      bgcolor: bgColor,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: '#fff',
                      fontWeight: 700,
                      cursor: session.status === 'ACTIVA' ? 'pointer' : 'default',
                      transition: '0.3s',
                      '&:hover': {
                        transform: session.status === 'ACTIVA' ? 'scale(1.1)' : 'none',
                      },
                    }}>
                    {idx + 1}
                  </Paper>
                );
              }
            })}
          </Box>
        </Box>
      </Paper>

      <Dialog open={!!selectedSession} onClose={() => setSelectedSession(null)}>
        <DialogTitle>{selectedSession?.sesion?.title}</DialogTitle>
        <DialogContent>
          <Typography>{selectedSession?.sesion?.description}</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="success" onClick={handleStart} disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar'}
          </Button>
          <Button variant="contained" color="error" onClick={() => setSelectedSession(null)}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SessionGrid;
