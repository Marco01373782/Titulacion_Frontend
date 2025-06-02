    import { useEffect, useState } from 'react';
    import './ActivityEdit.css';
    import { useParams, useNavigate } from 'react-router-dom';
    import {
    fetchActivityById,
    updateActivity,
    } from '../../../../services/ApiService';
    import Toast from '../../../../components/toast/Toast';
    import LoadingOverlay from '../../../../components/modal/Loading/LoadingOverlay';

    interface Difficulty {
    id: number;
    name: string;
    }

    interface ActivityType {
    id: number;
    name: string;
    }

    interface Activity {
    id: number;
    title: string;
    description: string;
    resourceUrl: string;
    type: ActivityType;
    difficulty: Difficulty;
    }

    const ActivityEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [activity, setActivity] = useState<Activity | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [resourceUrl, setResourceUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        if (!id) return;

        const loadActivity = async () => {
        setLoading(true);
        try {
            const response = await fetchActivityById(parseInt(id));
            const actData = response.data;

            setActivity(actData);
            setTitle(actData.title);
            setDescription(actData.description);
            setResourceUrl(actData.resourceUrl);
        } catch (error) {
            console.error('Error cargando actividad', error);
            setToast({ message: 'No se pudo cargar la actividad.', type: 'error' });
        } finally {
            setLoading(false);
        }
        };

        loadActivity();
    }, [id]);

    const handleSave = async () => {
        if (!title.trim() || !description.trim()) {
        setToast({ message: 'Por favor llena todos los campos.', type: 'error' });
        return;
        }

        setSaving(true);
        try {
        await updateActivity(parseInt(id!), {
            title,
            description,
            resourceUrl,
        });

        setTimeout(() => {
            setToast({ message: 'Actividad actualizada correctamente', type: 'success' });
        }, 300);

        setTimeout(() => {
            navigate('/app/gestionar-actividades');
        }, 1500);
        } catch (error) {
        console.error('Error al actualizar actividad', error);
        setToast({ message: 'No se pudo actualizar la actividad.', type: 'error' });
        } finally {
        setSaving(false);
        }
    };

    const handleCancel = () => {
        navigate('/app/gestionar-actividades');
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
                <input type="text" value={activity.type.name} disabled />
            </label>

            <label>
                Dificultad:
                <input type="text" value={activity.difficulty.name} disabled />
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
