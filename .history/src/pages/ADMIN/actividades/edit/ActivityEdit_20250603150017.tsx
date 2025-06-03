    import React, { useEffect, useState } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import { fetchDifficulties, fetchActivityTypes } from '../../../../services/EnumService';
    import { getActivityById, updateActivity } from '../../services/ActivityService';
    import { toast } from '../../components/ui/Toast';

    interface Activity {
    id: number;
    title: string;
    description: string;
    resourceUrl: string;
    type: string;
    difficulty: string;
    }

    const ActivityEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [activity, setActivity] = useState<Activity | null>(null);
    const [types, setTypes] = useState<string[]>([]);
    const [difficulties, setDifficulties] = useState<string[]>([]);

    useEffect(() => {
        if (id) {
        getActivityById(parseInt(id)).then((res) => setActivity(res.data));
        }
        fetchActivityTypes().then((res) => setTypes(res.data));
        fetchDifficulties().then((res) => setDifficulties(res.data));
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (activity) {
        setActivity({ ...activity, [name]: value });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!activity) return;
        updateActivity(activity.id, activity)
        .then(() => {
            toast.success('Actividad actualizada con éxito');
            navigate('/app/gestionar-actividades');
        })
        .catch(() => toast.error('Error al actualizar la actividad'));
    };

    if (!activity) return <p>Cargando...</p>;

    return (
        <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-bold">Editar Actividad</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
            type="text"
            name="title"
            value={activity.title}
            onChange={handleChange}
            placeholder="Título"
            className="w-full border p-2 rounded"
            required
            />

            <textarea
            name="description"
            value={activity.description}
            onChange={handleChange}
            placeholder="Descripción"
            className="w-full border p-2 rounded"
            />

            <select
            name="type"
            value={activity.type}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
            >
            <option value="">-- Selecciona un tipo --</option>
            {types.map((type) => (
                <option key={type} value={type}>
                {type.replaceAll('_', ' ')}
                </option>
            ))}
            </select>

            <select
            name="difficulty"
            value={activity.difficulty}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
            >
            <option value="">-- Selecciona una dificultad --</option>
            {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                {diff}
                </option>
            ))}
            </select>

            <input
            type="text"
            name="resourceUrl"
            value={activity.resourceUrl}
            onChange={handleChange}
            placeholder="URL del recurso"
            className="w-full border p-2 rounded"
            />

            <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
            >
            Guardar Cambios
            </button>
        </form>
        </div>
    );
    };

    export default ActivityEdit;
