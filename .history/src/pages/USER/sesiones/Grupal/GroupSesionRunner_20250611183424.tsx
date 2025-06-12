    import React, { useEffect, useState } from 'react';
    import { useParams } from 'react-router-dom';
    import ApiService from '../../../../services/ApiService';
    import activityComponentsMap from '../../../ruta/del/map/activityComponentsMap'; // Ajustá la ruta

    const GroupSesionRunner: React.FC = () => {
    const { sesionId } = useParams();
    const [activities, setActivities] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isFinished, setIsFinished] = useState<boolean>(false);

    useEffect(() => {
        const fetchActivities = async () => {
        try {
            const response = await ApiService.get(`/session-activities/by-session/${sesionId}`);
            setActivities(response.data);
        } catch (error) {
            console.error('Error al cargar actividades de la sesión:', error);
        }
        };

        fetchActivities();
    }, [sesionId]);

    const handleFinishActivity = () => {
        if (currentIndex < activities.length - 1) {
        setCurrentIndex(currentIndex + 1);
        } else {
        setIsFinished(true);
        }
    };

    const activity = activities[currentIndex]?.activity;
    const resourceUrl = activity?.resourceUrl;
    const CurrentActivity = activityComponentsMap[resourceUrl];

    return (
        <div>
        {!isFinished ? (
            CurrentActivity ? (
            <CurrentActivity onFinish={handleFinishActivity} />
            ) : (
            <p>Cargando actividad...</p>
            )
        ) : (
            <div>
            <h2>¡Sesión completada!</h2>
            <p>Gracias por participar 💪🧠</p>
            </div>
        )}
        </div>
    );
    };

    export default GroupSesionRunner;
