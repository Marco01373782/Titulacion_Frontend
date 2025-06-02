import './PatientIntro.css';
import logoprincipal from '../../../assets/logoprincipal.png';
import patientImg from '../../../assets/patientIntro.png'; // <-- la imagen que mencionaste
import { useNavigate } from 'react-router-dom';

const PatientIntro = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="header">
        <img src={logoprincipal} alt="logo" className="logo" />
      </div>

      <div className="centro">
        <h2 className="tittle">¡Hola! ¿Primera vez por aquí?</h2>
        <img src={patientImg} alt="paciente" />
        <p className="text">
          Estamos felices de tenerte aquí. Antes de comenzar, por favor completa los datos de tu paciente.
        </p>
        <p className="text">
          Queremos acompañar a nuestros adultos mayores en su bienestar cognitivo,<br />
          y tú eres parte esencial de este camino.
        </p>
        <div style={{ display: 'flex', gap: '20px' }}>
          <button className="login" onClick={() => navigate('/register-patient')}>
            Completar Registro
          </button>
          <button className="contactos" onClick={() => navigate('/home')}>
            Omitir
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientIntro;
