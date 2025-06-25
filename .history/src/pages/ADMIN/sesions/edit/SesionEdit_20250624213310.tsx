import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    fetchSessionById,
    fetchActivitiesBySession,
    updateSessionBasic
} from '../../../../services/ApiService';
import LoadingOverlay from '../../../../components/modal/Loading/LoadingOverlay';
import Toast from '../../../../components/toast/Toast';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    List,
    ListItem
} from '@mui/material';

const SesionEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dificultadNombre, setDificultadNombre] = useState('Sin dificultad');
    const [actividades, setActividades] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);


    useEffect(() => {
        const fetchSesion = async () => {
            setLoading(true);
            try {
                const resSesion = await fetchSessionById(Number(id));
                const sesion = resSesion.data;
                setTitle(sesion.title);
                setDescription(sesion.description);
                setDificultadNombre(sesion.SESIONdifficulty?.name || 'Sin dificultad');
                const resActividades = await fetchActivitiesBySession(Number(id));
                setActividades(resActividades.map((sa: any) => sa.activity));
            } catch (error) {
                setToast({ message: 'No se pudo cargar la sesión.', type: 'error' });
            } finally {
                setLoading(false);
            }
        };
        fetchSesion();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            setToast({ message: 'El título es obligatorio.', type: 'error' });
            return;
        }
        setSaving(true);
        try {
            await updateSessionBasic(Number(id), { title, description });
            setToast({ message: 'Sesión actualizada correctamente', type: 'success' });
            setTimeout(() => navigate('/admin/gestionar-sesiones'), 1500);
        } catch (error) {
            setToast({ message: 'No se pudo actualizar la sesión.', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box p={2} maxWidth={600} mx="auto">
            <Typography variant="h4" gutterBottom>Editar Sesión</Typography>
            <LoadingOverlay visible={loading || saving} message={saving ? 'Actualizando...' : 'Cargando...'} />
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Título"
                    fullWidth
                    margin="normal"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={loading || saving}
                />
                <TextField
                    label="Descripción"
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={loading || saving}
                />
                <Typography variant="subtitle1" gutterBottom><strong>Dificultad:</strong> {dificultadNombre}</Typography>
                <Typography variant="h6">Actividades asignadas:</Typography>
                <Paper variant="outlined" sx={{ padding: 1, mb: 2 }}>
                    {actividades.length > 0 ? (
                        <List>
                            {actividades.map((act) => (
                                <ListItem key={act.id}>• {act.title || act.nombre}</ListItem>
                            ))}
                        </List>
                    ) : <Typography variant="body2">No hay actividades.</Typography>}
                </Paper>
                <Button type="submit" variant="contained" color="primary" fullWidth disabled={saving}>Guardar Cambios</Button>
            </form>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </Box>
    );
};

export default SesionEdit;