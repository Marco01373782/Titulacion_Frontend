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
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

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
    <Box style={{ padding: '2rem', minHeight: '100vh', backgroundColor: '#f4f5fa' }}>
      <Typography variant="h4" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        Lista de Actividades
      </Typography>

      {/* Botones y filtros */}
      <Box
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
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

        <Box style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Box style={{ minWidth: 180, flex: '1 1 180px' }}>
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

          <Box style={{ minWidth: 180, flex: '1 1 180px' }}>
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


        {/* Loader */}
        {loading ? (
          <Box style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead style={{ backgroundColor: '#6C63FF' }}>
                <TableRow>
                  <TableCell style={{ color: 'white' }}>ID</TableCell>
                  <TableCell style={{ color: 'white' }}>Título</TableCell>
                  <TableCell style={{ color: 'white' }}>Descripción</TableCell>
                  <TableCell style={{ color: 'white' }}>Tipo</TableCell>
                  <TableCell style={{ color: 'white' }}>Dificultad</TableCell>
                  <TableCell style={{ color: 'white' }}>Recurso</TableCell>
                  <TableCell style={{ color: 'white' }}>Acciones</TableCell>
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
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Ver recurso
                        </a>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          color="success"
                          style={{ marginRight: '0.5rem' }}
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
                    <TableCell colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
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
              ¿Estás seguro de que deseas eliminar esta actividad? Esta acción no se puede
              deshacer.
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
