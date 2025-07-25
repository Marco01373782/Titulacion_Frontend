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
    import './PromedioPorTipo.css';
    import {
    getSesionesUsuario,
    getResultadosActividadPorSesionYUsuario,
    fetchActivityTypes,
    } from '../../../../services/ApiService';

    // Importa tu mapeo bonito de tipos
    import ACTIVITY_TYPE_LABELS from '../../../../data/ACTIVITY_TYPE_LABELS';

    interface SessionActivityResult {
    activity: {
        id: number;
        type: string;
    };
    result: number;
    }

    const PromedioPorTipo: React.FC = () => {
    const [promedios, setPromedios] = useState<{ tipo: string; promedio: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [setTypeMap] = useState<Record<string, string>>({});
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchData = async () => {
        if (!userId) return;
        try {
            const tiposRes = await fetchActivityTypes();

            // Aquí mapeamos el enum crudo a su etiqueta bonita usando ACTIVITY_TYPE_LABELS
            const map: Record<string, string> = {};
            tiposRes.data.forEach((t: string) => {
            map[t] = ACTIVITY_TYPE_LABELS[t] || t;
            });
            setTypeMap(map);

            const sesionesRes = await getSesionesUsuario(userId);
            const completadas = sesionesRes.data.filter((s: any) => s.status === 'COMPLETADA');

            const resultados: SessionActivityResult[] = [];
            for (const sesion of completadas) {
            const res = await getResultadosActividadPorSesionYUsuario(sesion.sesion.id, userId);
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
            tipo: map[tipo] || tipo,  // usa el map local
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
