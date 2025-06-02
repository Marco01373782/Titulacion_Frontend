    import React, { useState } from 'react';
    import LoadingOverlay from './LoadingOverlay'; // importa tu componente
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
    loading?: boolean; // agregamos prop loading opcional
    }

    const ActivitySelector: React.FC<Props> = ({
    activities,
    selectedActivityIds,
    onClose,
    onConfirm,
    loading = false,
    }) => {
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

            {/* Aquí mostramos tu LoadingOverlay */}
            <LoadingOverlay visible={loading} message="Cargando actividades..." />

            {/* Cuando loading es true, ocultamos el contenido para evitar que se interactúe */}
            {!loading && (
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
                            />
                            {activity.title}
                        </label>
                        </li>
                    ))}
                    </ul>
                </div>
                ))}
            </div>
            )}

            <div className="modal-buttons">
            <button onClick={handleConfirm} disabled={loading}>Confirmar</button>
            <button onClick={onClose} disabled={loading}>Cancelar</button>
            </div>
        </div>
        </div>
    );
    };

    export default ActivitySelector;
