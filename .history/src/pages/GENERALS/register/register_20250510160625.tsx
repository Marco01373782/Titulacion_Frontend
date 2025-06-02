import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './register.css';
import logo from '../../../assets/logoprincipal.png';
import google from '../../../assets/google.svg';
import registerImage from '../../../assets/register.png';
import facebook from '../../../assets/facebook.svg';
import ApiService from '../../../services/ApiService';
import eyeOpen from '../../../assets/eyeClosed.svg';
import eyeClosed from '../../../assets/eyeOpen.svg';

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        parentescoId: '',
    });

    const [parentescos, setParentescos] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formErrors, setFormErrors] = useState({
        firstName: false,
        lastName: false,
        email: false,
        password: false,
        confirmPassword: false,
        parentescoId: false,
    });

    useEffect(() => {
        ApiService.get('/parentesco')
        .then(response => setParentescos(response.data))
        .catch(() => setParentescos([]));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = () => {
        setErrorMessage('');
        setFormErrors({
            firstName: false,
            lastName: false,
            email: false,
            password: false,
            confirmPassword: false,
            parentescoId: false,
        });

        let errors = false;
        const newFormErrors = { ...formErrors };

        // Validar campos
        Object.keys(formData).forEach((key) => {
            if (!formData[key as keyof typeof formData]) {
                newFormErrors[key as keyof typeof newFormErrors] = true;
                errors = true;
            }
        });

        // Validar confirmación de contraseña
        if (formData.password !== formData.confirmPassword) {
            setErrorMessage('Las contraseñas no coinciden.');
            newFormErrors.password = true;
            newFormErrors.confirmPassword = true;
            errors = true;
        }

        setFormErrors(newFormErrors);

        if (errors) return;

        const payload = {
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            roles: '',
            parentesco: {
                id: parseInt(formData.parentescoId),
            },
        };

        ApiService.post('/users', payload)
        .then(() => {
            navigate('/app/patient-intro');
        })
        .catch(error => {
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data);
            } else {
                setErrorMessage('Error al registrar el usuario.');
            }
        });
    };

    return (
        <div className="container-register">
            <div className="left-panel-register">
                <div className="register-form">
                    <img src={logo} alt="Logo" className="logo-register" />
                    <h2>Registrate</h2>

                    <div className="question">
                        <p>¿Ya tienes una cuenta?</p>
                        <p className="registrar" onClick={() => navigate('/login')}>Inicia Sesión</p>
                    </div>

                    <div className="row-input">
                        <div className={`input-group ${formErrors.firstName ? 'error' : ''}`}>
                            <label>Nombre *</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Nombre"
                            />
                        </div>
                        <div className={`input-group ${formErrors.lastName ? 'error' : ''}`}>
                            <label>Apellido *</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Apellido"
                            />
                        </div>
                    </div>

                    <div className={`input-group full-width ${formErrors.email ? 'error' : ''}`}>
                        <label>Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                        />
                    </div>

                    <div className="row-input">
                        <div className={`input-group full-width ${formErrors.parentescoId ? 'error' : ''}`}>
                            <label>Parentesco *</label>
                            <select name="parentescoId" value={formData.parentescoId} onChange={handleChange}>
                                <option value="">Selecciona</option>
                                {parentescos.map((p: any) => (
                                    <option key={p.id} value={p.id}>{p.nameParentesco}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="row-input">
                        <div className={`input-group ${formErrors.password ? 'error' : ''}`}>
                            <label>Contraseña *</label>
                            <div className="password-group">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Contraseña"
                                />
                                <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                                    <img src={showPassword ? eyeOpen : eyeClosed} alt="Toggle password visibility" />
                                </span>
                            </div>
                        </div>
                        <div className={`input-group ${formErrors.confirmPassword ? 'error' : ''}`}>
                            <label>Repetir Contraseña *</label>
                            <div className="password-group">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Repetir Contraseña"
                                />
                                <span className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    <img src={showConfirmPassword ? eyeOpen : eyeClosed} alt="Toggle password visibility" />
                                </span>
                            </div>
                        </div>
                    </div>

                    {errorMessage && <div className="error-message">{errorMessage}</div>}

                    <button className="register-button" onClick={handleRegister}>REGISTRARSE</button>

                    <div className="alert">
                        <p>Al registrarte aceptas nuestras Condiciones de uso y Políticas de Privacidad</p>
                    </div>

                    <div className="otros">
                        <p>O regístrate con</p>
                        <div className="logos">
                            <img src={google} alt="Google" className="logo-google" />
                            <img src={facebook} alt="Facebook" className="logo-facebook" />
                        </div>
                    </div>
                </div>
                <button className="back" onClick={() => navigate('/')}>Regresar</button>
            </div>

            <div className="right-panel-register">
                <h1>Renova Mind</h1>
                <p>
                    Comienza hoy el viaje hacia una mente más activa y llena de vida.
                    Regístrate y renueva tu bienestar.
                </p>
                <img className="imagen" src={registerImage} alt="Imagen de bienvenida" />
            </div>
        </div>
    );
};

export default Register;
