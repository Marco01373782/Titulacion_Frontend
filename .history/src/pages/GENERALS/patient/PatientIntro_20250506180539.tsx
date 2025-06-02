        import './PatientIntro.css';
        
        import HomeAdults from '../../../assets/home.png' // <-- la imagen que mencionaste
        import { useNavigate } from 'react-router-dom';

        const PatientIntro = () => {
        const navigate = useNavigate();

        return (
            <div className="container-welcome">

    <h2 className="title-welcome">¡Hola! ¿Primera vez por aquí?</h2>
    
    
    <p className="subtitle-welcome">
        Estamos felices de tenerte aquí. Antes de comenzar, por favor completa los datos de tu paciente.
    </p>
    <img src={HomeAdults} alt="paciente" className="image-welcome" />
    <p className="description-welcome">
        Queremos acompañar a nuestros adultos mayores en su bienestar cognitivo,<br />
        y tú eres parte esencial de este camino.
    </p>

    <div className="buttons-welcome">
        <button className="btn-completar" onClick={() => navigate('/home')}>
        Completar Registro
        </button>
        <button className="btn-omitir" onClick={() => navigate('/')}>
        Omitir
        </button>
    </div>
    </div>

        );
        };

        export default PatientIntro;
