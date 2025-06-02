    import { useState } from 'react';
    import './register.css';
    import { useNavigate } from 'react-router-dom';
    import logo from '../../assets/logoprincipal.png';
    import google from '../../assets/google.svg';
    import register from '../../assets/register.png'
    import facebook from '../../assets/facebook.svg';

    const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        relationship: '',
        password: '',
        confirmPassword: '',
    });

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = () => {
        if (formData.password !== formData.confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
        }
        
        alert('Registro exitoso');
        // Aquí puedes enviar datos al backend
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
                <input type="text" name="firstName" placeholder="Nombre" value={formData.firstName} onChange={handleChange} />
                </div>
                <div className="input-group">
                <label>Apellido *</label>
                <input type="text" name="lastName" placeholder="Apellido" value={formData.lastName} onChange={handleChange} />
                </div>
            </div>

            <div className="input-group full-width">
                <label>Email *</label>
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
            </div>

            <div className="row-input">
                <div className="input-group">
                <label>Teléfono *</label>
                <input type="text" name="phone" placeholder="Telefono" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="input-group">
                <label>Parentesco *</label>
                <select name="relationship" value={formData.relationship} onChange={handleChange}>
                    <option value="">Selecciona</option>
                    <option value="Padre">Padre</option>
                    <option value="Madre">Madre</option>
                    <option value="Hermano">Hermano</option>
                    <option value="Otro">Otro</option>
                </select>
                </div>
            </div>

            <div className="row-input">
                <div className="input-group">
                <label>Contraseña *</label>
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                </div>
                <div className="input-group">
                <label>Repetir Contraseña *</label>
                <input type="password" name="confirmPassword" placeholder="Password" value={formData.confirmPassword} onChange={handleChange} />
                </div>
            </div>

            <button className="register-button"  onClick={handleRegister}>REGISTRARSE</button>

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
            <button className="back" onClick={() => navigate('/home')}>Regresar</button>
        </div>

        <div className="right-panel-register">
            <h1>Renova Mind</h1>
            <p>
            Comienza hoy el viaje hacia una mente más activa y llena de vida. 
             Regístrate y renueva tu bienestar. 
            </p>
            <img className="imagen" src={register} alt="Imagen de bienvenida" />
        </div>
        </div>
    );
    };

    export default Register;
