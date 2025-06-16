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

        console.log('UserId recibido por prop en SesionCard:', userId);


            useEffect(() => {
    const fetchActivityResults = async () => {
        const sessionId = sesion.sesionId ?? sesion.id;

        if (!sessionId || !userId) {
        console.warn('Sesión o userId no definidos, no se hará la petición');
        console.log('sessionId:', sessionId, 'userId:', userId);
        return;
        }

        try {
        console.log('🔍 Fetching resultados para: sessionId =', sessionId, 'userId =', userId);
        const data = await getResultadosActividadPorSesionYUsuario(sessionId, userId);
        setActivityResults(data.data);
        } catch (error) {
        console.error('❌ Error cargando resultados de actividades', error);
        }
    };

    if (showDetails) {
        fetchActivityResults();
    }
    }, [showDetails, sesion, userId]);

        
            return (
                <div className="sesion-card">
                <div className="card-header" onClick={() => setShowDetails(!showDetails)}>
                    <strong>Sesión #{sesion.id}</strong>
                    <span>📈 Puntaje: {sesion.result ?? '-'}</span>
                </div>
                {showDetails && <ActivityResultTable results={activityResults} />}
                </div>
            );
            };

            export default SesionCard;
