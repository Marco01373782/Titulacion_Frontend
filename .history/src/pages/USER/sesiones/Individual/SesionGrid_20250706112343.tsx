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
  Chip
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
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = Number(localStorage.getItem('userId'));
    if (!userId) return;

    fetchDifficulties()
      .then((response) => {
        const diff = response.data;
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
    <Box style={{ width: '100%', minHeight: '100vh', padding: '1rem', backgroundColor: '#f0f2f5', boxSizing: 'border-box' }}>
      <Paper elevation={3} style={{ padding: '1.5rem', borderRadius: '1rem' }}>
        <Typography variant="h4" style={{ fontWeight: 700, textAlign: 'center', marginBottom: '1rem' }}>
          🧠 Sesiones Diarias
        </Typography>

        <Typography variant="subtitle1" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          ¡Hoy es un gran día para entrenar tu mente! A continuación tienes tu camino de sesiones desbloqueado.
        </Typography>

        <Typography variant="body2" style={{ textAlign: 'center', fontStyle: 'italic', color: '#666', marginBottom: '0.5rem' }}>
          {difficultyDescriptions[selectedDifficulty] || "Dificultad personalizada"}
        </Typography>

        <Box style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <Chip
            label={`Dificultad: ${selectedDifficulty}`}
            style={{ backgroundColor: difficultyColors[selectedDifficulty] || '#aaa', color: '#fff', fontWeight: 600 }}
          />
        </Box>

        <Box style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
          {slots.map((session, idx) => (
            <Paper
              key={session ? session.id : `slot-${idx}`}
              elevation={3}
              onClick={() => session && handleSessionClick(session)}
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: session
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
