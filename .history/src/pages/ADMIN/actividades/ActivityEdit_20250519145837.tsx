// Importaciones siguen igual

const ActivityEdit = () => {
  // ... estado y hooks igual

  useEffect(() => {
    // Igual: carga actividad, dificultades y tipos
  }, [id]);

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      alert('Por favor llena todos los campos.');
      return;
    }

    try {
      // Solo enviar los campos que quieres permitir editar
      await updateActivity(parseInt(id!), {
        title,
        description,
        resourceUrl,
        // NO enviar type ni difficulty
      });

      alert('Actividad actualizada correctamente');
      navigate('/app/gestionar-actividades');

    } catch (error) {
      console.error('Error al actualizar actividad', error);
      alert('No se pudo actualizar la actividad.');
    }
  };

  // ...

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

        {/* Mostrar tipo y dificultad pero deshabilitados */}
        <label>
          Tipo de actividad:
          <input
            type="text"
            value={activity.type.name}
            disabled
          />
        </label>

        <label>
          Dificultad:
          <input
            type="text"
            value={activity.difficulty.name}
            disabled
          />
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
