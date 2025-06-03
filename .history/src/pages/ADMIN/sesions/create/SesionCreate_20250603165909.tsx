// src/pages/Admin/SesionCreate.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/ApiService';
import ActivitySelector from '../../modals/ActivitySelector';
import LoadingOverlay from '../../components/LoadingOverlay';
import Toast from '../../components/Toast';

const SesionCreate: React.FC = () => {
  const [difficulties, setDifficulties] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [showManualSelect, setShowManualSelect] = useState(false);
  const [sesionId, setSesionId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [tiposNecesarios, setTiposNecesarios] = useState<any[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    ApiService.getDifficulties()
      .then((res) => setDifficulties(res.data))
      .catch(() => setToast({ message: 'Error al cargar dificultades', type: 'error' }));
  }, []);

  const handleCrearSesion = () => {
    if (!selectedDifficulty) {
      setToast({ message: 'Selecciona una dificultad', type: 'error' });
      return;
    }

    setLoading(true);
    setLoadingMessage('Creando sesión...');

    ApiService.createSesion({ difficultyId: selectedDifficulty })
      .then((res) => {
        setSesionId(res.data.id);
        return ApiService.getActivityTypes();
      })
      .then((res) => {
        setTiposNecesarios(res.data);
        setLoading(false);
      })
      .catch(() => {
        setToast({ message: 'Error al crear sesión', type: 'error' });
        setLoading(false);
      });
  };

  return (
    <div className="sesion-create-container">
      <h2>Crear Nueva Sesión</h2>

      <label htmlFor="difficulty">Selecciona una dificultad:</label>
      <select
        id="difficulty"
        value={selectedDifficulty}
        onChange={(e) => setSelectedDifficulty(e.target.value)}
      >
        <option value="">--Seleccionar--</option>
        {difficulties.map((d: any) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>

      <div className="botones-creacion">
        <button onClick={handleCrearSesion}>Crear Sesión</button>

        {sesionId && (
          <>
            <button onClick={() => setShowManualSelect(true)}>Asignar manualmente</button>
            <button
              onClick={() => {
                setLoading(true);
                setLoadingMessage('Asignando actividades automáticamente...');
                ApiService.assignActivitiesAuto(sesionId)
                  .then(() => {
                    setToast({ message: 'Actividades asignadas automáticamente', type: 'success' });
                    setTimeout(() => navigate('/admin/gestionar-sesiones'), 1000);
                  })
                  .catch(() =>
                    setToast({ message: 'Error en la asignación automática', type: 'error' })
                  )
                  .finally(() => setLoading(false));
              }}
            >
              Asignar automáticamente
            </button>
          </>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}

      {showManualSelect && sesionId && (
        <ActivitySelector
          onCancel={() => setShowManualSelect(false)}
          onConfirm={(selectedIds, selectedActivities) => {
            const tiposSeleccionados = new Set(
              selectedActivities.map((a: any) => a.type.name)
            );

            if (tiposSeleccionados.size !== tiposNecesarios.length) {
              setToast({ message: 'Debes seleccionar una actividad por cada tipo.', type: 'error' });
              return;
            }

            setLoading(true);
            setLoadingMessage('Asignando actividades manualmente...');

            ApiService.assignActivitiesManual(sesionId, selectedIds)
              .then(() => {
                setToast({ message: 'Actividades asignadas exitosamente', type: 'success' });
                setShowManualSelect(false);
                setTimeout(() => navigate('/admin/gestionar-sesiones'), 1000);
              })
              .catch(() => {
                setToast({ message: 'Error al asignar actividades', type: 'error' });
              })
              .finally(() => setLoading(false));
          }}
          loading={loading}
        />
      )}

      {loading && <LoadingOverlay message={loadingMessage} />}
    </div>
  );
};

export default SesionCreate;
