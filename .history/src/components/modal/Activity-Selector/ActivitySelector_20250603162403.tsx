import React, { useState } from 'react';
import './ActivitySelector.css';
import { Activity } from '../../../Types/ActivityTypes';

interface Props {
  activities: Activity[];
  selectedActivityIds: number[];
  onConfirm: (selectedIds: number[]) => void;
  onClose: () => void;
  loading?: boolean;
}

const ActivitySelector: React.FC<Props> = ({
  activities,
  selectedActivityIds,
  onConfirm,
  onClose,
  loading = false,
}) => {
  const [selected, setSelected] = useState<number[]>(selectedActivityIds || []);

  const toggleSelection = (id: number) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((sid) => sid !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  // Agrupar actividades por tipo
  const grouped = activities.reduce((acc: Record<string, Activity[]>, activity) => {
    const typeName = activity.type.name;
    if (!acc[typeName]) acc[typeName] = [];
    acc[typeName].push(activity);
    return acc;
  }, {});

  return (
    <div className="activity-selector-overlay">
      <div className="activity-selector-modal">
        <h3>Seleccionar actividades</h3>

        {Object.entries(grouped).map(([type, acts]) => (
          <div key={type} className="group-block">
            <h4>{type}</h4>
            <ul>
              {acts.map((a) => (
                <li
                  key={a.id}
                  className={selected.includes(a.id) ? 'selected' : ''}
                  onClick={() => toggleSelection(a.id)}
                >
                  {a.title}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="modal-actions">
          <button onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button onClick={() => onConfirm(selected)} disabled={loading}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivitySelector;
