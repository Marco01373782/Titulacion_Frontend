import React from 'react';
import './DashboardIndividual.css';
import { ReactComponent as SelfImprovementIcon } from './icons/SelfImprovementIcon.svg';
import { ReactComponent as TrendingUpIcon } from './icons/TrendingUpIcon.svg';
import { ReactComponent as AutoGraphIcon } from './icons/AutoGraphIcon.svg';

const DashboardIndividual: React.FC = () => {
  return (
    <div className="dashboard-container">
      <h2 className="title">Modo Individual</h2>

      <p className="description">
        El modo individual permite al cuidador o familiar acompañar al usuario en un camino progresivo de estimulación cognitiva personalizada.
        A medida que completa cada sesión, se desbloquea la siguiente, garantizando un entrenamiento ordenado, adaptativo y seguro.
      </p>

      <div className="divider">
        <span className="chip">Características del modo individual</span>
      </div>

      <div className="cards-wrapper">
        <div className="card card-primary">
          <div className="card-content">
            <SelfImprovementIcon className="icon icon-primary" />
            <h3>Sesiones progresivas</h3>
            <p>
              Cada sesión completada desbloquea la siguiente. El avance depende del ritmo individual, no del tiempo.
            </p>
          </div>
        </div>

        <div className="card card-success">
          <div className="card-content">
            <TrendingUpIcon className="icon icon-success" />
            <h3>Seguimiento detallado</h3>
            <p>
              Se registran resultados, tiempos y evolución de cada actividad para análisis y mejora continua.
            </p>
          </div>
        </div>

        <div className="card card-warning">
          <div className="card-content">
            <AutoGraphIcon className="icon icon-warning" />
            <h3>Adaptación del Usuario</h3>
            <p>
              El sistema permite seleccionar manualmente el nivel de dificultad de las sesiones adaptándose a las capacidades y necesidades del usuario.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardIndividual;
