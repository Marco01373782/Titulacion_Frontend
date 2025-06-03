import React, { useEffect, useState } from 'react';
import { fetchAllActivities, fetchActivityTypes, assignActivitiesManual } from '../../services/ApiService';
import './ActivitySelector.css';

interface Activity {
  id: number;
  title: string;
  difficulty: string;
  type: string;
}

interface Props {
  onClose: () => void;
  sessionId: number;
  sessionDifficulty: string;
  onAssignSuccess: () => void;
}

const ActivitySelector: React.FC<Props> = ({ onClose, sessionId, sessionDifficulty, onAssignSuccess }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activityTypes, setActivityTypes] = useState<string[]>([]);
  const [selectedActivityIds, setSelectedActivityIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchAllActivities(), fetchActivityTypes()])
      .then(([activitiesRes, typesRes]) => {
        setActivities(activitiesRes.data);
        setActivityTypes(typesRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredByDifficulty = activities.filter(a => a.difficulty === sessionDifficulty);

  const groupedByType: { [type: string]: Activity[] } = {};
  activityTypes.forEach(type => {
    groupedByType[type] = filteredByDifficulty.filter(activity => activity.type === type);
  });

  const toggleSelection = (activityId: number) => {
    setSelectedActivityIds(prev =>
      prev.includes(activityId) ? prev.filter(id => id !== activityId) : [...prev, activityId]
    );
  };

  const handleConfirm = async () => {
    await assignActivitiesManual(sessionId, selectedActivityIds);
    onAssignSuccess();
    onClose();
  };

  return (
    <div className="activity-selector-overlay">
      <div className="activity-selector-modal">
        <h3>Selecciona actividades para esta sesión</h3>
        {loading ? (
          <div className="loading-overlay-modal">
            <div className="spinner" />
            <p>Cargando actividades...</p>
          </div>
        ) : (
          <div className="activity-groups">
            {activityTypes.map(type => (
              <div className="activity-group" key={type}>
                <h4>{type}</h4>
                <ul>
                  {groupedByType[type].length === 0 ? (
                    <li style={{ color: '#aaa' }}>(Sin actividades)</li>
                  ) : (
                    groupedByType[type].map(activity => (
                      <li key={activity.id}>
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedActivityIds.includes(activity.id)}
                            onChange={() => toggleSelection(activity.id)}
                          />
                          {activity.title}
                        </label>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            ))}
          </div>
        )}
        <div className="modal-buttons">
          <button onClick={handleConfirm} disabled={selectedActivityIds.length === 0}>
            Confirmar
          </button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ActivitySelector;
