// src/pages/USER/Estadisticas/historial/HistorialPorTipo.tsx
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getResultadosPorTipoYUsuario } from '../../../services/ApiService'; // Debes crear este endpoint en backend
import './HistorialPorTipo.css';

interface ResultadoPorTipoDTO {
  fecha: string;  // ISO string
  tipoActividad: string;
  resultado: number;
}

const HistorialPorTipo: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [tipos, setTipos] = useState<string[]>([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      getResultadosPorTipoYUsuario(userId)
        .then(res => {
          // Respuesta tipo: Array<ResultadoPorTipoDTO>
          const rawData: ResultadoPorTipoDTO[] = res.data;

          // Extraer fechas únicas ordenadas
          const fechasUnicas = Array.from(new Set(rawData.map(r => r.fecha))).sort();

          // Extraer tipos únicos
          const tiposUnicos = Array.from(new Set(rawData.map(r => r.tipoActividad)));
          setTipos(tiposUnicos);

          // Transformar datos para recharts
          const chartData = fechasUnicas.map(fecha => {
            const entry: any = { fecha };
            tiposUnicos.forEach(tipo => {
              const encontrado = rawData.find(r => r.fecha === fecha && r.tipoActividad === tipo);
              entry[tipo] = encontrado ? encontrado.resultado : null;
            });
            return entry;
          });

          setData(chartData);
        })
        .catch(err => console.error("❌ Error al cargar historial:", err));
    }
  }, [userId]);

  const colores = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#ff4d4d']; // Puedes extender

  return (
    <div className="historial-container">
      <h2>📊 Historial de resultados por tipo de actividad</h2>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" tickFormatter={(fecha) => fecha.slice(0,10)} />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />
          {tipos.map((tipo, i) => (
            <Line
              key={tipo}
              type="monotone"
              dataKey={tipo}
              stroke={colores[i % colores.length]}
              activeDot={{ r: 8 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistorialPorTipo;
