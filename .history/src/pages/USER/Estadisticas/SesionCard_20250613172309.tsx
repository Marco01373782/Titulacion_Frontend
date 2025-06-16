    import React, { useState } from 'react';
    import { getResultadosActividadPorSesionYUsuario } from '../../../services/ApiService';
    import ActivityResultTable from './ActivityResultTable';

    const SesionCard = ({ sesion, userId }) => {
    const [showDetails, setShowDetails] = useState(false);
    const [activityResults, setActivityResults] = useState([]);

    const toggleDetails = async () => {
        if (!showDetails) {
        const data = await getResultadosActividadPorSesionYUsuario(sesion.sesionId, userId);
        setActivityResults(data);
        }
        setShowDetails(!showDetails);
    };

    return (
        <div className="sesion-card">
        <div className="sesion-header" onClick={toggleDetails}>
            <h3>🧠 Sesión #{sesion.sesionId} | {sesion.date}</h3>
            <p>Resultado: {sesion.result ?? 'N/A'} | Tiempo: {sesion.sessionDurationSeconds ?? '-'}s</p>
        </div>
        {showDetails && <ActivityResultTable results={activityResults} />}
        </div>
    );
    };

    export default SesionCard;
