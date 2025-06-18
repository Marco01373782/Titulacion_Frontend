import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Grid, TextField, Button, Typography, Select, MenuItem,
    InputLabel, FormControl, useMediaQuery, Container, Paper, IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { fetchParentescos, registerUser, loginUser } from '../../../services/ApiService';

const Register = () => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width:768px)');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        parentesco: '',
    });

    const [parentescos, setParentescos] = useState<string[]>([]);
    const [formErrors, setFormErrors] = useState<any>({});
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        fetchParentescos()
            .then(response => setParentescos(response.data))
            .catch(() => setParentescos([]));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        let errors: any = {};
        if (!formData.firstName) errors.firstName = 'Este campo es obligatorio';
        if (!formData.lastName) errors.lastName = 'Este campo es obligatorio';
        if (!formData.email) errors.email = 'Este campo es obligatorio';
        if (!formData.parentesco) errors.parentesco = 'Este campo es obligatorio';
        if (!formData.password) errors.password = 'Este campo es obligatorio';
        if (!formData.confirmPassword) errors.confirmPassword = 'Este campo es obligatorio';
        if (formData.password !== formData.confirmPassword) errors.passwordMatch = 'Las contraseñas no coinciden';
        return errors;
    };

    const handleRegister = () => {
        setErrorMessage('');
        const errors = validateForm();
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        const payload = {
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            roles: '',
            parentesco: formData.parentesco,
        };

        registerUser(payload)
            .then(() => loginUser(formData.email, formData.password))
            .then((response) => {
                const { token, roles, id } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('userRole', roles);
                localStorage.setItem('userId', id.toString());
                navigate('/user/patient-intro');
            })
            .catch((error) => {
                if (error.response?.data) setErrorMessage(error.response.data);
                else setErrorMessage('Error al registrar o iniciar sesión.');
            });
    };

    return (
        <Container maxWidth="lg">
            <Paper elevation={3} sx={{ p: 2, mt: 5 }}>
                <Grid container spacing={2} direction={isMobile ? 'column' : 'row'}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                            <Typography variant="h4" fontWeight="bold" gutterBottom>Renova Mind</Typography>
                            <Typography variant="body1">
                                Comienza hoy el viaje hacia una mente más activa y llena de vida. Regístrate y renueva tu bienestar.
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box sx={{ maxWidth: 400, mx: 'auto', p: 2 }}>
                            <Typography variant="h5" gutterBottom>Regístrate</Typography>

                            <TextField
                                label="Nombre"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                error={!!formErrors.firstName}
                                helperText={formErrors.firstName}
                            />
                            <TextField
                                label="Apellido"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                error={!!formErrors.lastName}
                                helperText={formErrors.lastName}
                            />
                            <TextField
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                error={!!formErrors.email}
                                helperText={formErrors.email}
                            />
                            <FormControl fullWidth margin="normal" error={!!formErrors.parentesco}>
                                <InputLabel>Parentesco</InputLabel>
                                <Select
                                    value={formData.parentesco}
                                    onChange={(e) => setFormData(prev => ({ ...prev, parentesco: e.target.value }))}
                                    label="Parentesco"
                                >
                                    <MenuItem value=""><em>Selecciona</em></MenuItem>
                                    {parentescos.map((p: string) => (
                                        <MenuItem key={p} value={p}>{p}</MenuItem>
                                    ))}
                                </Select>
                                {formErrors.parentesco && <Typography color="error">{formErrors.parentesco}</Typography>}
                            </FormControl>

                            <TextField
                                label="Contraseña"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                error={!!formErrors.password}
                                helperText={formErrors.password}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    )
                                }}
                            />
                            <TextField
                                label="Repetir Contraseña"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                error={!!formErrors.confirmPassword || !!formErrors.passwordMatch}
                                helperText={formErrors.confirmPassword || formErrors.passwordMatch}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    )
                                }}
                            />

                            {errorMessage && <Typography color="error">{errorMessage}</Typography>}

                            <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleRegister}>
                                Registrarse
                            </Button>

                            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                                ¿Ya tienes cuenta? <Button onClick={() => navigate('/login')}>Inicia sesión</Button>
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default Register;
