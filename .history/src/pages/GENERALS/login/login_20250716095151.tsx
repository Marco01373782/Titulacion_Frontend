import { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    IconButton,
    InputAdornment,
    useTheme,
    useMediaQuery,
    Link
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import logoMarcaAgua from '../../../assets/imagenes/logo_icono.webp';
import logoTexto from '../../../assets/imagenes/logo_text.webp';
import loginIllustration from '../../../assets/imagenes/login.webp';
import { loginUser } from '../../../services/ApiService';
import { CircularProgress, Backdrop } from '@mui/material';


interface ErrorResponse {
    response: {
        data: string;
    };
}

const Login = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);


    const handleLogin = async () => {
        setErrorMessage('');

        if (!email || !password) {
            setErrorMessage('Email y contraseña son requeridos');
            return;
        }

        setLoading(true); // ⏳ Activamos el loading

        try {
            const response = await loginUser(email, password);
            console.log('Login response:', response.data);

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userId', response.data.id.toString());
                const roles = response.data.roles;
                const role = Array.isArray(roles) ? roles[0] : roles;
                localStorage.setItem('userRole', role);
                localStorage.setItem('user', JSON.stringify({
                    id: response.data.id,
                    email: response.data.email,
                    roles: response.data.roles
                }));

                if (role === 'admin') {
                    navigate('/admin/gestionar-actividades');
                } else if (role === 'user') {
                    navigate('/user/dashboard');
                } else {
                    setErrorMessage('Rol no reconocido');
                }
            } else {
                setErrorMessage('Error al iniciar sesión');
            }
        } catch (error) {
            if ((error as ErrorResponse).response) {
                setErrorMessage((error as ErrorResponse).response.data);
            } else {
                setErrorMessage('Error de conexión con el servidor');
            }
        } finally {
            setLoading(false); // ✅ Apagamos el loading
        }
    };


    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                backgroundColor: theme.palette.background.default,
            }}
        >
            {/* Left Panel */}
            {!isMobile && (
                <Box
                    sx={{
                        flex: 1,
                        backgroundColor: '#FFD2FE',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 4,
                        position: 'relative',
                    }}
                >
                    <Box
                        component="img"
                        src={logoMarcaAgua}
                        alt="Logo Fondo"
                        sx={{
                            position: 'absolute',
                            top: 20,
                            left: 20,
                            width: 100,
                            opacity: 0.1,
                        }}
                    />

                    <Typography variant="h1" color="primary" sx={{ fontSize: '3rem', mb: 2 }}>
                        NeuroX
                    </Typography>

                    <Typography variant="body1" sx={{ maxWidth: 400, fontWeight: 700, textAlign: 'center' }}>
                        Bienvenido de nuevo. Tu mente sigue creciendo, y tu camino también.
                        Inicia sesión y continúa avanzando.
                    </Typography>

                    <Box
                        component="img"
                        src={loginIllustration}
                        alt="Ilustración"
                        sx={{ width: '80%', maxWidth: 450, mt: 3 }}
                    />
                </Box>
            )}

            {/* Right Panel */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: { xs: 2, sm: 4 },
                }}
            >
                <Paper elevation={6} sx={{ p: { xs: 3, sm: 4 }, width: '100%', maxWidth: 400, borderRadius: 4 }}>
                    <Box
                        component="img"
                        src={logoTexto}
                        alt="Logo"
                        sx={{
                            width: 150,
                            mb: 3,
                            mx: 'auto',
                            display: 'block',
                            opacity: 0.9,
                        }}
                    />

                    <Typography variant="h4" gutterBottom textAlign="center">
                        Iniciar Sesión
                    </Typography>

                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <TextField
                        label="Contraseña"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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

                    {errorMessage && (
                        <Typography color="error" sx={{ mt: 1 }}>
                            {errorMessage}
                        </Typography>
                    )}

                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ mt: 3, py: 1 }}
                        onClick={handleLogin}
                    >
                        Iniciar Sesión
                    </Button>

                    <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
                        ¿Es tu primera vez?{' '}
                        <Link component="button" underline="always" onClick={() => navigate('/register')}>
                            Regístrate
                        </Link>
                    </Typography>

                    <Typography variant="body2" textAlign="center" sx={{ mt: 2, fontSize: '0.8rem' }}>
                        Al registrarte aceptas nuestras Condiciones de uso y Políticas de Privacidad
                    </Typography>

                    <Button
                        variant="outlined"
                        fullWidth
                        sx={{ mt: 4 }}
                        onClick={() => navigate('/home')}
                    >
                        Regresar
                    </Button>
                </Paper>
            </Box>
        </Box>
    );
};

export default Login;
