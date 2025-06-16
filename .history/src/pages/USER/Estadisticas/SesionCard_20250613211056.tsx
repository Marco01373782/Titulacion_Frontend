    import React, { useEffect, useState } from 'react';
    import { getResultadosActividadPorSesionYUsuario } from '../../../services/ApiService';
    import ActivityResultTable from './ActivityResultTable';
    import './SesionCard.css';

    interface SesionUsuarioDTO {
    id: number;
    sesionId: number;
    userId: number;
    result?: number;
    }

    interface ActivityResult {
    activity: { id: number };
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
    const [showModal, setShowModal] = useState(false);

    const getResultColor = (score?: number) => {
        if (score === undefined || score === null) return '';
        if (score >= 80) return 'result-green';
        if (score >= 50) return 'result-orange';
        return 'result-green';
    };

    useEffect(() => {
        const fetchActivityResults = async () => {
        if (showModal) {
            try {
            const sessionId = sesion.sesionId ?? sesion.id;
            const data = await getResultadosActividadPorSesionYUsuario(sessionId, userId);
            setActivityResults(data.data);
            } catch (error) {
            console.error('❌ Error al cargar resultados de actividades', error);
            }
        }
        };

        fetchActivityResults();
    }, [showModal, sesion, userId]);

    return (
        <>
        <div className="sesion-card" onClick={() => setShowModal(true)}>
            <div className={`result-circle ${getResultColor(sesion.result)}`}>
            {sesion.result ?? '-'}
            </div>
            <div>Sesión #{sesion.id}</div>
        </div>

        {showModal && (
            <div className="modal-background">
            <div className="modal-content">
                <button className="close-button" onClick={() => setShowModal(false)}>✖</button>
                <h3>Detalles de la sesión #{sesion.sesionId}</h3>
                {activityResults.length > 0 ? (
                <ActivityResultTable results={activityResults} />
                ) : (
                <p>Esta sesión aún no ha sido completada con resultados.</p>
                )}
            </div>
            </div>
        )}
        </>
    );
    };

    export default SesionCard;
