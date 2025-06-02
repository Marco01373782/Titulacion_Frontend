import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SesionCreate.css';

interface Difficulty {
  id: number;
  name: string;
}

interface SesionData {
  title: string;
  description: string;
  difficultyId: number;
}

const SesionCreate: React.FC = () => {
  const [difficulties, setDifficulties] = useState<Difficulty[]>([]);
  const [form, setForm] = useState<SesionData>({
    title: '',
    description: '',
    difficultyId: 0
  });
  const [sesionId, setSesionId] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8081/difficulties')
      .then(res => setDifficulties(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'difficultyId' ? parseInt(value) : value }));
  };

  const handleCreate = () => {
    const sesionPayload = {
      title: form.title,
      description: form.description,
      difficulty: { id: form.difficultyId }
    };

    axios.post('http://localhost:8081/sesions', sesionPayload)
      .then(res => {
        setSesionId(res.data.id);
        setMensaje('Sesión creada exitosamente.');
      })
      .catch(() => {
        setMensaje('Error al crear la sesión.');
      });
  };

  const handleAssignAuto = () => {
    if (!sesionId) return;

    axios.post(`http://localhost:8081/session-activities/assign/${sesionId}`)
      .then(() => setMensaje('Actividades asignadas automáticamente.'))
      .catch(() => setMensaje('Error al asignar actividades.'));
  };

  return (
    <div className="sesion-create-container">
      <h2>Crear Nueva Sesión</h2>

      <input
        type="text"
        name="title"
        placeholder="Título"
        value={form.title}
        onChange={handleChange}
      />

      <textarea
        name="description"
        placeholder="Descripción"
        value={form.description}
        onChange={handleChange}
      />

      <select name="difficultyId" value={form.difficultyId} onChange={handleChange}>
        <option value={0}>Selecciona una dificultad</option>
        {difficulties.map(d => (
          <option key={d.id} value={d.id}>{d.name}</option>
        ))}
      </select>

      <button onClick={handleCreate}>Crear sesión</button>

      {sesionId && (
        <div className="asignacion-botones">
          <button onClick={handleAssignAuto}>Asignar automáticamente</button>
          <button disabled>Asignar manualmente</button> {/* Más adelante */}
        </div>
      )}

      {mensaje && <p className="mensaje">{mensaje}</p>}
    </div>
  );
};

export default SesionCreate;
