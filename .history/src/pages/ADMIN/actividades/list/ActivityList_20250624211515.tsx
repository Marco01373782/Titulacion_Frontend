// src/pages/Admin/Activities/ActivityList.tsx
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
  Paper,
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
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
        p: isMobile ? 2 : 4,
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      <Typography variant="h2" gutterBottom textAlign="center">
        Lista de Actividades
      </Typography>

      <Grid container spacing={2} justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} sm="auto">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/admin/crear-actividad')}
          >
            Crear Nueva Actividad
          </Button>
        </Grid>
        <Grid item xs={12} sm="auto">
          <Grid container spacing={2}>
            <Grid item>
              <Select
                size="small"
                value={selectedDifficulty}
                onChange={(e: SelectChangeEvent) => setSelectedDifficulty(e.target.value)}
                displayEmpty
              >
                <MenuItem value="all">Todas las Dificultades</MenuItem>
                {difficulties.map(diff => (
                  <MenuItem key={diff} value={diff}>
                    {diff.charAt(0).toUpperCase() + diff.slice(1).toLowerCase()}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item>
              <Select
                size="small"
                value={selectedType}
                onChange={(e: SelectChangeEvent) => setSelectedType(e.target.value)}
                displayEmpty
              >
                <MenuItem value="all">Todos los Tipos</MenuItem>
                {types.map(type => (
                  <MenuItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small" sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white' }}>ID</TableCell>
                <TableCell sx={{ color: 'white' }}>Título</TableCell>
                {!isMobile && <TableCell sx={{ color: 'white' }}>Descripción</TableCell>}
                <TableCell sx={{ color: 'white' }}>Tipo</TableCell>
                <TableCell sx={{ color: 'white' }}>Dificultad</TableCell>
                {!isMobile && <TableCell sx={{ color: 'white' }}>Recurso</TableCell>}
                <TableCell sx={{ color: 'white' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredActivities.length > 0 ? (
                filteredActivities.map(activity => (
                  <TableRow key={activity.id}>
                    <TableCell>{activity.id}</TableCell>
                    <TableCell>{activity.title}</TableCell>
                    {!isMobile && <TableCell>{activity.description}</TableCell>}
                    <TableCell>{activity.type}</TableCell>
                    <TableCell>{activity.difficulty}</TableCell>
                    {!isMobile && (
                      <TableCell>
                        <a href={activity.resourceUrl} target="_blank" rel="noopener noreferrer">
                          Ver recurso
                        </a>
                      </TableCell>
                    )}
                    <TableCell>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => navigate(`/admin/editar-actividad/${activity.id}`)}
                        sx={{ mr: 1 }}
                      >
                        Editar
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => setDeleteId(activity.id)}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Typography textAlign="center" color="text.secondary">
                      No hay actividades para mostrar.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
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
