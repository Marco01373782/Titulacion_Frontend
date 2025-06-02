import { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/logoprincipal.png';
import loginImage from '../../../assets/login.png';
import google from '../../../assets/google.svg';
import facebook from '../../../assets/facebook.svg';
import eyeOpen from '../../../assets/eyeClosed.svg';
import eyeClosed from '../../../assets/eyeOpen.svg';
import { loginUser } from '../../../services/ApiService';

interface ErrorResponse {
    response: {
        data: string;
    };
}

const Login = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [formErrors, setFormErrors] = useState<any>({});
    const navigate = useNavigate();

    const validateForm = () => {
        let errors: any = {};
        if (!email) errors.email = 'Este campo es obligatorio';
        if (!password) errors.password = 'Este campo es obligatorio';
        return errors;
    };

    const handleLogin = async (): Promise<void> => {
        setErrorMessage('');
        const errors = validateForm();
        setFormErrors(errors);

        if (Object.keys(errors).length > 0) return;

        try {
            const response = await loginUser(email, password);

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userRole', response.data.roles);
                navigate('/app/dashboard');
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
            <div className="left-panel-login">
                <div className="login-form">
                    <img src={logo} alt="Logo" className="logo-login" />
                    <h2>Inicia Sesión</h2>

                    <div className="question">
                        <p>¿No tienes cuenta?</p>
                        <p className="registrar" onClick={() => navigate('/register')}>Regístrate</p>
                    </div>

                    <div className="input-group full-width">
                        <label>Email *</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className={formErrors.email ? 'error' : ''}
                        />
                        {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                    </div>

                    <div className="input-group full-width">
                        <label>Contraseña *</label>
                        <div className="password-group">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Contraseña"
                                className={formErrors.password ? 'error' : ''}
                            />
                            <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                                <img src={showPassword ? eyeOpen : eyeClosed} alt="Toggle password visibility" />
                            </span>
                        </div>
                        {formErrors.password && <span className="error-message">{formErrors.password}</span>}
                    </div>

                    {errorMessage && <div className="error-message">{errorMessage}</div>}

                    <button className="login-button" onClick={handleLogin}>INICIAR SESIÓN</button>

                    <div className="alert">
                        <p>Al ingresar aceptas nuestras Condiciones de uso y Políticas de Privacidad</p>
                    </div>

                    <div className="otros">
                        <p>O inicia sesión con</p>
                        <div className="logos">
                            <img src={google} alt="Google" className="logo-google" />
                            <img src={facebook} alt="Facebook" className="logo-facebook" />
                        </div>
                    </div>
                </div>
                <button className="back" onClick={() => navigate('/')}>Regresar</button>
            </div>

            <div className="right-panel-login">
                <h1>Renova Mind</h1>
                <p>
                    Descubre herramientas que renuevan tu bienestar emocional. Inicia sesión y continúa tu progreso.
                </p>
                <img className="imagen" src={loginImage} alt="Imagen de bienvenida" />
            </div>
        </div>
    );
};

export default Login;
