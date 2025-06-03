    import { useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import './register.css';
    import logo from '../../../assets/logoprincipal.png';
    import google from '../../../assets/google.svg';
    import registerImage from '../../../assets/register.png';
    import facebook from '../../../assets/facebook.svg';
    import eyeOpen from '../../../assets/eyeClosed.svg';
    import eyeClosed from '../../../assets/eyeOpen.svg';

    import { fetchParentescos, registerUser, loginUser } from '../../../services/ApiService';

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

    const [parentescos, setParentescos] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formErrors, setFormErrors] = useState<any>({});

    useEffect(() => {
        fetchParentescos()
        .then(response => {
            setParentescos(response.data);
        })
        .catch(() => {
            setParentescos([]);
        });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        let errors: any = {};
        if (!formData.firstName) errors.firstName = 'Este campo es obligatorio';
        if (!formData.lastName) errors.lastName = 'Este campo es obligatorio';
        if (!formData.email) errors.email = 'Este campo es obligatorio';
        if (!formData.parentescoId) errors.parentescoId = 'Este campo es obligatorio';
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
        roles: '', // Backend asigna 'user'
        parentesco: {
            id: parseInt(formData.parentescoId),
        },
        };

        registerUser(payload)
        .then(() => {
            return loginUser(formData.email, formData.password);
        })
        .then((response) => {
            const { token, roles } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('userRole', roles);
            navigate('/user/patient-intro');
        })
        .catch((error) => {
            if (error.response && error.response.data) {
            setErrorMessage(error.response.data);
            } else {
            setErrorMessage('Error al registrar o iniciar sesión.');
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
                                    <div className="input-group">
                                        <label>Nombre *</label>
                                        <input 
                                            type="text" 
                                            name="firstName" 
                                            value={formData.firstName} 
                                            onChange={handleChange} 
                                            placeholder="Nombre" 
                                            className={formErrors.firstName ? 'error' : ''} 
                                        />
                                        {formErrors.firstName && <span className="error-message">{formErrors.firstName}</span>}
                                    </div>
                                    <div className="input-group">
                                        <label>Apellido *</label>
                                        <input 
                                            type="text" 
                                            name="lastName" 
                                            value={formData.lastName} 
                                            onChange={handleChange} 
                                            placeholder="Apellido" 
                                            className={formErrors.lastName ? 'error' : ''} 
                                        />
                                        {formErrors.lastName && <span className="error-message">{formErrors.lastName}</span>}
                                    </div>
                                </div>

                                <div className="input-group full-width">
                                    <label>Email *</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        placeholder="Email" 
                                        className={formErrors.email ? 'error' : ''} 
                                    />
                                    {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                                </div>

                                <div className="row-input">
                                    <div className="input-group full-width">
                                        <label>Parentesco *</label>
                                        <select
  name="parentescoId"
  value={formData.parentescoId}
  onChange={handleChange}
  className={formErrors.parentescoId ? 'error' : ''}
>
  <option value="">Selecciona</option>
  {parentescos.map((p: string) => (
    <option key={p} value={p}>{p}</option>
  ))}
</select>

                                        {formErrors.parentescoId && <span className="error-message">{formErrors.parentescoId}</span>}
                                    </div>
                                </div>

                                <div className="row-input">
                                    <div className="input-group">
                                        <label>Contraseña *</label>
                                        <div className="password-group">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Contraseña"
                                                className={formErrors.password ? 'error' : ''}
                                            />
                                            <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                                                <img src={showPassword ? eyeOpen : eyeClosed} alt="Toggle password visibility" />
                                            </span>
                                        </div>
                                        {formErrors.password && <span className="error-message">{formErrors.password}</span>}
                                    </div>
                                    <div className="input-group">
                                        <label>Repetir Contraseña *</label>
                                        <div className="password-group">
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                placeholder="Repetir Contraseña"
                                                className={formErrors.confirmPassword ? 'error' : ''}
                                            />
                                            <span className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                <img src={showConfirmPassword ? eyeOpen : eyeClosed} alt="Toggle password visibility" />
                                            </span>
                                        </div>
                                        {formErrors.confirmPassword && <span className="error-message">{formErrors.confirmPassword}</span>}
                                        {formErrors.passwordMatch && <span className="error-message">{formErrors.passwordMatch}</span>}
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
