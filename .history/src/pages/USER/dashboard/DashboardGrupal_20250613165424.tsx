import './DashboardGrupal.css';

const DashboardGrupal = () => {
  return (
    <div className="dashboard-grupal">
      <h2>Modo Grupal</h2>

      <p className="description">
        El modo grupal permite realizar actividades en conjunto, guiadas por un cuidador o facilitador.
        No se guarda progreso individual, pero está diseñado para fomentar la participación, la socialización
        y el estímulo cognitivo en un ambiente colaborativo.
      </p>

      <div className="info-grid">
        <div className="info-box">
          <h3>👥 Actividades Compartidas</h3>
          <p>Ideal para sesiones con varios adultos mayores al mismo tiempo.</p>
        </div>
        <div className="info-box">
          <h3>🧭 Sin Registro</h3>
          <p>Las sesiones no se guardan, están pensadas para ejercicios en grupo sin seguimiento.</p>
        </div>
        <div className="info-box">
          <h3>🎯 Enfoque Participativo</h3>
          <p>Buscan motivar, entretener y fortalecer habilidades de forma colectiva.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardGrupal;
