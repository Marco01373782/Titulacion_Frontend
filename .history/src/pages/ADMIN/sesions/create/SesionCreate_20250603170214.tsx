// ... tus imports
import ActivitySelector from '../../../../components/modal/Activity-Selector/ActivitySelector';
// ...

const SesionCreate: React.FC = () => {
  // ... tus hooks
  const [showManualSelect, setShowManualSelect] = useState(false);

  // ...

  const handleAsignarManual = () => {
    if (!sesionId) return;
    setShowManualSelect(true);
  };

  const handleConfirmManual = (selectedIds: number[]) => {
    const tiposNecesarios = Object.keys(groupedActivities);
    const tiposSeleccionados = new Set(
      activities
        .filter((a) => selectedIds.includes(a.id))
        .map((a) => a.type.name)
    );

    if (selectedIds.length === 0) {
      setToast({ message: 'Selecciona al menos una actividad', type: 'error' });
      return;
    }

    if (tiposSeleccionados.size < tiposNecesarios.length) {
      setToast({
        message: `Debes seleccionar una actividad por cada tipo (${tiposNecesarios.length})`,
        type: 'error',
      });
      return;
    }

    setLoading(true);
    setLoadingMessage('Asignando actividades...');

    assignActivitiesManual(sesionId!, selectedIds)
      .then(() => {
        setToast({ message: 'Actividades asignadas manualmente', type: 'success' });
        setShowManualSelect(false);
        setTimeout(() => navigate('/admin/gestionar-sesiones'), 1000);
      })
      .catch(() => {
        setToast({ message: 'Error al asignar manualmente', type: 'error' });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="sesion-create-container">
      {/* ... formulario de crear sesión */}
      
      {sesionId && (
        <>
          <h3 className="asignar-title">Asignar actividades para la sesión</h3>
          <div className="asignar-buttons">
            <button onClick={handleAsignarManual} disabled={loading}>Asignar manualmente</button>
            <button onClick={handleAsignarAuto} disabled={loading}>Asignar automáticamente</button>
          </div>
        </>
      )}

      {showManualSelect && sesionId && (
        <ActivitySelector
          activitiesByType={groupedActivities}
          selectedActivityIds={selectedActivityIds}
          onSelectionChange={setSelectedActivityIds}
          onConfirm={handleConfirmManual}
          onClose={() => setShowManualSelect(false)}
          loading={loading}
        />
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <LoadingOverlay visible={loading} message={loadingMessage} />
    </div>
  );
};

export default SesionCreate;
