    // src/estadisticas/PromedioPorTipo.tsx
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
    import './PromedioPorTipo.css
    import {
    getSesionesUsuario,
    getResultadosActividadPorSesionYUsuario,
    fetchActivityTypes,
    } from '../../../../services/ApiService';

    interface SessionActivityResult {
    activity: {
        id: number;
        type: string;
    };
    result: number;
    }

    interface ActivityType {
    name: string;
    description: string;
    }

    const PromedioPorTipo: React.FC = () => {
    const [promedios, setPromedios] = useState<{ tipo: string; promedio: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [typeMap, setTypeMap] = useState<Record<string, string>>({});
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchData = async () => {
        if (!userId) return;
        try {
            const tiposRes = await fetchActivityTypes();
            const map: Record<string, string> = {};
            tiposRes.data.forEach((t: ActivityType) => {
            map[t.name] = t.description || t.name;
            });
            setTypeMap(map);

            const sesionesRes = await getSesionesUsuario(userId);
            const completadas = sesionesRes.data.filter((s: any) => s.status === 'COMPLETADA');

            const resultados: SessionActivityResult[] = [];
            for (const sesion of completadas) {
            const res = await getResultadosActividadPorSesionYUsuario(sesion.sesionId, userId);
            resultados.push(...res.data);
            }

            const agrupados: Record<string, number[]> = {};
            resultados.forEach((r) => {
            if (!r.activity || r.result === undefined) return;
            const tipo = r.activity.type;
            if (!agrupados[tipo]) agrupados[tipo] = [];
            agrupados[tipo].push(r.result);
            });

            const proms = Object.entries(agrupados).map(([tipo, valores]) => ({
            tipo: typeMap[tipo] || tipo,
            promedio: Math.round(valores.reduce((a, b) => a + b, 0) / valores.length),
            }));

            setPromedios(proms);
        } catch (error) {
            console.error('❌ Error al cargar promedios por tipo:', error);
        } finally {
            setLoading(false);
        }
        };

        fetchData();
    }, [userId]);

    return (
        <div className="promedio-container">
        <h3>Promedios por Tipo de Actividad</h3>
        {loading ? (
            <p>Cargando datos...</p>
        ) : promedios.length === 0 ? (
            <p>No hay datos suficientes.</p>
        ) : (
            <ResponsiveContainer width="100%" height={300}>
            <BarChart data={promedios}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tipo" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="promedio" fill="#2196f3" />
            </BarChart>
            </ResponsiveContainer>
        )}
        </div>
    );
    };

    export default PromedioPorTipo;
