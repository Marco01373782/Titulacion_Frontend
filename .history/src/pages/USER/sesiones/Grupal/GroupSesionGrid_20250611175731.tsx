    // src/pages/User/GroupSesionGrid.tsx
    import { useEffect, useState } from 'react';
    import { fetchAllSessions, fetchActivitiesBySession } from '../../../../services/ApiService';
    import './GroupSesionGrid.css';

    const GroupSesionGrid = () => {
    const [sesiones, setSesiones] = useState([]);

    useEffect(() => {
        fetchAllSessions().then(setSesiones);
    }, []);

    const handleClickSesion = (sesionId: number) => {
        window.location.href = `/app/Sesiones/Grupal/${sesionId}`;
    };

    return (
        <div className="group-grid-container">
        <h2>Modo Grupal: Selecciona una sesión</h2>
        <div className="group-grid">
            {sesiones.map((sesion) => (
            <div key={sesion.id} className="group-grid-item" onClick={() => handleClickSesion(sesion.id)}>
                <p>{sesion.nombre}</p>
            </div>
            ))}
        </div>
        </div>
    );
    };

    export default GroupSesionGrid;
