        import { useState } from 'react';
        import './login.css';
        import { useNavigate } from 'react-router-dom';
        import logo from '../../../assets/logoprincipal.png';
        import login from '../../../assets/login.png';
        import google from '../../../assets/google.svg';
        import facebook from '../../../assets/facebook.svg';
        import { loginUser } from '../../../services/ApiService';
        import eyeOpen from '../../../assets/eyeClosed.svg';
        import eyeClosed from '../../../assets/eyeOpen.svg';
        import { auth, googleProvider, facebookProvider, signInWithPopup } from './firebase';

        interface ErrorResponse {
            response: {
                data: string;
            };
        }

        const Login = () => {
            const [email, setEmail] = useState<string>('');
            const [password, setPassword] = useState<string>('');
            const [errorMessage, setErrorMessage] = useState<string>('');
            const [showPassword, setShowPassword] = useState(false);
            const navigate = useNavigate();
            
    const handleGoogleLogin = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        console.log('Usuario con Google:', user);
        // Redirige, guarda sesión, etc.
    } catch (error) {
        console.error('Error con Google login:', error);
    }
    };

    const handleFacebookLogin = async () => {
    try {
        const result = await signInWithPopup(auth, facebookProvider);
        const user = result.user;
        console.log('Usuario con Facebook:', user);
        // Redirige, guarda sesión, etc.
    } catch (error) {
        console.error('Error con Facebook login:', error);
    }
    };
            const handleLogin = async (): Promise<void> => {
                setErrorMessage('');

                if (!email || !password) {
                    setErrorMessage('Email y contraseña son requeridos');
                    return;
                }

                try {
                    const response = await loginUser(email, password);
                    console.log('Login response:', response.data);

                    if (response.data.token) {
                        // Guardar token
                        localStorage.setItem('token', response.data.token);
                        localStorage.setItem('userId', response.data.id.toString());

                        // Obtener el rol correctamente
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
                                <div className="password-group">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Contraseña"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                                        <img src={showPassword ? eyeOpen : eyeClosed} alt="Toggle password visibility" />
                                    </span>
                                </div>
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
            <img 
            src={google} 
            alt="Google" 
            className="logo-google" 
            onClick={handleGoogleLogin} 
            style={{ cursor: 'pointer' }}
            />
            <img 
            src={facebook} 
            alt="Facebook" 
            className="logo-facebook" 
            onClick={handleFacebookLogin} 
            style={{ cursor: 'pointer' }}
            />
        </div>
        </div>


                        <button className="back-button" onClick={() => navigate('/')}>Regresar</button>
                    </div>
                </div>
            );
        };

        export default Login;
