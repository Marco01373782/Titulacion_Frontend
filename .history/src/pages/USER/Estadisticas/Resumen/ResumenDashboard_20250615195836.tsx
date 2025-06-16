// src/pages/USER/Estadisticas/Resumen/ResumenDashboard.tsx
import React, { useEffect, useState } from 'react';
import './ResumenDashboard.css';

interface SesionUsuarioDTO {
  id: number;
  sesionId: number;
  userId: number;
  status: string;
  startedAt: string;
  endedAt: string;
  sessionDurationSeconds: number;
  result: number;
  mode: string;
  date: string;
}

interface Props {
  sesiones: SesionUsuarioDTO[];
  userId: string | null;
}

const ResumenDashboard: React.FC<Props> = ({ sesiones }) => {
  const [totalSesiones, setTotalSesiones] = useState(0);
  const [promedioGeneral, setPromedioGeneral] = useState(0);
  const [tiempoTotal, setTiempoTotal] = useState(0);
  const [mejorResultado, setMejorResultado] = useState(0);

  useEffect(() => {
    const completadas = sesiones.filter(s => s.status === 'COMPLETADA');

    setTotalSesiones(completadas.length);

    const promedio = completadas.length > 0
      ? completadas.reduce((acc, s) => acc + s.result, 0) / completadas.length
      : 0;
    setPromedioGeneral(Math.round(promedio));

    const totalTiempo = completadas.reduce((acc, s) => acc + (s.sessionDurationSeconds ?? 0), 0);
    setTiempoTotal(totalTiempo);

    const mejor = completadas.reduce((max, s) => Math.max(max, s.result), 0);
    setMejorResultado(mejor);
  }, [sesiones]);

  return (
    <div className="dashboard-container">
      <h2>📊 Panorama General</h2>
      <div className="kpi-grid">
        <div className="kpi-card">
          <h3>✅ Total Sesiones</h3>
          <p>{totalSesiones}</p>
        </div>
        <div className="kpi-card">
          <h3>📈 Promedio General</h3>
          <p>{promedioGeneral}</p>
        </div>
        <div className="kpi-card">
          <h3>⏳ Tiempo Total</h3>
          <p>{tiempoTotal} s</p>
        </div>
        <div className="kpi-card">
          <h3>🏅 Mejor Resultado</h3>
          <p>{mejorResultado}</p>
        </div>
      </div>
    </div>
  );
};

export default ResumenDashboard;
