import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './register.css';
import logo from '../../../assets/logoprincipal.png';
import google from '../../../assets/google.svg';
import registerImage from '../../../assets/register.png';
import facebook from '../../../assets/facebook.svg';
import ApiServ

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

  useEffect(() => {
    ApiService.get('/parentescos')
      .then(response => setParentescos(response.data))
      .catch(() => setParentescos([]));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = () => {
    setErrorMessage('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

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
          setErrorMessage(error.response.data); // mensaje desde el backend
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
            <div className="input-group">
              <label>Nombre *</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Nombre" />
            </div>
            <div className="input-group">
              <label>Apellido *</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Apellido" />
            </div>
          </div>

          <div className="input-group full-width">
            <label>Email *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
          </div>

          <div className="row-input">
            <div className="input-group full-width">
              <label>Parentesco *</label>
              <select name="parentescoId" value={formData.parentescoId} onChange={handleChange}>
                <option value="">Selecciona</option>
                {parentescos.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="row-input">
            <div className="input-group">
              <label>Contraseña *</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Contraseña" />
            </div>
            <div className="input-group">
              <label>Repetir Contraseña *</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Repetir Contraseña" />
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
