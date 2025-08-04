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
import { fetchDifficulties, createSession, assignActivitiesAuto } from '../../../../services/ApiService';
import LoadingOverlay from '../../../../components/modal/Loading/LoadingOverlay';
import Toast from '../../../../components/toast/Toast';

const SesionCreate: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [difficulties, setDifficulties] = useState<string[]>([]);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!difficulty) return setToast({ message: 'Selecciona una dificultad', type: 'error' });

        setLoading(true);
        setLoadingMessage('Creando sesión...');

        try {
            const res = await createSession({ title, description, difficulty });
            const sessionId = res.data.id;

            setLoadingMessage('Asignando actividades automáticamente...');
            await assignActivitiesAuto(sessionId);

            setToast({ message: 'Sesión creada y actividades asignadas automáticamente', type: 'success' });
            navigate('/admin/gestionar-sesiones');
        } catch (error) {
            setToast({ message: 'Error al crear la sesión o asignar actividades', type: 'error' });
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
                    <TextField label="Título" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} required disabled={loading} />
                    <TextField label="Descripción" multiline rows={4} fullWidth value={description} onChange={(e) => setDescription(e.target.value)} required disabled={loading} />

                    <FormControl fullWidth disabled={loading}>
                        <InputLabel>Dificultad</InputLabel>
                        <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} label="Dificultad" required>
                            {difficulties.map((name) => (
                                <MenuItem key={name} value={name}>{name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" type="submit" disabled={loading}>Crear sesión</Button>
                        <Button variant="outlined" onClick={handleCancel} disabled={loading}>Cancelar</Button>
                    </Stack>
                </Stack>
            </form>

            <LoadingOverlay visible={loading} message={loadingMessage} />
        </Box>
    );
};

export default SesionCreate;
