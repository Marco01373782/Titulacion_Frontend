import { useEffect, useState } from 'react';
import LoadingOverlay from '../../../../components/modal/Loading/LoadingOverlay';

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
    CircularProgress,
    InputLabel,
    FormControl,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { fetchAllUsers, deleteUserById } from '../../../../services/ApiService';

interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    roles: string;
    parentesco: string;
    createdAt: string;
}

const UsersList = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [selectedRole, setSelectedRole] = useState('all');
    const [loading, setLoading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        applyFilter();
    }, [selectedRole, users]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetchAllUsers();
            setUsers(res.data);
        } catch (err) {
            console.error('Error al obtener usuarios', err);
        } finally {
            setLoading(false);
        }
    };

    const applyFilter = () => {
        if (selectedRole === 'all') {
            setFilteredUsers(users);
        } else {
            setFilteredUsers(users.filter((u) => u.roles === selectedRole));
        }
    };

    const handleDelete = async () => {
    if (!userToDelete) return;
    setActionLoading(true); // ← Mostrar overlay
    try {
        await deleteUserById(userToDelete.id);
        setUsers(users.filter(u => u.id !== userToDelete.id));
    } catch (err) {
        console.error('Error al eliminar usuario', err);
    } finally {
        setDeleteDialogOpen(false);
        setUserToDelete(null);
        setActionLoading(false); // ← Ocultar overlay
    }
};


    return (
        <Box sx={{ padding: '2rem', minHeight: '100vh', backgroundColor: '#F4F5FA' }}>
            <Typography variant="h4" gutterBottom align="center">
                Lista de Usuarios
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 2,
                    marginBottom: '1.5rem',
                    flexWrap: 'wrap',
                }}
            >
                <FormControl size="small">
                    <InputLabel>Filtrar por rol</InputLabel>
                    <Select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        label="Filtrar por rol"
                    >
                        <MenuItem value="all">Todos</MenuItem>
                        <MenuItem value="user">Usuario</MenuItem>
                        <MenuItem value="admin">Administrador</MenuItem>
                    </Select>
                </FormControl>
                <Button variant="contained" color="primary" onClick={() => navigate('/admin/crear-usuarios')}>
                    Crear nuevo usuario
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead sx={{ backgroundColor: '#6C63FF' }}>
                            <TableRow>
                                <TableCell sx={{ color: 'white' }}>ID</TableCell>
                                <TableCell sx={{ color: 'white' }}>Email</TableCell>
                                <TableCell sx={{ color: 'white' }}>Nombre</TableCell>
                                <TableCell sx={{ color: 'white' }}>Apellido</TableCell>
                                <TableCell sx={{ color: 'white' }}>Rol</TableCell>
                                <TableCell sx={{ color: 'white' }}>Parentesco</TableCell>
                                <TableCell sx={{ color: 'white' }}>Registrado</TableCell>
                                <TableCell sx={{ color: 'white' }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.id}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.firstName}</TableCell>
                                        <TableCell>{user.lastName}</TableCell>
                                        <TableCell>{user.roles}</TableCell>
                                        <TableCell>{user.parentesco || '-'}</TableCell>
                                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                color="error"
                                                onClick={() => {
                                                    setUserToDelete(user);
                                                    setDeleteDialogOpen(true);
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        No hay usuarios para mostrar
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>¿Estás seguro?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Deseas eliminar al usuario "{userToDelete?.email}"? Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleDelete} color="error">Eliminar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UsersList;
