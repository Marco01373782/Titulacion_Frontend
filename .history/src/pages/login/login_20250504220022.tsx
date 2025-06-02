import { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logoprincipal.png';
import login from '../../assets/login.png'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // Aquí puedes hacer tu lógica de login con Axios
    if (email === 'admin' && password === '1234') {
      alert('Login exitoso');
      navigate('/home'); // Reemplaza con tu ruta real
    } else {
      alert('Credenciales incorrectas');
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
        <img className='imagen' src= {login} alt="Imagen"  />
      </div>

      <div className="right-panel">
        div.login
        <img src={logo} alt="Logo" className="logo-login" />
        <div className="login-form">
          <h2>Iniciar Sesión</h2>

          <label>Email *</label>
          <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <label>Contraseña *</label>
          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />

          <button className="login-button" onClick={handleLogin}>INICIAR SESIÓN</button>
        </div>

        <button className="back-button" onClick={() => navigate('/')}>Regresar</button>
      </div>
    </div>
  );
};

export default Login;
