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
            <img className='imagen' src= {login} alt="Imagen"  />
        </div>

        <div className="right-panel">
            <div className="login-form">
                <img src={logo} alt="Logo" className="logo-login" />
            
                    <h2>Iniciar Sesión</h2>
                <div className="question">
                    <p>¿Es tu primera ves?</p>
                    <p className='registrar'>Registrate</p>
                </div>
                <div className="email">
                    <label>Email *</label>
                    <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="password">
                    <label>Contraseña *</label>
                    <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="recuperar">
                    <p>¿Olvidaste tu Contraseña?</p>
                </div>

                <button className="login-button" onClick={handleLogin}>INICIAR SESIÓN</button>
                <div className="alert">
                    <p>Al registrarte aceptas nuestras Condiciones de uso y Politicas de Privacidad</p>
                </div>
                            <div className="otros">
                                <p>O Conectate con</p>
                                <div className="logos">
                                <img src={logo} alt="Logo" className="logo-login" />
                                <img src={logo} alt="Logo" className="logo-login" />
                                </div>
                            </div>

            </div>
        
            <button className="back-button" onClick={() => navigate('/')}>Regresar</button>
        </div>
        </div>
    );
    };

    export default Login;
