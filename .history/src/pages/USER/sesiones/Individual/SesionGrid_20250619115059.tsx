import { useEffect, useState } from 'react';
import { Box, Typography, Select, MenuItem, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import { fetchSessionsByUser, fetchActivitiesBySession, fetchDifficulties } from '../../../../services/ApiService';
import { useNavigate } from 'react-router-dom';

const MAX_SLOTS = 10;

const SessionGrid = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<any | null>(null);
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = Number(localStorage.getItem('userId'));
    if (!userId) return;

    fetchDifficulties()
      .then((response) => {
        const diff = response.data;
        setDifficulties(diff);
        if (diff.length > 0) setSelectedDifficulty(diff[0]);
      })
      .catch(e => console.error('Error al cargar dificultades:', e));

    fetchSessionsByUser(userId)
      .then(res => {
        const data = Array.isArray(res) ? res : [];
        setSessions(data);
      })
      .catch(e => {
        console.error('Error al obtener sesiones por usuario:', e);
        setSessions([]);
      });
  }, []);

  useEffect(() => {
    if (!selectedDifficulty) {
      setFilteredSessions(sessions);
      return;
    }
    const filtered = sessions.filter(s => s.sesion.difficulty === selectedDifficulty);
    setFilteredSessions(filtered);
    setSelectedSession(null);
  }, [selectedDifficulty, sessions]);

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

  const totalSlots = MAX_SLOTS;
  const slots = [...filteredSessions];
  while (slots.length < totalSlots) {
    slots.push(null);
  }

  return (
    <Box sx={{ width: '100%', height: '100%', p: 2, bgcolor: '#f4f5fa', boxSizing: 'border-box' }}>
      <Paper elevation={3} sx={{ height: '100%', p: 3, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 700 }}>
          🧠 Sesiones Diarias
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Select
            value={selectedDifficulty}
            onChange={e => setSelectedDifficulty(e.target.value)}
            sx={{
              minWidth: 200,
              bgcolor: '#fff',
              borderRadius: 2,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#6C63FF' },
            }}
          >
            {difficulties.map(diff => (
              <MenuItem key={diff} value={diff}>
                <Typography fontWeight={selectedDifficulty === diff ? 700 : 400} color={selectedDifficulty === diff ? '#6C63FF' : 'inherit'}>
                  {diff}
                </Typography>
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            {slots.map((session, idx) => {
              if (session === null) {
                return (
                  <Paper key={`locked-${idx}`} elevation={2}
                    sx={{
                      width: 60, height: 60, borderRadius: '50%',
                      bgcolor: '#ccc', display: 'flex', justifyContent: 'center',
                      alignItems: 'center', color: '#fff', fontWeight: 600, opacity: 0.5
                    }}>
                    {idx + 1}
                  </Paper>
                );
              } else {
                let bgColor = '#999';
                if (session.status === 'COMPLETADA') bgColor = '#4CAF50';
                if (session.status === 'ACTIVA') bgColor = '#6C63FF';

                return (
                  <Paper
                    key={session.id}
                    elevation={4}
                    onClick={() => handleSessionClick(session)}
                    sx={{
                      width: 60, height: 60, borderRadius: '50%',
                      bgcolor: bgColor, display: 'flex', justifyContent: 'center',
                      alignItems: 'center', color: '#fff', fontWeight: 700,
                      cursor: session.status === 'ACTIVA' ? 'pointer' : 'default',
                      transition: '0.3s',
                      '&:hover': {
                        transform: session.status === 'ACTIVA' ? 'scale(1.1)' : 'none'
                      }
                    }}>
                    {idx + 1}
                  </Paper>
                );
              }
            })}
          </Box>
        </Box>
      </Paper>

      {/* Modal con MUI Dialog */}
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
