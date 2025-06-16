    // src/estadisticas/ActivityResultTable.tsx
    import React from 'react';
    import './estadisticas.css'; // o un archivo separado si quieres

    interface ActivityResult {
    activity: {
        id: number;
    };
    result?: number;
    durationSeconds?: number;
    completedAt?: string;
    }

    interface Props {
    results: ActivityResult[];
    }

    const ActivityResultTable: React.FC<Props> = ({ results }) => {
    return (
        <table className="activity-table">
        <thead>
            <tr>
            <th>Actividad</th>
            <th>Puntaje</th>
            <th>Duración (s)</th>
            <th>Fecha</th>
            </tr>
        </thead>
        <tbody>
            {results.map((res) => (
            <tr key={`${res.activity.id}-${res.completedAt}`}>
                <td>#{res.activity.id}</td>
                <td>{res.result ?? '-'}</td>
                <td>{res.durationSeconds ?? '-'}</td>
                <td>{res.completedAt?.split('T')[0] ?? '-'}</td>
            </tr>
            ))}
        </tbody>
        </table>
    );
    };

    export default ActivityResultTable;
