// src/pages/USER/Estadisticas/Tiempo/TempoPromedioPorTipo.tsx
import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import './TiempoPromedioPorTipo.css';
import {
  getSesionesUsuario,
  getResultadosActividadPorSesionYUsuario,
  fetchActivityTypes,
} from '../../../../services/ApiService';

import ACTIVITY_TYPE_LABELS from '../../../../data/ACTIVITY_TYPE_LABELS';

interface SessionActivityResult {
  activity: {
    id: number;
    type: string;
  };
  durationSeconds?: number;
}

const TiempoPromedioPorTipo: React.FC = () => {
  const [datos, setDatos] = useState<{ tipo: string; promedioTiempo: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      try {
        const tiposRes = await fetchActivityTypes();
        const typeMap: Record<string, string> = {};
        tiposRes.data.forEach((t: string) => {
          typeMap[t] = ACTIVITY_TYPE_LABELS[t] || t;
        });

        const sesionesRes = await getSesionesUsuario(userId);
        const completadas = sesionesRes.data.filter((s: any) => s.status === 'COMPLETADA');

        const resultados: SessionActivityResult[] = [];
        for (const sesion of completadas) {
          const res = await getResultadosActividadPorSesionYUsuario(sesion.sesion.id, userId);
          resultados.push(...res.data);
        }

        const agrupados: Record<string, number[]> = {};
        resultados.forEach((r) => {
          if (!r.activity || r.durationSeconds === undefined) return;
          const tipo = r.activity.type;
          if (!agrupados[tipo]) agrupados[tipo] = [];
          agrupados[tipo].push(r.durationSeconds);
        });

        const promedios = Object.entries(agrupados).map(([tipo, tiempos]) => ({
          tipo: typeMap[tipo] || tipo,
          promedioTiempo: Math.round(
            tiempos.reduce((a, b) => a + b, 0) / tiempos.length
          ),
        }));

        setDatos(promedios);
      } catch (err) {
        console.error('❌ Error al calcular tiempos promedio:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div className="tiempo-container">
      <h3>Tiempo promedio por tipo de actividad</h3>
      {loading ? (
        <p>Cargando datos...</p>
      ) : datos.length === 0 ? (
        <p>No hay datos suficientes.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={datos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tipo" />
            <YAxis label={{ value: 'Segundos', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="promedioTiempo" fill="#ff9800" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TiempoPromedioPorTipo;
