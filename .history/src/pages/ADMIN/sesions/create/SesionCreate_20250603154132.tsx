import React, { useEffect, useState } from 'react';
import ActivitySelector from '../../../../components/modal/Activity-Selector/ActivitySelector';
import './SesionCreate.css';

interface Activity {
  id: number;
  title: string;
  type: { name: string };
  difficulty: string;
}

const SesionCreate: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<string>('');
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showSelector, setShowSelector] = useState(false);
  const [selectedActivityIds, setSelectedActivityIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  // Simula cargar dificultades desde backend
  useEffect(() => {
    fetch('/api/difficulties') // cambia por tu endpoint real
      .then(res => res.json())
      .then(data => setDifficulties(data))
      .catch(() => setDifficulties([]));
  }, []);

  // Carga actividades filtradas por dificultad seleccionada
  useEffect(() => {
    if (difficulty) {
      fetch(`/api/activities?difficulty=${difficulty}`) // Cambia por tu endpoint real que filtre por dificultad
        .then(res => res.json())
        .then((data: Activity[]) => setActivities(data))
        .catch(() => setActivities([]));
    } else {
      setActivities([]);
    }
  }, [difficulty]);

  const handleOpenSelector = () => {
    setShowSelector(true);
  };

  const handleCloseSelector = () => {
    setShowSelector(false);
  };

  const handleConfirmSelector = (selectedIds: number[]) => {
    setSelectedActivityIds(selectedIds);
    setShowSelector(false);
  };

  const handleSubmit = () => {
    if (!title || !difficulty) {
      alert('Por favor, completa título y dificultad.');
      return;
    }
    if (selectedActivityIds.length === 0) {
      alert('Selecciona al menos una actividad.');
      return;
    }

    const payload = {
      title,
      description,
      difficulty,
      activityIds: selectedActivityIds,
    };

    setLoading(true);
    fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al crear sesión');
        alert('Sesión creada correctamente');
        setTitle('');
        setDescription('');
        setDifficulty('');
        setSelectedActivityIds([]);
      })
      .catch(err => alert(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className="sesion-create-container">
      <h2>Crear Sesión</h2>
      <div className="form-group">
        <label>Título:</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="form-group">
        <label>Descripción:</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="form-group">
        <label>Dificultad:</label>
        <select
          value={difficulty}
          onChange={e => setDifficulty(e.target.value)}
          disabled={loading}
        >
          <option value="">-- Selecciona dificultad --</option>
          {difficulties.map(d => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <button
          onClick={handleOpenSelector}
          disabled={loading || activities.length === 0}
        >
          Seleccionar actividades
        </button>
      </div>
      <div>
        <h4>Actividades seleccionadas:</h4>
        <ul>
          {selectedActivityIds.length === 0 && <li>No hay actividades seleccionadas.</li>}
          {selectedActivityIds.map(id => {
            const act = activities.find(a => a.id === id);
            return act ? <li key={id}>{act.title} (Tipo: {act.type.name})</li> : null;
          })}
        </ul>
      </div>
      <div className="form-group">
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creando...' : 'Crear Sesión'}
        </button>
      </div>

      {showSelector && (
        <ActivitySelector
          activities={activities}
          selectedActivityIds={selectedActivityIds}
          onClose={handleCloseSelector}
          onConfirm={handleConfirmSelector}
          loading={loading}
        />
      )}
    </div>
  );
};

export default SesionCreate;
