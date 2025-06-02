    import React, { useState, useEffect } from 'react';
    import {
    createSession,
    fetchDifficulties,
    assignActivitiesAuto,
    fetchAllActivities,
    assignActivitiesManual,
    } from '../../../../services/ApiService';
    import { useNavigate } from 'react-router-dom';
    import ActivitySelector from '../../../../components/modal/Activity-Selector/ActivitySelector';
    import LoadingOverlay from '../../../../components/modal/Loading/LoadingOverlay';
    import Toast from '../../../../components/toast/Toast';
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
    const [sesionId, setSesionId] = useState<number | null>(null);

    const [activities, setActivities] = useState<Activity[]>([]);
    const [selectedActivityIds] = useState<number[]>([]);
    const [showManualSelect, setShowManualSelect] = useState(false);

    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchDifficulties()
        .then((res) => setDifficulties(res.data))
        .catch(() => setToast({ message: 'Error al cargar dificultades', type: 'error' }));
    }, []);

    useEffect(() => {
        if (sesionId) {
        fetchAllActivities()
            .then((res) => setActivities(res.data))
            .catch(() => setToast({ message: 'Error al cargar actividades', type: 'error' }));
        }
    }, [sesionId]);

    const handleAsignarManual = () => {
        if (!sesionId) return;
        setShowManualSelect(true);
    };

    const handleAsignarAuto = () => {
        if (!sesionId) return;

        setLoading(true);
        setLoadingMessage('Asignando actividades...');

        assignActivitiesAuto(sesionId)
        .then(() => {
            setToast({ message: 'Actividades asignadas automáticamente', type: 'success' });
            setTimeout(() => {
            setLoading(false);
            navigate('/app/gestionar-sesiones');
            }, 1000);
        })
        .catch(() => {
            setToast({ message: 'Error al asignar actividades automáticamente', type: 'error' });
            setLoading(false);
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!difficultyId) {
        setToast({ message: 'Selecciona una dificultad', type: 'error' });
        return;
        }

        setLoading(true);
        setLoadingMessage('Creando sesión...');

        const sesionPayload = {
        title,
        description,
        difficulty: { id: difficultyId },
        };

        createSession(sesionPayload)
        .then((res) => {
            setSesionId(res.data.id);
            setToast({ message: 'Sesión creada exitosamente', type: 'success' });
            setLoading(false);
        })
        .catch(() => {
            setToast({ message: 'Error al crear la sesión', type: 'error' });
            setLoading(false);
        });
    };

    const filteredActivities = activities.filter((a) => a.difficulty?.id === difficultyId);

    return (
        <div className="sesion-create-container">
        <h2>Crear nueva sesión</h2>

        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        <form onSubmit={handleSubmit} className="sesion-form">
            <label>Título:</label>
            <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading}
            />

            <label>Descripción:</label>
            <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            disabled={loading}
            />

            <label>Dificultad:</label>
            <select
            value={difficultyId || ''}
            onChange={(e) => setDifficultyId(Number(e.target.value))}
            required
            disabled={loading}
            >
            <option value="" disabled>
                Selecciona una dificultad
            </option>
            {difficulties.map((d) => (
                <option key={d.id} value={d.id}>
                {d.name}
                </option>
            ))}
            </select>

            <button type="submit" disabled={loading}>
            Crear sesión
            </button>
        </form>

        {sesionId && (
            <div className="texto"></div>
            <div className="asignar-buttons">
            <button onClick={handleAsignarManual} disabled={loading}>
                Asignar manualmente
            </button>
            <button onClick={handleAsignarAuto} disabled={loading}>
                Asignar automáticamente
            </button>
            </div>
        )}

        {showManualSelect && sesionId && (
            <ActivitySelector
            activities={filteredActivities}
            selectedActivityIds={selectedActivityIds}
            onClose={() => setShowManualSelect(false)}
            onConfirm={(selectedIds) => {
                if (selectedIds.length === 0) {
                setToast({ message: 'Selecciona al menos una actividad', type: 'error' });
                return;
                }

                setLoading(true);
                setLoadingMessage('Asignando actividades...');

                assignActivitiesManual(sesionId, selectedIds)
                .then(() => {
                    setToast({ message: 'Actividades asignadas manualmente', type: 'success' });
                    setShowManualSelect(false);
                    setLoading(false);
                    setTimeout(() => {
                    navigate('/app/gestionar-sesiones');
                    }, 1000);
                })
                .catch(() => {
                    setToast({ message: 'Error al asignar manualmente', type: 'error' });
                    setLoading(false);
                });
            }}
            loading={loading}
            />
        )}

        {/* Loading Overlay en toda la pantalla */}
        <LoadingOverlay visible={loading} message={loadingMessage} />
        </div>
    );
    };

    export default SesionCreate;
