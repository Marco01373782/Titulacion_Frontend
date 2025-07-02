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
  Stack,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { fetchSessionsByUser, fetchActivitiesBySession, fetchDifficulties } from '../../../../services/ApiService';
import { useNavigate } from 'react-router-dom';

const MAX_SLOTS = 10;

const difficultyDescriptions: Record<string, string> = {
  Test: '🧪 Nivel Test: Descubre tu punto de partida y prepárate para entrenar.',
  Principiante: '🌱 Principiante: Ideal para comenzar a desarrollar tus habilidades cognitivas.',
  Avanzado: '🚀 Avanzado: Reta tu mente con ejercicios complejos y desafiantes.',
};

const difficultyColors: Record<string, string> = {
  Test: '#42A5F5',
  Principiante: '#FFB74D',
  Avanzado: '#E57373',
};

const SessionGrid = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<any | null>(null);
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Carga dificultades y sesiones al inicio
  useEffect(() => {
    const userId = Number(localStorage.getItem('userId'));
    if (!userId) return;

    fetchDifficulties()
      .then((response) => {
        const diff = response.data;
        setDifficulties(diff);
        if (diff.length > 0) setSelectedDifficulty(diff[0]);
      })
      .catch((e) => console.error('Error al cargar dificultades:', e));

    fetchSessionsByUser(userId)
      .then((res) => {
        const data = Array.isArray(res) ? res : [];
        setSessions(data);
      })
      .catch((e) => {
        console.error('Error al obtener sesiones por usuario:', e);
        setSessions([]);
      });
  }, []);

  // Filtra sesiones según dificultad seleccionada
  useEffect(() => {
    if (!selectedDifficulty) {
      setFilteredSessions(sessions);
      return;
    }
    const filtered = sessions.filter((s) => s.sesion.difficulty === selectedDifficulty);
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

  // Completa slots con null para mantener el grid fijo
  const totalSlots = MAX_SLOTS;
  const slots = [...filteredSessions];
  while (slots.length < totalSlots) {
    slots.push(null);
  }

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        p: isMobile ? 1 : 3,
        bgcolor: '#f0f2f5',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: isMobile ? 2 : 4,
          borderRadius: 3,
          boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold', color: '#3f51b5', userSelect: 'none' }}
        >
          🧠 Sesiones Diarias
        </Typography>

        {/* Selector de dificultad */}
        <Stack
          direction={isMobile ? 'column' : 'row'}
          justifyContent="center"
          alignItems="center"
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Escoge la dificultad:
          </Typography>

          <Select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            sx={{
              minWidth: 220,
              bgcolor: '#fff',
              borderRadius: 2,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#3f51b5' },
              boxShadow: '0 2px 6px rgb(63 81 181 / 0.25)',
              fontWeight: 700,
              color: '#3f51b5',
            }}
            size={isMobile ? 'small' : 'medium'}
          >
            {difficulties.map((diff) => (
              <MenuItem key={diff} value={diff}>
                <Typography
                  fontWeight={selectedDifficulty === diff ? 'bold' : 'normal'}
                  color={selectedDifficulty === diff ? '#3f51b5' : 'inherit'}
                >
                  {diff}
                </Typography>
              </MenuItem>
            ))}
          </Select>
        </Stack>

        {/* Descripción de la dificultad */}
        {selectedDifficulty && (
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              textAlign: 'center',
              fontStyle: 'italic',
              color: '#666',
              userSelect: 'none',
            }}
          >
            {difficultyDescriptions[selectedDifficulty] || 'Dificultad personalizada'}
          </Typography>
        )}

        {/* Chip con dificultad */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Chip
            label={`Dificultad seleccionada: ${selectedDifficulty}`}
            sx={{
              bgcolor: difficultyColors[selectedDifficulty] || '#999',
              color: '#fff',
              fontWeight: 600,
              px: 3,
              py: 1,
              fontSize: isMobile ? 12 : 14,
              boxShadow: '0 3px 8px rgb(0 0 0 / 0.15)',
              userSelect: 'none',
            }}
          />
        </Box>

        {/* Grid de sesiones */}
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {slots.map((session, idx) => {
            if (!session) {
              return (
                <Tooltip key={`locked-${idx}`} title="Sesión bloqueada">
                  <Paper
                    elevation={2}
                    sx={{
                      width: isMobile ? 50 : 60,
                      height: isMobile ? 50 : 60,
                      borderRadius: '50%',
                      bgcolor: '#bbb',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: '#eee',
                      fontWeight: 'bold',
                      opacity: 0.5,
                      userSelect: 'none',
                      cursor: 'not-allowed',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    {idx + 1}
                  </Paper>
                </Tooltip>
              );
            } else {
              let bgColor = '#777';
              let hoverScale = 1;

              if (session.status === 'ACTIVA') {
                bgColor = '#4caf50';
                hoverScale = 1.1;
              } else if (session.status === 'COMPLETADA') {
                bgColor = '#3f51b5';
              } else if (session.status === 'BLOQUEADA') {
                bgColor = '#ccc';
              }

              return (
                <Tooltip
                  key={session.id}
                  title={`Sesión ${session.sesion.title} — Estado: ${session.status}`}
                  placement="top"
                  arrow
                >
                  <Paper
                    onClick={() => handleSessionClick(session)}
                    elevation={session.status === 'ACTIVA' ? 8 : 2}
                    sx={{
                      width: isMobile ? 50 : 60,
                      height: isMobile ? 50 : 60,
                      borderRadius: '50%',
                      bgcolor: bgColor,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: '#fff',
                      fontWeight: 'bold',
                      cursor: session.status === 'ACTIVA' ? 'pointer' : 'default',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      userSelect: 'none',
                      '&:hover': {
                        transform: session.status === 'ACTIVA' ? `scale(${hoverScale})` : 'none',
                        boxShadow: session.status === 'ACTIVA' ? '0 0 12px rgba(76,175,80,0.7)' : 'none',
                      },
                    }}
                  >
                    {idx + 1}
                  </Paper>
                </Tooltip>
              );
            }
          })}
        </Box>
      </Paper>

      {/* Modal sesión */}
      <Dialog open={!!selectedSession} onClose={() => setSelectedSession(null)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>{selectedSession?.sesion?.title}</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>{selectedSession?.sesion?.description}</Typography>
          <Typography variant="caption" color="text.secondary">
            Dificultad: <strong>{selectedSession?.sesion?.difficulty}</strong>
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleStart}
            disabled={loading}
            size={isMobile ? 'small' : 'medium'}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Cargando...' : 'Iniciar'}
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setSelectedSession(null)}
            size={isMobile ? 'small' : 'medium'}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SessionGrid;
