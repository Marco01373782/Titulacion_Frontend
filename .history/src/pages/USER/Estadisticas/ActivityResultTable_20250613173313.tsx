import React from 'react';

interface ActivityResult {
  activity: {
    id: number;
    // Puedes agregar más campos si los usas
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
          <tr key={res.activity.id}>
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
