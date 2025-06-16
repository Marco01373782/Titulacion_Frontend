import './DashboardIndividual.css';

const Dashboard = () => {
  return (
    <div className="dashboard-individual">
      <h2>Modo Individual</h2>
      <p className="intro-text">
        En el modo individual, el cuidador acompaña al adulto mayor en sesiones personalizadas.
        Estas sesiones están diseñadas según el nivel cognitivo del usuario, evaluado previamente mediante un test.
      </p>

      <div className="info-boxes">
        <div className="info-box">
          <h3>Sesiones diarias</h3>
          <p>Solo una sesión por día para asegurar la concentración y evitar fatiga cognitiva.</p>
        </div>

        <div className="info-box">
          <h3>Seguimiento</h3>
          <p>Se registran los resultados, tiempos y progreso del usuario para análisis posteriores.</p>
        </div>

        <div className="info-box">
          <h3>Adaptación</h3>
          <p>Cada cierto tiempo se repite el test para ajustar el nivel de dificultad de las sesiones.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
