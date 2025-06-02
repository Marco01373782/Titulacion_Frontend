    import { useState } from 'react';
    import './login.css';
    import { useNavigate } from 'react-router-dom';
    import logo from '../../../assets/logoprincipal.png';
    import login from '../../../assets/login.png';
    import google from '../../../assets/google.svg';
    import facebook from '../../../assets/facebook.svg';
    import { loginUser } from '../../../services/ApiService'; // Importa el método de login
     import eyeOpen from '../../../assets/eyeClosed.svg';
    import eyeClosed from '../../../assets/eyeOpen.svg';
    interface ErrorResponse {
    response: {
        data: string;
    };
    }

    const Login = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const navigate = useNavigate();

    const handleLogin = async (): Promise<void> => {
        setErrorMessage(''); // Limpiar el mensaje de error antes de intentar el login

        if (!email || !password) {
        setErrorMessage('Email y contraseña son requeridos');
        return;
        }

        // Llamar al servicio de login
        try {
        const response = await loginUser(email, password);
        
        if (response.data.token) {
            // Si recibimos el token, significa que el login fue exitoso
            localStorage.setItem('token', response.data.token); // Guardar el token en localStorage
            localStorage.setItem('userRole', response.data.roles); // Guardar el rol en localStorage
            
            // Navegar al dashboard
            navigate('/app/dashboard');
        } else {
            setErrorMessage('Error al iniciar sesión. Intenta de nuevo.');
        }
        } catch (error) {
        if ((error as ErrorResponse).response) {
            setErrorMessage((error as ErrorResponse).response.data); // Mostrar el mensaje de error recibido desde el backend
        } else {
            setErrorMessage('Error de conexión con el servidor');
        }
        }
    };

    return (
        <div className="container-login">
        <div className="left-panel">
            <h1>Renova Mind</h1>
            <p>
            Bienvenido de nuevo. Tu mente sigue creciendo, y tu camino también. <br />
            Inicia sesión y continúa avanzando.
            </p>
            <img className="imagen" src={login} alt="Imagen" />
        </div>

        <div className="right-panel">
            <div className="login-form">
            <img src={logo} alt="Logo" className="logo-login" />

            <h2>Iniciar Sesión</h2>
            <div className="question">
                <p>¿Es tu primera vez?</p>
                <p className="registrar" onClick={() => navigate('/register')}>Registrate</p>
            </div>
            <div className="email">
                <label>Email *</label>
                <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="password">
                <label>Contraseña *</label>
                <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <div className="recuperar">
                <p>¿Olvidaste tu Contraseña?</p>
            </div>

            <button className="login-button" onClick={handleLogin}>INICIAR SESIÓN</button>

            <div className="alert">
                <p>Al registrarte aceptas nuestras Condiciones de uso y Políticas de Privacidad</p>
            </div>

            <div className="otros">
                <p>O Conéctate con</p>
                <div className="logos">
                <img src={google} alt="Logo" className="logo-google" />
                <img src={facebook} alt="Logo" className="logo-facebook" />
                </div>
            </div>
            </div>

            <button className="back-button" onClick={() => navigate('/')}>Regresar</button>
        </div>
        </div>
    );
    };

    export default Login;
