import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDifficulties, fetchActivityTypes } from '../../../../services/ApiService';
import ApiService from '../../../../services/ApiService';
import Toast from '../../../../components/toast/Toast';
import LoadingOverlay from '../../../../components/modal/Loading/LoadingOverlay';
import availableActivityResources from '../../../../data/availableActivityResources';
import {
  Box,
  Button,
  Typography,
  TextField,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormControlLabel,
} from '@mui/material';

const CreateActivity = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [manualUrl, setManualUrl] = useState('');
  const [useManualUrl, setUseManualUrl] = useState(false);
  const [difficulty, setDifficulty] = useState('');
  const [activityType, setActivityType] = useState('');
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const diffRes = await fetchDifficulties();
        setDifficulties(diffRes.data);
        const typesRes = await fetchActivityTypes();
        setTypes(typesRes.data);
      } catch {
        setToast({ message: 'Error cargando datos', type: 'error' });
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalUrl = useManualUrl ? manualUrl : resourceUrl;

    if (!title || !description || !finalUrl || !difficulty || !activityType) {
      setToast({ message: 'Completa todos los campos', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      await ApiService.post('/activities', {
        title,
        description,
        resourceUrl: finalUrl,
        difficulty,
        type: activityType,
      });

      setToast({ message: 'Actividad creada con éxito', type: 'success' });
      setTimeout(() => navigate('/admin/gestionar-actividades'), 1500);
    } catch {
      setToast({ message: 'Error al crear la actividad', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/gestionar-actividades');
  };

  return (
    <Box p={3} width="100%" maxWidth={600} mx="auto">
      <Typography variant="h5" mb={2}>Crear Nueva Actividad</Typography>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <LoadingOverlay visible={loading} message="Creando actividad..." />

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Título"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          margin="normal"
        />

        <TextField
          fullWidth
          label="Descripción"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          multiline
          rows={4}
          margin="normal"
        />

        <FormControlLabel
          control={<Checkbox checked={useManualUrl} onChange={e => setUseManualUrl(e.target.checked)} />}
          label="¿Usar URL externa?"
        />

        {useManualUrl ? (
          <TextField
            fullWidth
            label="URL externa"
            placeholder="http://actividad.com/ejemplo"
            value={manualUrl}
            onChange={e => setManualUrl(e.target.value)}
            required
            margin="normal"
          />
        ) : (
          <FormControl fullWidth margin="normal">
            <InputLabel>Selecciona recurso</InputLabel>
            <Select
              value={resourceUrl}
              onChange={e => setResourceUrl(e.target.value)}
              required
              label="Selecciona recurso"
            >
              {availableActivityResources.map(res => (
                <MenuItem key={res.value} value={res.value}>{res.label}</MenuItem>
              ))}
            </Select>
            {resourceUrl && (
              <Button
                onClick={() => window.open(resourceUrl, '_blank')}
                sx={{ mt: 1 }}
                size="small"
              >🔍 Vista previa</Button>
            )}
          </FormControl>
        )}

        <FormControl fullWidth margin="normal">
          <InputLabel>Dificultad</InputLabel>
          <Select
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
            required
            label="Dificultad"
          >
            {difficulties.map(diff => (
              <MenuItem key={diff} value={diff}>{diff}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Tipo de actividad</InputLabel>
          <Select
            value={activityType}
            onChange={e => setActivityType(e.target.value)}
            required
            label="Tipo de actividad"
          >
            {types.map(type => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box display="flex" justifyContent="space-between" gap={2} mt={3}>
          <Button
            variant="outlined"
            onClick={handleCancel}
            disabled={loading}
            fullWidth
          >Cancelar</Button>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            fullWidth
          >Crear Actividad</Button>
        </Box>
      </form>
    </Box>
  );
};

export default CreateActivity;
