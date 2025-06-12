  import { useState, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { fetchDifficulties } from '../../../../services/ApiService';
  import { fetchActivityTypes } from '../../../../services/ApiService';
  import ApiService from '../../../../services/ApiService';
  import Toast from '../../../../components/toast/Toast';
  import LoadingOverlay from '../../../../components/modal/Loading/LoadingOverlay';
  import './CreateActivity.css';
  import availableActivityResources from '../../../../data/availableActivityResources';


  // ... imports igual

  const CreateActivity = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [resourceUrl, setResourceUrl] = useState('');
    const [manualUrl, setManualUrl] = useState('');
    const [useManualUrl, setUseManualUrl] = useState(false);

    const [difficulty, setDifficulty] = useState<string>(''); 
    const [activityType, setActivityType] = useState<string>(''); 

    const [difficulties, setDifficulties] = useState<string[]>([]);
    const [types, setTypes] = useState<string[]>([]);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
      const fetchData = async () => {
        try {
          const diffRes = await fetchDifficulties();
          setDifficulties(diffRes.data); 
          const typesRes = await fetchActivityTypes();
          setTypes(typesRes.data); 
        } catch {
          setToast({ message: 'Error cargando datos', type: 'error' });
        }
      };
      fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const finalUrl = useManualUrl ? manualUrl : resourceUrl;

      if (!title || !description || !finalUrl || !difficulty || !activityType) {
        setToast({ message: 'Completa todos los campos', type: 'error' });
        return;
      }

      setLoading(true);
      try {
        await ApiService.post('/activities', {
          title,
          description,
          resourceUrl: finalUrl,
          difficulty,
          type: activityType,
        });

        setToast({ message: 'Actividad creada con éxito', type: 'success' });
        setTimeout(() => navigate('/admin/gestionar-actividades'), 1500);
      } catch {
        setToast({ message: 'Error al crear la actividad', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="create-activity-container">
        <h2>Crear Nueva Actividad</h2>

        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <LoadingOverlay visible={loading} message="Creando actividad..." />

        <form onSubmit={handleSubmit} className="create-activity-form">
          <label>
            Título:
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
          </label>

          <label>
            Descripción:
            <textarea value={description} onChange={e => setDescription(e.target.value)} required />
          </label>

          <label>
            ¿Usar URL externa?
            <input
              type="checkbox"
              checked={useManualUrl}
              onChange={e => setUseManualUrl(e.target.checked)}
            />
          </label>

          {useManualUrl ? (
            <label>
              URL externa:
              <input
                type="text"
                placeholder="http://actividad.com/ejemplo"
                value={manualUrl}
                onChange={e => setManualUrl(e.target.value)}
                required
              />
            </label>
          ) : (
            <label className="activity-component-selector">
          Selecciona componente de actividad:
          <div className="selector-with-preview">
            <select
              value={resourceUrl}
              onChange={e => setResourceUrl(e.target.value)}
              required
            >
              <option value="" disabled>Selecciona recurso</option>
              {availableActivityResources.map(res => (
                <option key={res.value} value={res.value}>{res.label}</option>
              ))}
            </select>

    {resourceUrl && (
      <button
        type="button"
        className="preview-button"
        onClick={() => window.open(resourceUrl, '_blank')}
        title="Vista previa"
      >
        🔍
      </button>
    )}
  </div>
</label>
          )}

          <label>
            Dificultad:
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)} required>
              <option value="" disabled>Selecciona dificultad</option>
              {difficulties.map(diff => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </label>

          <label>
            Tipo de actividad:
            <select value={activityType} onChange={e => setActivityType(e.target.value)} required>
              <option value="" disabled>Selecciona tipo</option>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </label>

          <button type="submit" className="btn-submit" disabled={loading}>Crear Actividad</button>
        </form>
      </div>
    );
  };

  export default CreateActivity;
