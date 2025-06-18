// src/pages/USER/Estadisticas/Resumen/ResumenComparativo.tsx
import React from 'react';
import './ResumenComparativo.css';

interface Props {
  sesiones: {
    id: number;
    date: string;
    result: number;
    sessionDurationSeconds: number;
  }[];
}

const ResumenComparativo: React.FC<Props> = ({ sesiones }) => {
  if (sesiones.length === 0) {
    return <p>No hay sesiones para comparar.</p>;
  }

  const promedioTotal = Math.round(
    sesiones.reduce((acc, s) => acc + (s.result ?? 0), 0) / sesiones.length
  );

  const promedioTiempo = Math.round(
    sesiones.reduce((acc, s) => acc + (s.sessionDurationSeconds ?? 0), 0) / sesiones.length
  );

  return (
    <div className="resumen-comparativo-container">
      <h2>📤 Resumen Comparativo</h2>
      <p><strong>Promedio general de resultados:</strong> {promedioTotal} puntos</p>
      <p><strong>Duración promedio por sesión:</strong> {promedioTiempo} segundos</p>

      <table className="tabla-comparativa">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Resultado</th>
            <th>Duración (s)</th>
          </tr>
        </thead>
        <tbody>
          {sesiones.map((s) => (
            <tr key={s.id}>
              <td>{s.date}</td>
              <td>{s.result}</td>
              <td>{s.sessionDurationSeconds}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Futuro: exportar a CSV */}
      {/* <button className="btn-export">📄 Exportar a CSV</button> */}
    </div>
  );
};

export default ResumenComparativo;
