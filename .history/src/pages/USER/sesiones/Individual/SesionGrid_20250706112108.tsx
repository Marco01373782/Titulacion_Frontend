import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Chip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { fetchSessionsByUser, fetchActivitiesBySession, fetchDifficulties } from '../../../../services/ApiService';
import { useNavigate } from 'react-router-dom';

const MAX_SLOTS = 10;

const difficultyDescriptions = {
  Test: "Este nivel es para conocer tu punto de partida.",
  Principiante: "Perfecto para empezar a entrenar tus habilidades.",
  Avanzado: "Desafíos complejos para llevar tu mente al máximo.",
};

const difficultyColors = {
  Test: '#42A5F5',
  Principiante: '#FFB74D',
  Avanzado: '#E57373',
};

const SessionGrid = () => {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [difficulties, setDifficulties] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  const handleSessionClick = (session) => {
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
    <Box sx={{ width: '100%', minHeight: '100vh', p: isMobile ? 1 : 3, bgcolor: '#f0f2f5' }}>
      <Paper elevation={4} sx={{ p: isMobile ? 2 : 4, borderRadius: 3 }}>
        <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight={700} textAlign="center" gutterBottom>
          🧠 Sesiones Diarias
        </Typography>

        {difficulties.length > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <Select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              size="small"
              sx={{ minWidth: 200, bgcolor: 'white', borderRadius: 2 }}
            >
              {difficulties.map(diff => (
                <MenuItem key={diff} value={diff}>{diff}</MenuItem>
              ))}
            </Select>
          </Box>
        )}

        <Typography variant="subtitle2" textAlign="center" color="text.secondary" gutterBottom>
          {difficultyDescriptions[selectedDifficulty] || ""}
        </Typography>

        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Chip
            label={`Dificultad: ${selectedDifficulty}`}
            sx={{ bgcolor: difficultyColors[selectedDifficulty] || '#aaa', color: '#fff', fontWeight: 600 }}
          />
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
          {slots.map((session, idx) => (
            <Paper
              key={session ? session.id : `slot-${idx}`}
              elevation={3}
              onClick={() => session && handleSessionClick(session)}
              sx={{
                width: isMobile ? 50 : 60,
                height: isMobile ? 50 : 60,
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: session
                  ? session.status === 'ACTIVA'
                    ? '#4CAF50'
                    : session.status === 'COMPLETADA'
                      ? '#6C63FF'
                      : '#999'
                  : '#ccc',
                color: 'white',
                fontWeight: 'bold',
                cursor: session?.status === 'ACTIVA' ? 'pointer' : 'default',
                transition: '0.3s',
                '&:hover': {
                  transform: session?.status === 'ACTIVA' ? 'scale(1.1)' : 'none'
                }
              }}
            >
              {idx + 1}
            </Paper>
          ))}
        </Box>
      </Paper>

      <Dialog open={!!selectedSession} onClose={() => setSelectedSession(null)} fullWidth>
        <DialogTitle>{selectedSession?.sesion?.title}</DialogTitle>
        <DialogContent>
          <Typography>{selectedSession?.sesion?.description}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="success"
            onClick={handleStart}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar'}
          </Button>
          <Button variant="outlined" onClick={() => setSelectedSession(null)}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SessionGrid;