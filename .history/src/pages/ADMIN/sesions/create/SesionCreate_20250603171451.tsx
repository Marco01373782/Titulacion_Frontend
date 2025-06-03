        import React, { useState, useEffect } from 'react';
        import { Activity } from '../../../../Types/ActivityTypes';

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

        type GroupedActivities = Record<string, Activity[]>;

        const SesionCreate: React.FC = () => {
        const [title, setTitle] = useState('');
        const [description, setDescription] = useState('');
        const [difficulty, setDifficulty] = useState('');
        const [difficulties, setDifficulties] = useState<string[]>([]);
        const [sesionId, setSesionId] = useState<number | null>(null);

        const [activities, setActivities] = useState<Activity[]>([]);

        const [groupedActivities, setGroupedActivities] = useState<GroupedActivities>({});

        const [selectedActivityIds, setSelectedActivityIds] = useState<number[]>([]);

        const [showManualSelect, setShowManualSelect] = useState(false);

        const [loading, setLoading] = useState(false);
        const [loadingMessage, setLoadingMessage] = useState('');

        const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

        const navigate = useNavigate();

        // Cargar dificultades al montar
        useEffect(() => {
            fetchDifficulties()
            .then((res) => {
                setDifficulties(res.data);
            })
            .catch(() => setToast({ message: 'Error al cargar dificultades', type: 'error' }));
        }, []);

        // Cargar actividades cuando ya hay sesion creada
        useEffect(() => {
            if (sesionId) {
            fetchAllActivities()
                .then((res) => {
                setActivities(res.data);
                })
                .catch(() => setToast({ message: 'Error al cargar actividades', type: 'error' }));
            }
        }, [sesionId]);

        // Agrupar actividades filtradas por dificultad y por tipo
        useEffect(() => {
    if (!difficulty) {
        setGroupedActivities({});
        return;
    }

    console.log('🔍 Todas las actividades:', activities);

    const filtered = activities.filter((a) => {
        const valido = a.difficulty === difficulty && a.type && a.type.name;
        if (!valido) {
        console.warn('⚠️ Actividad filtrada por no tener tipo válido:', a);
        }
        return valido;
    });

    console.log('✅ Actividades filtradas:', filtered);

    const grouped = filtered.reduce((groups: GroupedActivities, activity) => {
        const typeName = activity.type?.name || 'Tipo desconocido';
        if (!groups[typeName]) groups[typeName] = [];
        groups[typeName].push(activity);
        return groups;
    }, {} as GroupedActivities);

    setGroupedActivities(grouped);

    setSelectedActivityIds([]);
    }, [activities, difficulty]);


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
                navigate('/admin/gestionar-sesiones');
                }, 1000);
            })
            .catch(() => {
                setToast({ message: 'Error al asignar actividades automáticamente', type: 'error' });
                setLoading(false);
            });
        };

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            if (!difficulty) {
            setToast({ message: 'Selecciona una dificultad', type: 'error' });
            return;
            }

            setLoading(true);
            setLoadingMessage('Creando sesión...');

            const sesionPayload = {
            title,
            description,
            difficulty,
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
                disabled={loading || !!sesionId}
                />

                <label>Descripción:</label>
                <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                disabled={loading || !!sesionId}
                />

                <label>Dificultad:</label>
                <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                required
                disabled={loading || !!sesionId}
                >
                <option value="" disabled>
                    Selecciona una dificultad
                </option>
                {difficulties.map((name) => (
                    <option key={name} value={name}>
                    {name}
                    </option>
                ))}
                </select>

                {!sesionId && (
                <button type="submit" disabled={loading}>
                    Crear sesión
                </button>
                )}
            </form>

            {sesionId && (
                <>
                <h3 className="asignar-title">Asignar actividades para la sesión</h3>
                <div className="asignar-buttons">
                    <button onClick={handleAsignarManual} disabled={loading}>
                    Asignar manualmente
                    </button>
                    <button onClick={handleAsignarAuto} disabled={loading}>
                    Asignar automáticamente
                    </button>
                </div>
                </>
            )}

            {showManualSelect && sesionId && (
                <ActivitySelector
                activitiesByType={groupedActivities}
                selectedActivityIds={selectedActivityIds}
                onSelectionChange={setSelectedActivityIds}
                onClose={() => setShowManualSelect(false)}
                onConfirm={(selectedIds) => {
                    // Validar que haya al menos una actividad seleccionada por cada tipo:
                    const tiposNecesarios = Object.keys(groupedActivities);
                    const tiposSeleccionados = new Set(
                    activities
                        .filter((a) => selectedIds.includes(a.id))
                        .map((a) => a.type.name)
                    );

                    if (selectedIds.length === 0) {
                    setToast({ message: 'Selecciona al menos una actividad', type: 'error' });
                    return;
                    }

                    if (tiposSeleccionados.size < tiposNecesarios.length) {
                    setToast({
                        message: `Debes seleccionar al menos una actividad por cada tipo (${tiposNecesarios.length} tipos)`,
                        type: 'error',
                    });
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
                        navigate('/admin/gestionar-sesiones');
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

            <LoadingOverlay visible={loading} message={loadingMessage} />
            </div>
        );
        };

        export default SesionCreate;
