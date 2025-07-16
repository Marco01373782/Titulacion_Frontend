import React, { useState, useEffect } from 'react';
import {
    Box, TextField, Button, Typography, Paper, IconButton, InputAdornment,
    Select, MenuItem, FormControl, InputLabel, FormHelperText, useTheme, Link
} from '@mui/material';
import { Visibility, VisibilityOff /*, Google, Facebook*/ } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import logoMarcaAgua from '../../../assets/imagenes/logo_icono.webp';
import logoTexto from '../../../assets/imagenes/logo_text.webp';
import registerIllustration from '../../../assets/imagenes/register.webp';
import { fetchParentescos, registerUser, loginUser } from '../../../services/ApiService';

const Register = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({/* igual */});
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

    // ...handlers iguales

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            backgroundColor: theme.palette.background.default,
        }}>
            {/* Panel izquierdo — oculto en móviles */}
            <Box
                sx={{
                    flex: 1,
                    display: { xs: 'none', md: 'flex' },
                    backgroundColor: '#FFD2FE',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 3,
                    position: 'relative'
                }}
            >
                <Box
                    component="img"
                    src={logoMarcaAgua}
                    alt="Logo Fondo"
                    sx={{ position: 'relative', top: 0, left: 0, width: 100, opacity: 1 }}
                />
                <Typography variant="h1" color="primary" sx={{ fontSize: '3rem', mb: 0 }}>
                    NeuroX
                </Typography>
                <Typography variant="body1" sx={{ maxWidth: 400, fontWeight: 600, textAlign: 'center' }}>
                    Comienza hoy el viaje hacia una mente más activa y llena de vida. Regístrate y renueva tu bienestar.
                </Typography>
                <Box component="img" src={registerIllustration} alt="Ilustración" sx={{ width: '80%', maxWidth: 400, mt: 3 }} />
            </Box>

            {/* Formulario visible en todas las vistas */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 4,
                }}
            >
                <Paper elevation={6} sx={{
                    p: 4,
                    width: '100%',
                    maxWidth: 420,
                    borderRadius: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <Box component="img" src={logoTexto} alt="Logo" sx={{ width: 120, mb: 3, mx: 'auto', display: 'block' }} />
                    <Typography variant="h4" textAlign="center" gutterBottom>Registrarse</Typography>

                    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, mb: 2 }}>
                        <TextField label="Nombre" name="firstName" fullWidth value={formData.firstName} onChange={handleChange} error={!!formErrors.firstName} helperText={formErrors.firstName} />
                        <TextField label="Apellido" name="lastName" fullWidth value={formData.lastName} onChange={handleChange} error={!!formErrors.lastName} helperText={formErrors.lastName} />
                    </Box>

                    <TextField label="Email" name="email" type="email" fullWidth margin="dense" value={formData.email} onChange={handleChange} error={!!formErrors.email} helperText={formErrors.email} />

                    <FormControl fullWidth margin="dense" error={!!formErrors.parentesco}>
                        <InputLabel>Parentesco</InputLabel>
                        <Select label="Parentesco" value={formData.parentesco} onChange={handleSelectChange}>
                            <MenuItem value=""><em>Selecciona</em></MenuItem>
                            {parentescos.map(p => (
                                <MenuItem key={p} value={p}>{p}</MenuItem>
                            ))}
                        </Select>
                        {formErrors.parentesco && <FormHelperText>{formErrors.parentesco}</FormHelperText>}
                    </FormControl>

                    <TextField label="Contraseña" name="password" type={showPassword ? 'text' : 'password'} fullWidth margin="dense" value={formData.password} onChange={handleChange} error={!!formErrors.password} helperText={formErrors.password}
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

                    <TextField label="Confirmar Contraseña" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} fullWidth margin="dense" value={formData.confirmPassword} onChange={handleChange}
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

                    <Button variant="outlined" fullWidth sx={{ mt: 3 }} onClick={() => navigate('/home')}>
                        Regresar
                    </Button>
                </Paper>
            </Box>
        </Box>
    );
};

export default Register;