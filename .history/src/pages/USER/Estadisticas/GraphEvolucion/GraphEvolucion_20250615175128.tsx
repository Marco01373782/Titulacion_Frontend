// src/estadisticas/GraphEvolucion.tsx
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import './GraphEvolucion.css';

interface SesionUsuarioDTO {
  id: number;
  sesionId: number;
  userId: number;
  status: string;
  date: string;
  result: number;
}

interface Props {
  sesiones: SesionUsuarioDTO[];
}

const GraphEvolucion: React.FC<Props> = ({ sesiones }) => {
  const data = sesiones
    .filter((s) => s.status === 'COMPLETADA')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((s) => ({
      fecha: s.date,
      resultado: Math.round(s.result)
    }));

  return (
    <div className="graph-container">
      <h3>Evolución de Puntajes</h3>
      {data.length === 0 ? (
        <p>No hay datos suficientes aún.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="resultado" stroke="#3f51b5" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default GraphEvolucion;
