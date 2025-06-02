    // pages/Generals/USER/SesionGrid.tsx
    import React, { useEffect, useState } from 'react';
    import { fetchSessionsByUser } from '../../../services/ApiService';
    import { useNavigate } from 'react-router-dom';
    import './SesionGrid.css';

    interface Sesion {
    id: number;
    title: string;
    completed?: boolean;
    }

    const userId = 1; // Reemplaza con tu lógica de usuario autenticado

    const SesionGrid: React.FC = () => {
    const [sesiones, setSesiones] = useState<Sesion[]>([]);
    const [selectedSesion, setSelectedSesion] = useState<Sesion | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSessionsByUser(userId)
        .then((res) => setSesiones(res.data))
        .catch((err) => console.error(err));
    }, []);

    const handleStartSesion = () => {
        if (selectedSesion) {
        navigate(`/app/ejecutar-sesion/${selectedSesion.id}`);
        }
    };

    return (
        <div className="sesion-grid-container">
        <h2>Sesiones Individuales</h2>
        <div className="circle-grid">
            {sesiones.map((s) => (
            <div
                key={s.id}
                className={`circle ${s.completed ? 'completed' : ''}`}
                onClick={() => setSelectedSesion(s)}
            >
                {s.id}
            </div>
            ))}
        </div>

        {selectedSesion && (
            <div className="modal">
            <div className="modal-content">
                <h3>{selectedSesion.title}</h3>
                <button onClick={handleStartSesion}>Iniciar Sesión</button>
                <button onClick={() => setSelectedSesion(null)}>Cancelar</button>
            </div>
            </div>
        )}
        </div>
    );
    };

    export default SesionGrid;
