import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  fetchAllActivities,
  deleteActivity,
  fetchDifficulties,
  fetchActivityTypes,
} from '../../../../services/ApiService';

interface Activity {
  id: number;
  title: string;
  description: string;
  resourceUrl: string;
  type: string;
  difficulty: string;
}

const ActivityList = () => {
  const theme = useTheme(); // 👈 Tema actual (claro u oscuro)
  const navigate = useNavigate();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [activities, selectedDifficulty, selectedType]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const activitiesRes = await fetchAllActivities();
      const difficultiesRes = await fetchDifficulties();
      const typesRes = await fetchActivityTypes();

      setActivities(activitiesRes.data);
      setDifficulties(difficultiesRes.data);
      setTypes(typesRes.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...activities];

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(act => act.difficulty === selectedDifficulty);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(act => act.type === selectedType);
    }

    setFilteredActivities(filtered);
  };

  const confirmDelete = async () => {
    if (deleteId === null) return;
    setDeleting(true);
    setLoading(true);
    try {
      await deleteActivity(deleteId);
      setDeleteId(null);
      await fetchData();
    } catch (error) {
      console.error('Error al eliminar actividad:', error);
    } finally {
      setDeleting(false);
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        padding: '2rem',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <Typography variant="h4" sx={{ mb: '1.5rem', textAlign: 'center' }}>
        Lista de Actividades
      </Typography>

      {/* Botones y filtros */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: '1.5rem',
          gap: '1rem',
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/admin/crear-actividad')}
        >
          Crear Nueva Actividad
        </Button>

        <Box sx={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Box sx={{ minWidth: 180, flex: '1 1 180px' }}>
            {difficulties.length === 1 ? (
              <TextField
                value={difficulties[0]}
                size="small"
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
              />
            ) : (
              <Select
                value={selectedDifficulty}
                onChange={e => setSelectedDifficulty(e.target.value)}
                size="small"
                fullWidth
              >
                <MenuItem value="all">Todas las Dificultades</MenuItem>
                {difficulties.map(diff => (
                  <MenuItem key={diff} value={diff}>
                    {diff.replace(/_/g, ' ')}
                  </MenuItem>
                ))}
              </Select>
            )}
          </Box>

          <Box sx={{ minWidth: 180, flex: '1 1 180px' }}>
            <Select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              size="small"
              fullWidth
            >
              <MenuItem value="all">Todos los Tipos</MenuItem>
              {types.map(type => (
                <MenuItem key={type} value={type}>
                  {type.replace(/_/g, ' ')}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
      </Box>

      {/* Loader */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: '2rem' }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ bgcolor: theme.palette.background.paper }}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: theme.palette.primary.main }}>
              <TableRow>
                {['ID', 'Título', 'Descripción', 'Tipo', 'Dificultad', 'Recurso', 'Acciones'].map((head, i) => (
                  <TableCell key={i} sx={{ color: '#fff' }}>{head}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredActivities.length > 0 ? (
                filteredActivities.map(act => (
                  <TableRow key={act.id}>
                    <TableCell>{act.id}</TableCell>
                    <TableCell>{act.title}</TableCell>
                    <TableCell>{act.description}</TableCell>
                    <TableCell>{act.type}</TableCell>
                    <TableCell>{act.difficulty}</TableCell>
                    <TableCell>
                      <a 
                      
                        href={act.resourceUrl}
                        
                        
                      >
                        Ver recurso
                      </a>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        color="success"
                        sx={{ mr: '0.5rem' }}
                        onClick={() => navigate(`/admin/editar-actividad/${act.id}`)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="error"
                        onClick={() => setDeleteId(act.id)}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                    No hay actividades para mostrar.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal de confirmación */}
      <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
        <DialogTitle>Eliminar Actividad</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar esta actividad? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ActivityList;
