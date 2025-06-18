    import React from 'react';
    import './PatientIntro.css';
    import HomeAdults from '../../../assets/home.png';

    interface PatientIntroProps {
    onContinue: () => void;
    }

    const PatientIntro: React.FC<PatientIntroProps> = ({ onContinue }) => {
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
            <button className="btn-completar" onClick={onContinue}>
            Completar Registro
            </button>
            <button className="btn-omitir" onClick={() => window.location.replace('/user/dashboard')}>
            Omitir
            </button>
        </div>
        </div>
    );
    };

    export default PatientIntro;
