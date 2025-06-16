        import React, { useEffect, useState } from 'react';
        import { getResultadosActividadPorSesionYUsuario } from '../../../services/ApiService';
        import ActivityResultTable from './ActivityResultTable';

        interface SesionUsuarioDTO {
        id: number;
        sesionId: number;
        userId: number;
        result?: number;
        }

        interface ActivityResult {
        activity: {
            id: number;
        };
        result?: number;
        durationSeconds?: number;
        completedAt?: string;
        }

        interface Props {
        sesion: SesionUsuarioDTO;
        userId: string;
        }

        const SesionCard: React.FC<Props> = ({ sesion, userId }) => {
        const [activityResults, setActivityResults] = useState<ActivityResult[]>([]);
        const [showDetails, setShowDetails] = useState(false);

        useEffect(() => {
    const fetchActivityResults = async () => {
        try {
        console.log('Fetch results for sessionId:', sesion.sesionId, 'userId:', userId);
        const data = await getResultadosActividadPorSesionYUsuario(sesion.sesionId, userId);
        setActivityResults(data.data);
        } catch (error) {
        console.error('Error cargando resultados de actividades', error);
        }
    };

    if (showDetails) {
        fetchActivityResults();
    }
    }, [showDetails, sesion.sesionId, userId]);

  
}

        return (
            <div className="sesion-card">
            <div className="card-header" onClick={() => setShowDetails(!showDetails)}>
                <strong>Sesión #{sesion.sesionId}</strong>
                <span>📈 Puntaje: {sesion.result ?? '-'}</span>
            </div>
            {showDetails && <ActivityResultTable results={activityResults} />}
            </div>
        );
        };

        export default SesionCard;
