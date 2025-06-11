// src/pages/User/SesionRunner.tsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
    saveSessionActivityResult,
    updateSesionUsuarioStatus,
    updateSesionUsuario
} from '../../../services/ApiService';
import activityComponentsMap from '../activityComponentsMap';

const SesionRunner: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const session = location.state?.session || JSON.parse(localStorage.getItem('selectedSession') || 'null');
    const initialActivities = location.state?.activities || JSON.parse(localStorage.getItem('selectedActivities') || '[]');
    const [sesionStartTime, setSesionStartTime] = useState<Date | null>(null);
    const [activities, setActivities] = useState<any[]>(initialActivities);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(initialActivities.length === 0);
    const [activityScore, setActivityScore] = useState<number | null>(null);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [durations, setDurations] = useState<number[]>([]);
    const [scores, setScores] = useState<number[]>([]);

    const userId = Number(localStorage.getItem('userId'));
    console.log("Usuario ID cargado", userId);
    const sesionUsuarioId = Number(localStorage.getItem('selectedSesionUsuarioId'));
    console.log("🧠 SesionUsuarioId cargado:", sesionUsuarioId);

    
};

    if (isLoading) return <div>Cargando sesión...</div>;
    if (!activities.length) return <div>No hay actividades para esta sesión.</div>;

    const wrapper = activities[currentIndex];
    const activity = wrapper.activity || wrapper;
    const resourceUrl = activity.resourceUrl;
    const ActivityComponent = activityComponentsMap[resourceUrl];

    if (!ActivityComponent) {
        return <div>No se encontró el componente para: {resourceUrl}</div>;
    }

    return (
        <div className="sesion-runner">
            <h2>
                Sesión: {session?.title} | Actividad {currentIndex + 1} de {activities.length}
            </h2>

            <div className="actividad-container">
                <ActivityComponent onFinish={handleFinishActivity} />
            </div>

            {activityScore !== null && (
                <div className="post-actividad">
                    <p>Puntaje obtenido: {activityScore}</p>
                    <button onClick={handleNext}>
                        {currentIndex < activities.length - 1 ? 'Continuar' : 'Terminar sesión'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default SesionRunner;
