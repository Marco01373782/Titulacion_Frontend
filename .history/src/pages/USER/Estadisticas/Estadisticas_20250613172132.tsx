        import React, { useEffect, useState } from 'react';
        import { getSesionesUs
        import './Estadisticas.css';
        import SesionCard from './SesionCard';

        const Estadisticas = () => {
        const [sesiones, setSesiones] = useState([]);
        const userId = localStorage.getItem('userId');

        useEffect(() => {
            const fetchData = async () => {
            if (userId) {
                const data = await getSesionesUsuario(userId);
                setSesiones(data);
            }
            };
            fetchData();
        }, [userId]);

        return (
            <div className="estadisticas-container">
            <h2>📊 Resultados de tus sesiones</h2>
            {sesiones.map((sesion) => (
                <SesionCard key={sesion.id} sesion={sesion} userId={userId} />
            ))}
            </div>
        );
        };

        export default Estadisticas;
