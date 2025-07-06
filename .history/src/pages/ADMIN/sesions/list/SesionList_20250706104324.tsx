import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
} from '@mui/material';

import { useNavigate } from 'react-router-dom';
import {
    fetchAllSessions,
    fetchDifficulties,
    deleteSession,
    fetchActivitiesBySession,
} from '../../../../services/ApiService';
import Toast from '../../../../components/toast/Toast';
import LoadingOverlay from '../../../../components/modal/Loading/LoadingOverlay';

interface Session {
    id: number;
    title: string;
    description: string;
    difficulty: string;
}

const SessionList = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
    const [difficulties, setDifficulties] = useState<string[]>([]);
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [activitiesModal, setActivitiesModal] = useState<{ sessionId: number; activities: string[] } | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [deleting, setDeleting] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [sessions, selectedDifficulty]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const sesRes = await fetchAllSessions();
            setSessions(sesRes.data);
            const diffRes = await fetchDifficulties();
            setDifficulties(diffRes.data);
        } catch (err) {
            console.error('Error al cargar sesiones o dificultades', err);
            setToast({ message: 'Error al cargar datos', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        const filtered =
            selectedDifficulty === 'all'
                ? sessions
                : sessions.filter((s) => s.difficulty === selectedDifficulty);
        setFilteredSessions(filtered);
    };

    const handleCreate = () => navigate('/admin/crear-sesiones');
    const handleEdit = (id: number) => navigate(`/admin/editar-sesiones/${id}`);

    const confirmDelete = async () => {
        if (deleteId === null) return;
        setDeleting(true);
        try {
            await deleteSession(deleteId);
            setToast({ message: 'Sesión eliminada correctamente', type: 'success' });
            setDeleteId(null);
            fetchData();
        } catch (error) {
            console.error('Error al eliminar la sesión:', error);
            setToast({ message: 'No se pudo eliminar la sesión.', type: 'error' });
            setDeleteId(null);
        } finally {
            setDeleting(false);
        }
    };

    const handleViewActivities = async (sessionId: number) => {
        try {
            const res = await fetchActivitiesBySession(sessionId);
            const activityTitles = res.map((a: any) =>
                a.activity?.title || a.activity?.name || `Actividad ${a.activity?.id ?? a.id}`
            );
            setActivitiesModal({ sessionId, activities: activityTitles });
        } catch (err) {
            console.error('Error al obtener actividades:', err);
            setToast({ message: 'Error al obtener actividades', type: 'error' });
        }
    };

    return (
        <Box style={{ padding: '2rem', minHeight: '100vh', backgroundColor: '#f4f5fa' }}>
            <Typography variant="h4" align="center" gutterBottom>
                Lista de Sesiones
            </Typography>

            <LoadingOverlay visible={loading} message="Cargando sesiones..." />
            <LoadingOverlay visible={deleting} message="Eliminando sesión..." />

            {!loading && !deleting && toast && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}

            {/* Barra de acciones */}
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
                <Button variant="contained" color="primary" onClick={handleCreate}>
                    Crear Nueva Sesión
                </Button>

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
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        size="small"
                    >
                        <MenuItem value="all">Todas</MenuItem>
                        {difficulties.map((d) => (
                            <MenuItem key={d} value={d}>
                                {d.replace(/_/g, ' ')}
                            </MenuItem>
                        ))}
                    </Select>
                )}

            </Box>

            {/* Tabla */}
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead style={{ backgroundColor: '#6C63FF' }}>
                        <TableRow>
                            <TableCell style={{ color: 'white' }}>ID</TableCell>
                            <TableCell style={{ color: 'white' }}>Título</TableCell>
                            <TableCell style={{ color: 'white' }}>Descripción</TableCell>
                            <TableCell style={{ color: 'white' }}>Dificultad</TableCell>
                            <TableCell style={{ color: 'white' }}>Actividades</TableCell>
                            <TableCell style={{ color: 'white' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredSessions.length > 0 ? (
                            filteredSessions.map((session) => (
                                <TableRow key={session.id}>
                                    <TableCell>{session.id}</TableCell>
                                    <TableCell>{session.title}</TableCell>
                                    <TableCell>{session.description}</TableCell>
                                    <TableCell>{session.difficulty?.replace(/_/g, ' ')}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleViewActivities(session.id)}
                                        >
                                            Ver
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            color="success"
                                            onClick={() => handleEdit(session.id)}
                                            style={{ marginRight: '0.5rem' }}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            color="error"
                                            onClick={() => setDeleteId(session.id)}
                                        >
                                            Eliminar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No hay sesiones para mostrar.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal de confirmación */}
            <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
                <DialogTitle>¿Eliminar sesión?</DialogTitle>
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

            {/* Modal de actividades */}
            <Dialog
                open={Boolean(activitiesModal)}
                onClose={() => setActivitiesModal(null)}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>Actividades de la sesión #{activitiesModal?.sessionId}</DialogTitle>
                <DialogContent>
                    {activitiesModal?.activities.length ? (
                        <List>
                            {activitiesModal.activities.map((a, i) => (
                                <ListItem key={i}>• {a}</ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body2">No hay actividades asignadas.</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setActivitiesModal(null)} variant="contained" color="primary">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SessionList;
