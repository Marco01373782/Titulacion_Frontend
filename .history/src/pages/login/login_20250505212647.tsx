import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import logo from '../../assets/logoprincipal.png';
import loginImg from '../../assets/login.png';
import google from '../../assets/google.svg';
import facebook from '../../assets/facebook.svg';

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email === 'admin' && password === '1234') {
      alert('Login exitoso');
      navigate('/');
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
        <img className="imagen" src={loginImg} alt="Bienvenida" />
      </div>

      <div className="right-panel">
        <form className="login-form" onSubmit={handleLogin}>
          <img src={logo} alt="Logo" className="logo-login" />
          <h2>Iniciar Sesión</h2>

          <div className="question">
            <p>¿Es tu primera vez?</p>
            <button type="button" className="registrar" onClick={() => alert("Redirigir a registro")}>
              Regístrate
            </button>
          </div>

          <div className="input-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña *</label>
            <input
              id="password"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="recuperar">
            <button type="button" onClick={() => alert("Función no implementada")}>
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button type="submit" className="login-button">
            INICIAR SESIÓN
          </button>

          <div className="alert">
            <p>Al registrarte aceptas nuestras Condiciones de uso y Políticas de Privacidad</p>
          </div>

          <div className="otros">
            <p>O conéctate con</p>
            <div className="logos">
              <img src={google} alt="Google" className="logo-social" />
              <img src={facebook} alt="Facebook" className="logo-social" />
            </div>
          </div>
        </form>

        <button className="back-button" onClick={() => navigate('/')}>
          Regresar
        </button>
      </div>
    </div>
  );
};

export default Login;
