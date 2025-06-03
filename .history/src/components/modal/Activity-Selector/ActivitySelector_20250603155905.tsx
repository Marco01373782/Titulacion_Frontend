import React, { useState } from 'react';
import './ActivitySelector.css';

interface Activity {
  id: number;
  title: string;
  type: string; // Ya es un string directamente
  difficulty: string;
}

interface Props {
  activities: Activity[];
  selectedActivityIds: number[];
  onClose: () => void;
  onConfirm: (selectedIds: number[]) => void;
  loading?: boolean;
}

const ActivitySelector: React.FC<Props> = ({
  activities,
  selectedActivityIds,
  onClose,
  onConfirm,
  loading = false,
}) => {
  // Inicializar la selección por tipo
  const initialSelectedByType: Record<string, number | null> = {};
  activities.forEach((activity) => {
    const type = activity.type;
    if (selectedActivityIds.includes(activity.id)) {
      initialSelectedByType[type] = activity.id;
    } else if (!(type in initialSelectedByType)) {
      initialSelectedByType[type] = null;
    }
  });

  const [selectedByType, setSelectedByType] = useState<Record<string, number | null>>(initialSelectedByType);

  const handleSelection = (type: string, activityId: number) => {
    setSelectedByType((prev) => ({
      ...prev,
      [type]: activityId,
    }));
  };

  const handleConfirm = () => {
    const selectedIds = Object.values(selectedByType).filter((id): id is number => id !== null);
    onConfirm(selectedIds);
  };

  // Agrupar actividades por tipo
  const groupedByType = activities.reduce((acc: Record<string, Activity[]>, activity) => {
    const type = activity.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(activity);
    return acc;
  }, {});

  return (
    <div className="activity-selector-overlay">
      <div className="activity-selector-modal">
        <h3>Selecciona una actividad por tipo</h3>
        <div className="activity-groups">
          {Object.entries(groupedByType).map(([type, acts]) => (
            <div key={type} className="activity-group">
              <h4>{type}</h4>
              <ul>
                {acts.map((activity) => (
                  <li key={activity.id}>
                    <label>
                      <input
                        type="radio"
                        name={type}
                        checked={selectedByType[type] === activity.id}
                        onChange={() => handleSelection(type, activity.id)}
                        disabled={loading}
                      />
                      {activity.title}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="modal-buttons">
          <button onClick={handleConfirm} disabled={loading}>
            Confirmar
          </button>
          <button onClick={onClose} disabled={loading}>
            Cancelar
          </button>
        </div>
        {loading && (
          <div className="loading-overlay-modal">
            <div className="spinner"></div>
            <p>Asignando...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivitySelector;
