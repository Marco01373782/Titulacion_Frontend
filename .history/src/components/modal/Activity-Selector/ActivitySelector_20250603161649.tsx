    // ActivitySelector.tsx
    import React, { useState } from 'react';
    import { Activity } from '../../../Types/ActivityTypes';
    import './ActivitySelector.css';

    interface Props {
    activities: Activity[];
    selectedActivityIds: number[];
    onClose: () => void;
    onConfirm: (selectedIds: number[]) => void;
    loading: boolean;
    }

    const ActivitySelector: React.FC<Props> = ({
    activities,
    selectedActivityIds,
    onClose,
    onConfirm,
    loading,
    }) => {
    const [selectedIds, setSelectedIds] = useState<number[]>(selectedActivityIds || []);

    const handleSelect = (id: number) => {
        setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    return (
        <div className="activity-selector-modal">
        <div className="modal-content">
            <h3>Selecciona las actividades</h3>
            <ul className="activity-list">
            {activities.map((activity) => (
                <li
                key={activity.id}
                className={selectedIds.includes(activity.id) ? 'selected' : ''}
                onClick={() => handleSelect(activity.id)}
                >
                {activity.title} - <span>{activity.type.name}</span>
                </li>
            ))}
            </ul>

            <div className="modal-actions">
            <button onClick={onClose} disabled={loading}>
                Cancelar
            </button>
            <button onClick={() => onConfirm(selectedIds)} disabled={loading || selectedIds.length === 0}>
                Confirmar selección
            </button>
            </div>
        </div>
        </div>
    );
    };

    export default ActivitySelector;
