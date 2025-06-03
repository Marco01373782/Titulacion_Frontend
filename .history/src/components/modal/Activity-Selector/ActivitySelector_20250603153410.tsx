    import React, { useState } from 'react';
    import './ActivitySelector.css';

    interface Activity {
    id: number;
    title: string;
    type: { name: string };
    difficulty: s;
    }

    interface Props {
    activities: Activity[];
    selectedActivityIds: number[];
    onClose: () => void;
    onConfirm: (selectedIds: number[]) => void;
    loading?: boolean;  // <--- agregamos esta prop opcional
    }

    const ActivitySelector: React.FC<Props> = ({
    activities,
    selectedActivityIds,
    onClose,
    onConfirm,
    loading = false,  // valor por defecto false
    }) => {
    // Cambiamos de un array a un objeto para guardar selección por tipo
    const initialSelectedByType: Record<string, number | null> = {};

    activities.forEach((activity) => {
        if (selectedActivityIds.includes(activity.id)) {
        initialSelectedByType[activity.type.name] = activity.id;
        } else if (!(activity.type.name in initialSelectedByType)) {
        initialSelectedByType[activity.type.name] = null;
        }
    });

    const [selectedByType, setSelectedByType] = useState<Record<string, number | null>>(initialSelectedByType);

    const handleSelection = (typeName: string, activityId: number) => {
        setSelectedByType((prev) => ({
        ...prev,
        [typeName]: activityId,
        }));
    };

    const handleConfirm = () => {
        const selectedIds = Object.values(selectedByType).filter((id): id is number => id !== null);
        onConfirm(selectedIds);
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
                            disabled={loading} // deshabilita selección mientras carga
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
            <button onClick={handleConfirm} disabled={loading}>Confirmar</button>
            <button onClick={onClose} disabled={loading}>Cancelar</button>
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
