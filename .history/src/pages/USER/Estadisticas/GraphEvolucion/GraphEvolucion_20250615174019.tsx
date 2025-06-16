// src/estadisticas/GraphEvolucion.tsx
import React, { useEffect, useState } from 'react';
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
import { getSesionesUsuario } from '../../../services/ApiService';

interface SesionUsuarioDTO {
  id: number;
  sesionId: number;
  userId: number;
  status: string;
  date: string;
  result: number;
}

const GraphEvolucion: React.FC = () => {
  const [data, setData] = useState<{ fecha: string; resultado: number }[]>([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      getSesionesUsuario(userId).then((res) => {
        const sesiones: SesionUsuarioDTO[] = res.data;
        const completadas = sesiones
          .filter((s) => s.status === 'COMPLETADA')
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .map((s) => ({ fecha: s.date, resultado: Math.round(s.result) }));

        setData(completadas);
      });
    }
  }, [userId]);

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
