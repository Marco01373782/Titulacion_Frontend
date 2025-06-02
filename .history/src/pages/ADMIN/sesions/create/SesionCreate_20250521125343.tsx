    import React, { useState, useEffect } from 'react';
    import {
    createSession,
    fetchDifficulties,
    assignActivitiesAuto,
    fetchAllActivities,
    assignActivitiesManual
    } from '../../../../services/ApiService';
    import { useNavigate } from 'react-router-dom';
    import Activity
    import './SesionCreate.css';

    interface Difficulty {
    id: number;
    name: string;
    }

    interface Activity {
    id: number;
    title: string;
    type: { name: string };
    difficulty: { id: number };
    }

    const SesionCreate: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [difficultyId, setDifficultyId] = useState<number | null>(null);
    const [difficulties, setDifficulties] = useState<Difficulty[]>([]);
    const [mensaje, setMensaje] = useState('');
    const [sesionId, setSesionId] = useState<number | null>(null);

    const [activities, setActivities] = useState<Activity[]>([]);
    const [selectedActivityIds, setSelectedActivityIds] = useState<number[]>([]);
    const [showManualSelect, setShowManualSelect] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchDifficulties()
        .then((res) => setDifficulties(res.data))
        .catch(() => setMensaje('Error al cargar dificultades'));
    }, []);

    useEffect(() => {
        if (sesionId) {
        fetchAllActivities()
            .then((res) => setActivities(res.data))
            .catch(() => setMensaje('Error al cargar actividades'));
        }
    }, [sesionId]);

    const handleAsignarManual = () => {
        if (!sesionId) return;
        setShowManualSelect(true);
    };

    const handleAsignarAuto = () => {
        if (!sesionId) return;

        assignActivitiesAuto(sesionId)
        .then(() => {
            setMensaje('Actividades asignadas automáticamente');
            setTimeout(() => {
            navigate('/app/gestionar-sesiones');
            }, 1000);
        })
        .catch(() => setMensaje('Error al asignar actividades automáticamente'));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!difficultyId) {
        setMensaje('Selecciona una dificultad');
        return;
        }

        const sesionPayload = {
        title,
        description,
        difficulty: { id: difficultyId }
        };

        createSession(sesionPayload)
        .then((res) => {
            setSesionId(res.data.id);
            setMensaje('Sesión creada exitosamente');
        })
        .catch(() => setMensaje('Error al crear la sesión'));
    };

    const filteredActivities = activities.filter(
        (a) => a.difficulty?.id === difficultyId
    );

    return (
        <div className="sesion-create-container">
        <h2>Crear nueva sesión</h2>
        <form onSubmit={handleSubmit} className="sesion-form">
            <label>Título:</label>
            <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            />

            <label>Descripción:</label>
            <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            />

            <label>Dificultad:</label>
            <select
            value={difficultyId || ''}
            onChange={(e) => setDifficultyId(Number(e.target.value))}
            required
            >
            <option value="" disabled>Selecciona una dificultad</option>
            {difficulties.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
            ))}
            </select>

            <button type="submit">Crear sesión</button>
        </form>

        {sesionId && (
            <div className="asignar-buttons">
            <button onClick={handleAsignarManual}>Asignar manualmente</button>
            <button onClick={handleAsignarAuto}>Asignar automáticamente</button>
            </div>
        )}

        {showManualSelect && (
            <ActivitySelector
            activities={filteredActivities}
            selectedActivityIds={selectedActivityIds}
            onClose={() => setShowManualSelect(false)}
            onConfirm={(selectedIds) => {
                if (!sesionId || selectedIds.length === 0) {
                setMensaje('Selecciona al menos una actividad');
                return;
                }

                assignActivitiesManual(sesionId, selectedIds)
                .then(() => {
                    setMensaje('Actividades asignadas manualmente');
                    setShowManualSelect(false);
                    setTimeout(() => {
                    navigate('/app/gestionar-sesiones');
                    }, 1000);
                })
                .catch(() => setMensaje('Error al asignar manualmente'));
            }}
            />
        )}

        {mensaje && <p className="mensaje">{mensaje}</p>}
        </div>
    );
    };

    export default SesionCreate;
