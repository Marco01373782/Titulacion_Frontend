import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Button,
    Stack,
    useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Activity } from '../../../../Types/ActivityTypes';
import {
    createSession,
    fetchDifficulties,
    assignActivitiesAuto,
    fetchAllActivities,
} from '../../../../services/ApiService';
import LoadingOverlay from '../../../../components/modal/Loading/LoadingOverlay';
import Toast from '../../../../components/toast/Toast';

type GroupedActivities = Record<string, Activity[]>;

const SesionCreate: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [difficulties, setDifficulties] = useState<string[]>([]);
    const [sesionId, setSesionId] = useState<number | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [/*groupedActivities,*/ setGroupedActivities] = useState<GroupedActivities>({});
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        fetchDifficulties()
            .then((res) => setDifficulties(res.data))
            .catch(() => setToast({ message: 'Error al cargar dificultades', type: 'error' }));
    }, []);

    useEffect(() => {
        if (sesionId) {
            fetchAllActivities()
                .then((res) => setActivities(res.data))
                .catch(() => setToast({ message: 'Error al cargar actividades', type: 'error' }));
        }
    }, [sesionId]);

    useEffect(() => {
        if (!difficulty) return setGroupedActivities({});

        const filtered = activities.filter(
            (a) => a.difficulty === difficulty && typeof a.type === 'string' && a.type.trim() !== ''
        );

        const grouped = filtered.reduce((groups: GroupedActivities, activity) => {
            const typeName = activity.type || 'Tipo desconocido';
            if (!groups[typeName]) groups[typeName] = [];
            groups[typeName].push(activity);
            return groups;
        }, {});

        setGroupedActivities(grouped);
    }, [activities, difficulty]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!difficulty) return setToast({ message: 'Selecciona una dificultad', type: 'error' });

        setLoading(true);
        setLoadingMessage('Creando sesión...');
        try {
            const res = await createSession({ title, description, difficulty });
            setSesionId(res.data.id);
            setToast({ message: 'Sesión creada exitosamente', type: 'success' });
        } catch {
            setToast({ message: 'Error al crear la sesión', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleAsignarAuto = async () => {
        if (!sesionId) return;
        setLoading(true);
        setLoadingMessage('Asignando actividades...');
        try {
            await assignActivitiesAuto(sesionId);
            setToast({ message: 'Actividades asignadas automáticamente', type: 'success' });
            navigate('/admin/gestionar-sesiones');
        } catch {
            setToast({ message: 'Error al asignar actividades', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/gestionar-sesiones');
    };

    return (
        <Box p={isMobile ? 2 : 4} width="100%" maxWidth={800} mx="auto">
            <Typography variant="h4" mb={3} fontWeight="bold">Crear nueva sesión</Typography>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    <TextField
                        label="Título"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={!!sesionId || loading}
                        required
                    />
                    <TextField
                        label="Descripción"
                        multiline
                        rows={4}
                        fullWidth
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={!!sesionId || loading}
                        required
                    />

                    <FormControl fullWidth disabled={!!sesionId || loading}>
                        <InputLabel>Dificultad</InputLabel>
                        <Select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            label="Dificultad"
                            required
                        >
                            {difficulties.map((name) => (
                                <MenuItem key={name} value={name}>{name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {!sesionId && (
                        <Stack direction="row" spacing={2}>
                            <Button variant="contained" type="submit" disabled={loading}>
                                Crear sesión
                            </Button>
                            <Button variant="outlined" onClick={handleCancel} disabled={loading}>
                                Cancelar
                            </Button>
                        </Stack>
                    )}
                </Stack>
            </form>

            {sesionId && (
                <Box mt={4}>
                    <Typography variant="h6" mb={2}>Asignar actividades para la sesión</Typography>
                    <Stack spacing={2} direction={isMobile ? 'column' : 'row'}>
                        <Button variant="contained" onClick={handleAsignarAuto} disabled={loading}>
                            Asignar actividades
                        </Button>
                    </Stack>
                </Box>
            )}

            <LoadingOverlay visible={loading} message={loadingMessage} />
        </Box>
    );
};

export default SesionCreate;
