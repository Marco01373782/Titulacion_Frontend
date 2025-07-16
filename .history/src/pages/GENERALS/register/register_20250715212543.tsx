import React, { useState, useEffect } from 'react';
import {
    Box, TextField, Button, Typography, Paper, IconButton, InputAdornment,
    Select, MenuItem, FormControl, InputLabel, FormHelperText, useTheme, Link
} from '@mui/material';
import { Visibility, VisibilityOff /*, Google, Facebook*/ } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import logoMarcaAgua from '../../../assets/imagenes/logo_icono.webp';
import logoTexto from '../../../assets/imagenes/logo_text.webp';
import registerIllustration from '../../../asset';
import { fetchParentescos, registerUser, loginUser } from '../../../services/ApiService';

const Register = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        parentesco: '',
    });

    const [parentescos, setParentescos] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [formErrors, setFormErrors] = useState<any>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        fetchParentescos()
            .then(response => setParentescos(response.data))
            .catch(() => setParentescos([]));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (event: any) => {
        const value = event.target.value;
        setFormData(prev => ({ ...prev, parentesco: value }));
    };

    const validateForm = () => {
        let errors: any = {};
        if (!formData.firstName) errors.firstName = 'Requerido';
        if (!formData.lastName) errors.lastName = 'Requerido';
        if (!formData.email) errors.email = 'Requerido';
        if (!formData.parentesco) errors.parentesco = 'Requerido';
        if (!formData.password) errors.password = 'Requerido';
        if (!formData.confirmPassword) errors.confirmPassword = 'Requerido';
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
                const { token, roles } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('userRole', roles);
                localStorage.setItem('userId', response.data.id.toString());
                navigate('/user/patient-flow');
            })
            .catch((error) => {
                if (error.response?.data) {
                    setErrorMessage(error.response.data);
                } else {
                    setErrorMessage('Error al registrar o iniciar sesión.');
                }
            });
    };

    return (
        <Box sx={{
            height: '100vh',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            backgroundColor: theme.palette.background.default,
        }}>
            {/* Panel izquierdo */}
            <Box sx={{
                flex: 1,
                backgroundColor: '#FFD2FE',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 3,
                position: 'relative',
                order: { xs: 1, md: 0 }
            }}>
                <Box
                    component="img"
                    src={logoMarcaAgua}
                    alt="Logo Fondo"
                    sx={{ position: 'relative', top: 0, left: 0, width: 100, opacity: 1 }}
                />
                <Typography variant="h1" color="primary" sx={{ fontSize: { xs: '2rem', md: '3rem' }, mb: 0 }}>
                    NeuroX
                </Typography>
                <Typography variant="body1" sx={{ maxWidth: 400, fontWeight: 600, textAlign: 'center' }}>
                    Comienza hoy el viaje hacia una mente más activa y llena de vida. Regístrate y renueva tu bienestar.
                </Typography>
                <Box component="img" src={registerIllustration} alt="Ilustración" sx={{ width: '80%', maxWidth: 400, mt: 3 }} />
            </Box>

            {/* Formulario */}
            <Box sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 4,
                order: { xs: 1, md: 0 },
            }}>
                <Paper elevation={6} sx={{
                    p: 4,
                    width: '95%',
                    maxWidth: { xs: 420, md: 420 },
                    minHeight: { xs: 'auto', md: 300 },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    borderRadius: 4
                }}>
                    <Box component="img" src={logoTexto} alt="Logo" sx={{ width: 120, mb: 3, mx: 'auto', display: 'block' }} />
                    <Typography variant="h4" textAlign="center" gutterBottom>Registrarse</Typography>

                    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, mb: 2 }}>
                        <TextField
                            label="Nombre"
                            name="firstName"
                            fullWidth
                            value={formData.firstName}
                            onChange={handleChange}
                            error={!!formErrors.firstName}
                            helperText={formErrors.firstName}
                        />
                        <TextField
                            label="Apellido"
                            name="lastName"
                            fullWidth
                            value={formData.lastName}
                            onChange={handleChange}
                            error={!!formErrors.lastName}
                            helperText={formErrors.lastName}
                        />
                    </Box>

                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        fullWidth
                        margin="dense"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!formErrors.email}
                        helperText={formErrors.email}
                    />

                    <FormControl fullWidth margin="dense" error={!!formErrors.parentesco}>
                        <InputLabel>Parentesco</InputLabel>
                        <Select
                            label="Parentesco"
                            value={formData.parentesco}
                            onChange={handleSelectChange}
                        >
                            <MenuItem value=""><em>Selecciona</em></MenuItem>
                            {parentescos.map(p => (
                                <MenuItem key={p} value={p}>{p}</MenuItem>
                            ))}
                        </Select>
                        {formErrors.parentesco && <FormHelperText>{formErrors.parentesco}</FormHelperText>}
                    </FormControl>

                    <TextField
                        label="Contraseña"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        margin="dense"
                        value={formData.password}
                        onChange={handleChange}
                        error={!!formErrors.password}
                        helperText={formErrors.password}
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

                    <TextField
                        label="Confirmar Contraseña"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        fullWidth
                        margin="dense"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={!!formErrors.confirmPassword || !!formErrors.passwordMatch}
                        helperText={formErrors.confirmPassword || formErrors.passwordMatch}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {errorMessage && (
                        <Typography color="error" sx={{ mt: 1 }}>{errorMessage}</Typography>
                    )}

                    <Button variant="contained" fullWidth sx={{ mt: 2, py: 1 }} onClick={handleRegister}>
                        Registrarse
                    </Button>

                    <Typography variant="body2" textAlign="center" sx={{ mt: 1 }}>
                        ¿Ya tienes cuenta?{' '}
                        <Link component="button" underline="always" onClick={() => navigate('/login')}>
                            Inicia sesión
                        </Link>
                    </Typography>

                    <Typography variant="body2" textAlign="center" sx={{ mt: 1, fontSize: '0.8rem' }}>
                        Al registrarte aceptas nuestras Condiciones de uso y Políticas de Privacidad
                    </Typography>

                    {/*<Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
                        O regístrate con
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1 }}>
                        <IconButton color="primary"><Google /></IconButton>
                        <IconButton color="primary"><Facebook /></IconButton>
                    </Box>*/}

                    <Button variant="outlined" fullWidth sx={{ mt: 3 }} onClick={() => navigate('/home')}>
                        Regresar
                    </Button>
                </Paper>
            </Box>
        </Box>
    );
};

export default Register;
