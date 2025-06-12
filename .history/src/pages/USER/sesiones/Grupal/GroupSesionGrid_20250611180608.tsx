    // src/pages/User/GroupSesionGrid.tsx
    import { useEffect, useState } from 'react';
    import { fetchAllSessions } from '../../../../services/ApiService';
    import './GroupSesionGrid.css';

    const GroupSesionGrid = () => {
    const [sesiones, setSesiones] = useState<any[]>([]);

    useEffect(() => {
        fetchAllSessions().then((res) => setSesiones(res.data));
    }, []);

    const handleClickSesion = (sesionId: number) => {
        window.location.href = `/user/${sesionId}`;
    };

    return (
        <div className="group-grid-container">
        <h2 className="title">Modo Grupal: Selecciona una sesión</h2>
        <div className="group-grid">
            {sesiones.map((sesion) => (
            <div
                key={sesion.id}
                className="group-grid-item"
                onClick={() => handleClickSesion(sesion.id)}
            >
                <h3>{sesion.nombre}</h3>
                <p>{sesion.descripcion}</p>
            </div>
            ))}
        </div>
        </div>
    );
    };

    export default GroupSesionGrid;
