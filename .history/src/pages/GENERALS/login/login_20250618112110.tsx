    import { useState } from 'react';
    import { Box, Grid, TextField, Typography, Button, IconButton, InputAdornment } from '@mui/material';
    import { Visibility, VisibilityOff } from '@mui/icons-material';
    import { useNavigate } from 'react-router-dom';
    import logo from '../../../assets/logoprincipal.png';
    import logoFondo from '../../../assets/';  // Fondo semi transparente
    import google from '../../../assets/google.svg';
    import facebook from '../../../assets/facebook.svg';
    import { loginUser } from '../../../services/ApiService';

    interface ErrorResponse {
    response: { data: string };
    }

    const Login = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        setErrorMessage('');
        if (!email || !password) {
        setErrorMessage('Email y contraseña son requeridos');
        return;
        }
        try {
        const response = await loginUser(email, password);
        const { token, id, roles } = response.data;
        if (token) {
            localStorage.setItem('token', token);
            localStorage.setItem('userId', id.toString());
            const role = Array.isArray(roles) ? roles[0] : roles;
            localStorage.setItem('userRole', role);
            if (role === 'admin') navigate('/admin/gestionar-actividades');
            else if (role === 'user') navigate('/user/dashboard');
            else setErrorMessage('Rol no reconocido');
        } else {
            setErrorMessage('Error al iniciar sesión. Intenta de nuevo.');
        }
        } catch (error) {
        if ((error as ErrorResponse).response) {
            setErrorMessage((error as ErrorResponse).response.data);
        } else {
            setErrorMessage('Error de conexión con el servidor');
        }
        }
    };

    return (
        <Grid container sx={{ height: '100vh' }}>
        <Grid item xs={12} md={6} sx={{
            backgroundColor: '#FFD2FE',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            position: 'relative'
        }}>
            <Typography variant="h2" sx={{ color: '#2C6D3D', mb: 2, fontWeight: 'bold', fontFamily: 'Poppins' }}>
            Renova Mind
            </Typography>
            <Typography sx={{ fontSize: 18, fontWeight: 600, textAlign: 'center', maxWidth: 400 }}>
            Bienvenido de nuevo. Tu mente sigue creciendo, y tu camino también. Inicia sesión y continúa avanzando.
            </Typography>
            <Box
            sx={{
                position: 'absolute',
                top: '10%',
                right: '10%',
                opacity: 0.08,
                width: 300,
                height: 300,
                backgroundImage: `url(${logoFondo})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
            }}
            />
        </Grid>

        <Grid item xs={12} md={6} sx={{ backgroundColor: '#F5F5F5', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{
            width: 400,
            bgcolor: '#FFFFFF',
            p: 4,
            borderRadius: 3,
            boxShadow: '0px 0px 10px rgba(0,0,0,0.2)',
            position: 'relative'
            }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
                <img src={logo} alt="logo" width={80} style={{ borderRadius: '50%', border: '3px solid #000' }} />
                <Typography variant="h5" sx={{ mt: 1, fontWeight: 600 }}>Iniciar Sesión</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                ¿Es tu primera vez?{' '}
                <span style={{ textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }}
                    onClick={() => navigate('/register')}>
                    Registrate
                </span>
                </Typography>
            </Box>

            <TextField
                fullWidth label="Email *"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
                fullWidth label="Contraseña *"
                type={showPassword ? 'text' : 'password'}
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                    </InputAdornment>
                )
                }}
            />

            {errorMessage && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {errorMessage}
                </Typography>
            )}

            <Typography sx={{ textAlign: 'center', mt: 1, fontSize: 13, textDecoration: 'underline', fontWeight: 600, cursor: 'pointer' }}>
                ¿Olvidaste tu contraseña?
            </Typography>

            <Button fullWidth variant="contained" sx={{ mt: 3, bgcolor: '#000' }} onClick={handleLogin}>
                INICIAR SESIÓN
            </Button>

            <Typography sx={{ fontSize: 10, textAlign: 'center', mt: 2 }}>
                Al registrarte aceptas nuestras Condiciones de uso y Políticas de Privacidad.
            </Typography>

            <Typography sx={{ textAlign: 'center', mt: 2, fontSize: 14, fontWeight: 500 }}>O Conéctate con</Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
                <img src={google} alt="Google" width={35} />
                <img src={facebook} alt="Facebook" width={35} />
            </Box>

            <Button fullWidth variant="outlined" sx={{ mt: 3 }} onClick={() => navigate('/home')}>
                Regresar
            </Button>
            </Box>
        </Grid>
        </Grid>
    );
    };

    export default Login;
