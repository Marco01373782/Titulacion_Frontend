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
    CircularProgress,
    InputLabel,
    FormControl,
} from '@mui/material';
import { fetchAllUsers } from '../../../../services/ApiService';

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
                <Button variant="contained" color="primary" >
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
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        No hay usuarios para mostrar
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default UsersList;
