import React from 'react';

const ActivityResultTable = ({ results }) => {
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
