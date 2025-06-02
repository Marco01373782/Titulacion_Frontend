import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDifficulties, fetchActivityTyp
import Toast from '../../../components/toast/Toast';

interface Difficulty {
  id: number;
  name: string;
}

interface ActivityType {
  id: number;
  name: string;
}

const CreateActivity = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [difficultyId, setDifficultyId] = useState<number | null>(null);
  const [typeId, setTypeId] = useState<number | null>(null);

  const [difficulties, setDifficulties] = useState<Difficulty[]>([]);
  const [types, setTypes] = useState<ActivityType[]>([]);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const diffRes = await fetchDifficulties();
        setDifficulties(diffRes.data);

        const typesRes = await fetchActivityTypes();
        setTypes(typesRes.data);
      } catch (error) {
        setToast({ message: 'Error cargando datos', type: 'error' });
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !resourceUrl || !difficultyId || !typeId) {
      setToast({ message: 'Completa todos los campos', type: 'error' });
      return;
    }

    try {
      await ApiService.post('/activities', {
        title,
        description,
        resourceUrl,
        difficulty: { id: difficultyId },
        type: { id: typeId },
      });

      setToast({ message: 'Actividad creada con éxito', type: 'success' });
      setTimeout(() => navigate('/app/lista-actividades'), 1500);
    } catch (error) {
      setToast({ message: 'Error al crear la actividad', type: 'error' });
    }
  };

  return (
    <div className="create-activity-container">
      <h2>Crear Nueva Actividad</h2>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <form onSubmit={handleSubmit} className="create-activity-form">
        <label>
          Título:
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
          Descripción:
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </label>

        <label>
          URL del recurso:
          <input
            type="url"
            value={resourceUrl}
            onChange={e => setResourceUrl(e.target.value)}
            required
          />
        </label>

        <label>
          Dificultad:
          <select
            value={difficultyId ?? ''}
            onChange={e => setDifficultyId(Number(e.target.value))}
            required
          >
            <option value="" disabled>Selecciona dificultad</option>
            {difficulties.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </label>

        <label>
          Tipo de actividad:
          <select
            value={typeId ?? ''}
            onChange={e => setTypeId(Number(e.target.value))}
            required
          >
            <option value="" disabled>Selecciona tipo</option>
            {types.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </label>

        <button type="submit" className="btn-submit">Crear Actividad</button>
      </form>
    </div>
  );
};

export default CreateActivity;
