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
  //  useTheme,
   // useMediaQuery,
} from '@mui/material';
import { registerUser } from '../../../../services/ApiService';

const CreateUserForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [feedback, setFeedback] = useState<string | null>(null);
  //  const theme = useTheme();
    //const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFeedback(null);
        if (!email || !password || !role) {
            setFeedback('Por favor, completa todos los campos.');
            return;
        }

        try {
            const newUser = {
                email,
                password,
                roles: [role],
            };
            await registerUser(newUser);
            setFeedback('Usuario creado exitosamente');
            setEmail('');
            setPassword('');
            setRole('user');
        } catch (error) {
            setFeedback('Error al crear el usuario');
        }
    };

    return (
        <Box
            sx={{
                maxWidth: 500,
                mx: 'auto',
                mt: 4,
                p: 2,
            }}
        >
            <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
                <Typography variant="h5" mb={3} fontWeight="bold">
                    Crear nuevo usuario
                </Typography>
                <form onSubmit={handleSubmit}>
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
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="rol-label">Rol</InputLabel>
                        <Select
                            labelId="rol-label"
                            value={role}
                            label="Rol"
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <MenuItem value="user">Usuario</MenuItem>
                            <MenuItem value="admin">Administrador</MenuItem>
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
