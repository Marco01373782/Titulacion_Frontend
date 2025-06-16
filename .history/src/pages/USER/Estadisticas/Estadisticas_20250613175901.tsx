    import { useEffect, useState } from 'react';
    import { getSesionesUsuario } from '../../../services/ApiService';
    import './Estadisticas.css';
    import SesionCard from './SesionCard';

    interface SesionUsuarioDTO {
    id: number;
    sesionId: number;
    userId: number;
    status: string;
    startedAt?: string;
    endedAt?: string;
    sessionDurationSeconds?: number;
    result?: number;
    mode?: string;
    date?: string;
    }

    const Estadisticas = () => {
    const [sesiones, setSesiones] = useState<SesionUsuarioDTO[]>([]);
    const userId = localStorage.getItem('userId') || '';

    useEffect(() => {
        const fetchData = async () => {
        if (userId) {
            const response = await getSesionesUsuario(userId);
            setSesiones(response.data);
        }
        };

        fetchData();
    }, [userId]);

    return (
        <div className="estadisticas-container">
        <h2>📊 Resultados de tus sesiones</h2>{}
        .filter((s) => s.status === 'COMPLETADA' || s.result !== null) // Asegúrate del criterio real
  .map((sesion) => (
        </div>
    );
    };

    export default Estadisticas;
