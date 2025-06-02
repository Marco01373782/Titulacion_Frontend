    import  { useEffect, useState } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import {
    fetchActivityById,
    updateActivity,
    fetchDifficulties,
    fetchActivityTypes
    } from '../../../services/ApiService';

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
    const [selectedType, setSelectedType] = useState<number | null>(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null);

    const [difficulties, setDifficulties] = useState<Difficulty[]>([]);
    const [types, setTypes] = useState<ActivityType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const loadData = async () => {
        try {
            const [activityRes, difficultiesRes, typesRes] = await Promise.all([
            fetchActivityById(parseInt(id)),
            fetchDifficulties(),
            fetchActivityTypes(),
            ]);

            const actData = activityRes.data;
            setActivity(actData);
            setTitle(actData.title);
            setDescription(actData.description);
            setResourceUrl(actData.resourceUrl);
            setSelectedType(actData.type.id);
            setSelectedDifficulty(actData.difficulty.id);

            setDifficulties(difficultiesRes.data);
            setTypes(typesRes.data);

        } catch (error) {
            console.error('Error cargando actividad o datos', error);
        } finally {
            setLoading(false);
        }
        };

        loadData();
    }, [id]);

    const handleSave = async () => {
        if (!title.trim() || !description.trim() || !selectedType || !selectedDifficulty) {
        alert('Por favor llena todos los campos.');
        return;
        }

        try {
        await updateActivity(parseInt(id!), {
            title,
            description,
            resourceUrl,
            type: { id: selectedType },
            difficulty: { id: selectedDifficulty }
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
        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
            <label>
            Título:
            <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            </label>

            <label>
            Descripción:
            <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
            />
            </label>

            <label>
            URL Recurso:
            <input
                type="text"
                value={resourceUrl}
                onChange={e => setResourceUrl(e.target.value)}
            />
            </label>

            <label>
            Tipo de actividad:
            <select
                value={selectedType || ''}
                onChange={e => setSelectedType(parseInt(e.target.value))}
            >
                <option value="" disabled>Selecciona un tipo</option>
                {types.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
                ))}
            </select>
            </label>

            <label>
            Dificultad:
            <select
                value={selectedDifficulty || ''}
                onChange={e => setSelectedDifficulty(parseInt(e.target.value))}
            >
                <option value="" disabled>Selecciona dificultad</option>
                {difficulties.map(diff => (
                <option key={diff.id} value={diff.id}>{diff.name}</option>
                ))}
            </select>
            </label>

            <div className="buttons">
            <button type="submit" className="btn-save">Guardar</button>
            <button type="button" onClick={handleCancel} className="btn-cancel">Cancelar</button>
            </div>
        </form>
        </div>
    );
    };

    export default ActivityEdit;
