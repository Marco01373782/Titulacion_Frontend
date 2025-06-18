    import { useState } from 'react';
    import { Box, Grid, Paper, Typography, TextField, Button, Alert, useMediaQuery } from '@mui/material';
    import { useTheme } from '@mui/material/styles';
    import { useNavigate } from 'react-router-dom';
    import { loginUser } from '../../../services/ApiService';

    import logoPrincipal from '../../../assets/logoprincipal.png';
    import loginImage from '../../../assets/login.png';
    import logoMarcaAgua from '../../../assets/logo_icono.png'; // AQUI tu logo de fondo marca de agua

    interface ErrorResponse {
    response: { data: string };
    }

    const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleLogin = async () => {
        setErrorMessage('');
        if (!email || !password) {
        setErrorMessage('Email y contraseña son requeridos');
        return;
        }
        try {
        const response = await loginUser(email, password);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.id.toString());
            const role = Array.isArray(response.data.roles) ? response.data.roles[0] : response.data.roles;
            localStorage.setItem('userRole', role);
            localStorage.setItem('user', JSON.stringify(response.data));
            if (role === 'admin') navigate('/admin/gestionar-actividades');
            else if (role === 'user') navigate('/user/dashboard');
            else setErrorMessage('Rol no reconocido');
        } else {
            setErrorMessage('Error al iniciar sesión. Intenta de nuevo.');
        }
        } catch (error) {
        if ((error as ErrorResponse).response)
            setErrorMessage((error as ErrorResponse).response.data);
        else setErrorMessage('Error de conexión con el servidor');
        }
    };

    return (
        <Grid container sx={{ height: '100vh' }}>
        {/* Panel izquierdo */}
        <Grid item xs={12} md={6}
            sx={{
            backgroundColor: '#FFD2FE',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            p: 3,
            }}
        >
            {/* Fondo con marca de agua */}
            <Box
            sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundImage: `url(${logoMarcaAgua})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: isMobile ? '60%' : '40%',
                opacity: 0.07,
                zIndex: 0,
            }}
            />
            <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <Typography variant="h1" sx={{ color: '#2C6D3D', mb: 2 }}>
                Renova Mind
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                Bienvenido de nuevo. Tu mente sigue creciendo, y tu camino también.
                Inicia sesión y continúa avanzando.
            </Typography>
            <Box component="img" src={loginImage} sx={{ width: isMobile ? '70%' : '400px', mt: 2 }} />
            </Box>
        </Grid>

        {/* Panel derecho */}
        <Grid item xs={12} md={6}
            sx={{
            backgroundColor: '#F4F5FA',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 2,
            }}
        >
            <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 4 }}>
            <Box display="flex" justifyContent="center" mb={2}>
                <Box component="img" src={logoPrincipal} sx={{ width: 80, height: 80, borderRadius: '50%', border: '2px solid black' }} />
            </Box>

            <Typography variant="h2" textAlign="center" mb={2}>Iniciar Sesión</Typography>

            <Typography textAlign="center" mb={1}>
                ¿Es tu primera vez? <Button variant="text" onClick={() => navigate('/register')}>Registrate</Button>
            </Typography>

            <TextField
                label="Email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                label="Contraseña"
                fullWidth
                margin="normal"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {errorMessage && <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert>}

            <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={handleLogin}>INICIAR SESIÓN</Button>

            <Typography variant="body2" textAlign="center" mt={2}>
                Al registrarte aceptas nuestras Condiciones de uso y Políticas de Privacidad
            </Typography>

            <Typography textAlign="center" mt={2} fontWeight={500}>
                O conéctate con:
            </Typography>

            <Box display="flex" justifyContent="center" gap={2} mt={1}>
                <Box component="img" src="/path/to/google.svg" sx={{ width: 35, height: 35 }} />
                <Box component="img" src="/path/to/facebook.svg" sx={{ width: 35, height: 35 }} />
            </Box>

            <Button variant="outlined" fullWidth sx={{ mt: 3 }} onClick={() => navigate('/home')}>Regresar</Button>
            </Paper>
        </Grid>
        </Grid>
    );
    };

    export default Login;
