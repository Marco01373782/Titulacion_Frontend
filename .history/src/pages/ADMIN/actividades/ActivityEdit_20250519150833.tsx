    import { useEffect, useState } from 'react';
    import './ActivityEdit.css';
    import { useParams, useNavigate } from 'react-router-dom';
    import {
    fetchActivityById,
    updateActivity,
    } from '../../../services/ApiService';
    import Toast from '../../../components/toast/Toast';


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
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    useEffect(() => {
        if (!id) return;

        const loadActivity = async () => {
        try {
            const response = await fetchActivityById(parseInt(id));
            const actData = response.data;

            setActivity(actData);
            setTitle(actData.title);
            setDescription(actData.description);
            setResourceUrl(actData.resourceUrl);
        } catch (error) {
            console.error('Error cargando actividad', error);
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

        try {
        await updateActivity(parseInt(id!), {
            title,
            description,
            resourceUrl,
            // No enviar type ni difficulty para que no cambien
        });

        alert('Actividad actualizada correctamente');
        navigate('/app/gestionar-actividades');
        } catch (error) {
        console.error('Error al actualizar actividad', error);
        alert('No se pudo actualizar la actividad.');
        }
    };

    const handleCancel = () => {
        navigate('/app/gestionar-actividades');
    };

    if (loading) return <p>Cargando...</p>;
    if (!activity) return <p>Actividad no encontrada</p>;

    return (
        <div className="activity-edit-container">
        <h2>Editar Actividad</h2>
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

            {/* Mostrar tipo y dificultad pero deshabilitados */}
            <label>
            Tipo de actividad:
            <input type="text" value={activity.type.name} disabled />
            </label>

            <label>
            Dificultad:
            <input type="text" value={activity.difficulty.name} disabled />
            </label>

            <div className="buttons">
            <button type="submit" className="btn-save">
                Guardar
            </button>
            <button
                type="button"
                onClick={handleCancel}
                className="btn-cancel"
            >
                Cancelar
            </button>
            </div>
        </form>
        </div>
    );
    };

    export default ActivityEdit;
