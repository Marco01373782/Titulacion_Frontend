import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    IconButton,
    InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { registerUser } from '../../../../services/ApiService';

const parentescoOptions = [
    'PADRE',
    'MADRE',
    'HIJO',
    'HIJA',
    'NIETO',
    'NIETA',
    'SOBRINO',
    'SOBRINA',
    'TUTOR',
];

const CreateUserForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState('user');
    const [parentesco, setParentesco] = useState('');
    const [feedback, setFeedback] = useState<string | null>(null);
const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFeedback(null);

        if (!email || !password || !firstName || !lastName || !role) {
            setFeedback('Por favor, completa todos los campos obligatorios.');
            return;
        }

        const newUser = {
            email,
            password,
            firstName,
            lastName,
            roles: role,
            parentesco: parentesco || null,
        };

        try {
            await registerUser(newUser);
            setFeedback('✅ Usuario creado exitosamente');
            {() => navigate('/admin/crear-usuarios')}
            setEmail('');
            setPassword('');
            setFirstName('');
            setLastName('');
            setRole('user');
            setParentesco('');
        } catch (error) {
            console.error('Error al crear usuario', error);
            setFeedback('❌ Error al crear el usuario');
        }
    };

    return (
        <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4, p: 2 }}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
                <Typography variant="h5" mb={3} fontWeight="bold">
                    Crear nuevo usuario
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Nombre"
                        fullWidth
                        margin="normal"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                    <TextField
                        label="Apellido"
                        fullWidth
                        margin="normal"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Contraseña"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Rol</InputLabel>
                        <Select value={role} label="Rol" onChange={(e) => setRole(e.target.value)} required>

                            <MenuItem value="admin">Administrador</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Parentesco (opcional)</InputLabel>
                        <Select
                            value={parentesco}
                            label="Parentesco (opcional)"
                            onChange={(e) => setParentesco(e.target.value)}
                        >
                            <MenuItem value="">Ninguno</MenuItem>
                            {parentescoOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Crear usuario
                    </Button>
                    {feedback && (
                        <Typography textAlign="center" color="secondary" mt={2}>
                            {feedback}
                        </Typography>
                    )}
                </form>
            </Paper>
        </Box>
    );
};

export default CreateUserForm;
