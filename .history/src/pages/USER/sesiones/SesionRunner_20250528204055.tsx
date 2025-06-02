    // pages/Generals/USER/SesionRunner.tsx
    import React, { useEffect, useState } from 'react';
    import { useParams } from 'react-router-dom';
    import { fetchActivitiesBySession, postSessionActivityResult } from '../../../services/ApiService';
    import MemoriaTest from '../../../actividades/memoria/MemoriaTest'; // Ejemplo de componente
    // Agrega otros componentes según tipo

    const userId = 1; // Simulado

    interface Activity {
    id: number;
    title: string;
    description: string;
    resourceUrl: string;
    }

    const SesionRunner: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (id) {
        fetchActivitiesBySession(Number(id))
            .then((res) => setActivities(res.data))
            .catch((err) => console.error(err));
        }
    }, [id]);

    const handleComplete = (result: string) => {
        const activity = activities[currentIndex];
        const payload = {
        sesion: { id: Number(id) },
        activity: { id: activity.id },
        user: { id: userId },
        result
        };
        postSessionActivityResult(payload)
        .then(() => {
            if (currentIndex < activities.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            } else {
            alert('Sesión completada');
            // Redirigir si deseas
            }
        })
        .catch((err) => console.error(err));
    };

    const currentActivity = activities[currentIndex];

    return (
        <div style={{ padding: '20px' }}>
        <h2>Ejecutando sesión {id}</h2>
        {currentActivity ? (
            <>
            <h3>{currentActivity.title}</h3>
            {/* Aquí cargas el componente correcto según el tipo */}
            <ActividadMemoria
                resourceUrl={currentActivity.resourceUrl}
                onComplete={handleComplete}
            />
            </>
        ) : (
            <p>Cargando actividad...</p>
        )}
        </div>
    );
    };

    export default SesionRunner;
