    import React, { useState, useEffect } from 'react';
    import {
    createSession,
    fetchDifficulties,
    assignActivitiesAuto
    } from '../../../../services/ApiService';
    import './SesionCreate.css';
    import { fetchAllActivities, assignActivitiesManual } from '../../../../services/ApiService';

    interface Difficulty {
        id: number;
        name: string;
    }
    interface Activity {
        id: number;
        title: string;
        type: { name: string };
}
    const [activities, setActivities] = useState<Activity[]>([]);
    const [selectedActivityIds, setSelectedActivityIds] = useState<number[]>([]);
    const SesionCreate: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [difficultyId, setDifficultyId] = useState<number | null>(null);
    const [difficulties, setDifficulties] = useState<Difficulty[]>([]);
    const [mensaje, setMensaje] = useState('');
    const [sesionId, setSesionId] = useState<number | null>(null);

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
const toggleActivitySelection = (id: number) => {
  setSelectedActivityIds((prev) =>
    prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
  );
};
const handleAsignarManual = () => {
  if (!sesionId || selectedActivityIds.length === 0) {
    setMensaje('Selecciona al menos una actividad');
    return;
  }

  assignActivitiesManual(sesionId, selectedActivityIds)
    .then(() => setMensaje('Actividades asignadas manualmente'))
    .catch(() => setMensaje('Error al asignar manualmente'));
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

    const handleAsignarAuto = () => {
        if (!sesionId) return;
        assignActivitiesAuto(sesionId)
        .then(() => setMensaje('Actividades asignadas automáticamente'))
        .catch(() => setMensaje('Error al asignar actividades'));
    };

    const handleAsignarManual = () => {
        alert('Función de asignación manual aún no implementada');
        // Aquí puedes redirigir o abrir un modal más adelante
    };

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

        {mensaje && <p className="mensaje">{mensaje}</p>}
        </div>
    );
    };

    export default SesionCreate;
