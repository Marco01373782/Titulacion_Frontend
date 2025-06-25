import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    fetchActivityById,
    updateActivity,
    fetchActivityTypes,
    fetchDifficulties
} from '../../../../services/ApiService';
import LoadingOverlay from '../../../../components/modal/Loading/LoadingOverlay';
import Toast from '../../../../components/toast/Toast';
import {
    Box,
    Typography,
    TextField,
    Select,
    MenuItem,
    Button,
    FormControl,
    InputLabel
} from '@mui/material';

const ActivityEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activity, setActivity] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [resourceUrl, setResourceUrl] = useState('');
    const [type, setType] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [types, setTypes] = useState<string[]>([]);
    const [difficulties, setDifficulties] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [activityRes, typesRes, diffsRes] = await Promise.all([
                    fetchActivityById(Number(id)),
                    fetchActivityTypes(),
                    fetchDifficulties()
                ]);
                const actData = activityRes.data;
                setActivity(actData);
                setTitle(actData.title);
                setDescription(actData.description);
                setResourceUrl(actData.resourceUrl);
                setType(actData.type);
                setDifficulty(actData.difficulty);
                setTypes(typesRes.data);
                setDifficulties(diffsRes.data);
            } catch (error) {
                setToast({ message: 'No se pudieron cargar los datos.', type: 'error' });
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    const handleSave = async () => {
        if (!title || !description || !type || !difficulty) {
            setToast({ message: 'Completa todos los campos.', type: 'error' });
            return;
        }
        setSaving(true);
        try {
            await updateActivity(Number(id), { title, description, resourceUrl, type, difficulty });
            setToast({ message: 'Actividad actualizada correctamente', type: 'success' });
            setTimeout(() => navigate('/admin/gestionar-actividades'), 1500);
        } catch (error) {
            setToast({ message: 'Error al actualizar.', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => navigate('/admin/gestionar-actividades');

    return (
        <Box p={2} maxWidth={600} mx="auto">
            <Typography variant="h4" gutterBottom>Editar Actividad</Typography>
            <LoadingOverlay visible={loading || saving} message={saving ? 'Actualizando...' : 'Cargando...'} />
            {activity && (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSave();
                    }}
                >
                    <TextField
                        label="Título"
                        fullWidth
                        margin="normal"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        label="Descripción"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <TextField
                        label="URL del recurso"
                        fullWidth
                        margin="normal"
                        value={resourceUrl}
                        onChange={(e) => setResourceUrl(e.target.value)}
                    />
                    <FormControl fullWidth margin="normal" disabled>
                        <InputLabel>Tipo de actividad</InputLabel>
                        <Select value={type} label="Tipo de actividad">
                            {types.map((t) => (
                                <MenuItem key={t} value={t}>{t.replace(/_/g, ' ')}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal" disabled>
                        <InputLabel>Dificultad</InputLabel>
                        <Select value={difficulty} label="Dificultad">
                            {difficulties.map((d) => (
                                <MenuItem key={d} value={d}>{d}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Box display="flex" justifyContent="space-between" mt={2}>
                        <Button variant="contained" color="primary" type="submit" disabled={saving}>Guardar</Button>
                        <Button variant="outlined" color="secondary" onClick={handleCancel} disabled={saving}>Cancelar</Button>
                    </Box>
                </form>
            )}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </Box>
    );
};

export default ActivityEdit;