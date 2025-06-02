    import React, { useEffect, useState } from 'react';
    import './ActivitySelector.css';

    interface Activity {
    id: number;
    title: string;
    type: { name: string };
    difficulty: { id: number };
    }

    interface Props {
    activities: Activity[];
    selectedActivityIds: number[];
    onClose: () => void;
    onConfirm: (selectedIds: number[]) => void;
    }

    const ActivitySelector: React.FC<Props> = ({
    activities,
    selectedActivityIds,
    onClose,
    onConfirm,
    }) => {
    const [selectedIds, setSelectedIds] = useState<number[]>(selectedActivityIds);

    const toggleSelection = (id: number) => {
        setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const groupedByType = activities.reduce((acc: Record<string, Activity[]>, activity) => {
        const type = activity.type.name;
        if (!acc[type]) acc[type] = [];
        acc[type].push(activity);
        return acc;
    }, {});

    return (
        <div className="activity-selector-overlay">
        <div className="activity-selector-modal">
            <h3>Selecciona actividades manualmente</h3>
            <div className="activity-groups">
            {Object.entries(groupedByType).map(([type, acts]) => (
                <div key={type} className="activity-group">
                <h4>{type}</h4>
                <ul>
                    {acts.map((activity) => (
                    <li key={activity.id}>
                        <label>
                        <input
                            type="checkbox"
                            checked={selectedIds.includes(activity.id)}
                            onChange={() => toggleSelection(activity.id)}
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
            <button onClick={() => onConfirm(selectedIds)}>✅ Confirmar</button>
            <button onClick={onClose}>❌ Cancelar</button>
            </div>
        </div>
        </div>
    );
    };

    export default ActivitySelector;
