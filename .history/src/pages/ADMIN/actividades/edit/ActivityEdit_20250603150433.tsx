    import { useEffect, useState } from 'react';
    import './ActivityEdit.css';
    import { useParams, useNavigate } from 'react-router-dom';
    import {
    fetchActivityById,
    updateActivity,
    fetchActivityTypes,
    fetchDifficulties
    } from '../../../../services/ApiService';
    import Toast from '../../../../components/toast/Toast';
    import LoadingOverlay from '../../../../components/modal/Loading/LoadingOverlay';

    interface Activity {
    id: number;
    title: string;
    description: string;
    resourceUrl: string;
    type: string;
    difficulty: string;
    }

    const ActivityEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [activity, setActivity] = useState<Activity | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [resourceUrl, setResourceUrl] = useState('');
    const [type, setType] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [types, setTypes] = useState<string[]>([]);
    const [difficulties, setDifficulties] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        if (!id) return;

        const loadData = async () => {
        setLoading(true);
        try {
            const [activityRes, typesRes, diffsRes] = await Promise.all([
            fetchActivityById(parseInt(id)),
            fetchActivityTypes(),
            fetchDifficulties(),
            ]);

            const actData = activityRes.data;
            setActivity(actData);
            setTitle(actData.title);
            setDescription(actData.description);
            setResourceUrl(actData.resourceUrl);
            setType(actData.type);
            setDifficulty(actData.difficulty);
            setTypes(typesRes.data);
            setDifficulties(diffsRes.data);
        } catch (error) {
            console.error('Error cargando datos', error);
            setToast({ message: 'No se pudieron cargar los datos.', type: 'error' });
        } finally {
            setLoading(false);
        }
        };

        loadData();
    }, [id]);

    const handleSave = async () => {
        if (!title.trim() || !description.trim() || !type || !difficulty) {
        setToast({ message: 'Por favor llena todos los campos.', type: 'error' });
        return;
        }

        setSaving(true);
        try {
        await updateActivity(parseInt(id!), {
            title,
            description,
            resourceUrl,
            type,
            difficulty,
        });

        setTimeout(() => {
            setToast({ message: 'Actividad actualizada correctamente', type: 'success' });
        }, 300);

        setTimeout(() => {
            navigate('/admin/gestionar-actividades');
        }, 1500);
        } catch (error) {
        console.error('Error al actualizar actividad', error);
        setToast({ message: 'No se pudo actualizar la actividad.', type: 'error' });
        } finally {
        setSaving(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/gestionar-actividades');
    };

    return (
        <div className="activity-edit-container">
        <LoadingOverlay
            visible={loading || saving}
            message={saving ? 'Actualizando actividad...' : 'Cargando actividad...'}
        />

        <h2>Editar Actividad</h2>
        {activity && (
            <form
            onSubmit={(e) => {
                e.preventDefault();
                handleSave();
            }}
            >
            <label>
                Título:
                <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                />
            </label>

            <label>
                Descripción:
                <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                />
            </label>

            <label>
                URL Recurso:
                <input
                type="text"
                value={resourceUrl}
                onChange={(e) => setResourceUrl(e.target.value)}
                />
            </label>

            <label>
                Tipo de actividad:
                <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">-- Selecciona un tipo --</option>
                {types.map((t) => (
                    <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>

                ))}
                </select>
            </label>

            <label>
                Dificultad:
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="">-- Selecciona una dificultad --</option>
                {difficulties.map((d) => (
                    <option key={d} value={d}>{d}</option>
                ))}
                </select>
            </label>

            <div className="buttons">
                <button type="submit" className="btn-save" disabled={saving}>
                Guardar
                </button>
                <button
                type="button"
                onClick={handleCancel}
                className="btn-cancel"
                disabled={saving}
                >
                Cancelar
                </button>
            </div>
            </form>
        )}

        {toast && (
            <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
            />
        )}
        </div>
    );
    };

    export default ActivityEdit;
