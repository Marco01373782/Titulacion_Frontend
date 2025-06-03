    import React, { useState, useEffect, useMemo } from 'react';
    import './ActivitySelector.css';
    import { Activity } from '../../../Types/ActivityTypes';

    interface Props {
    activitiesByType: Record<string, Activity[]>;
    selectedActivityIds: number[];
    onSelectionChange: (selectedIds: number[]) => void;
    onConfirm: (selectedIds: number[]) => void;
    onClose: () => void;
    loading?: boolean;
    }

    const ActivitySelector: React.FC<Props> = ({
    activitiesByType,
    selectedActivityIds,
    onSelectionChange,
    onConfirm,
    onClose,
    loading = false,
    }) => {
    // Inicializar el estado con useMemo para recalcular solo si cambian props
    const initialSelectedByType = useMemo(() => {
        const map: Record<string, number | null> = {};
        Object.entries(activitiesByType).forEach(([typeName, acts]) => {
        const foundSelected = acts.find((a) => selectedActivityIds.includes(a.id));
        map[typeName] = foundSelected ? foundSelected.id : null;
        });
        return map;
    }, [activitiesByType, selectedActivityIds]);

    const [selectedByType, setSelectedByType] = useState<Record<string, number | null>>(initialSelectedByType);

    // Sincronizar estado si cambian las props
    useEffect(() => {
        setSelectedByType(initialSelectedByType);
    }, [initialSelectedByType]);

    // Avisar padre cuando cambian las selecciones
    useEffect(() => {
        const selectedIds = Object.values(selectedByType).filter((id): id is number => id !== null);
        onSelectionChange(selectedIds);
    }, [selectedByType, onSelectionChange]);

    const handleSelectActivity = (typeName: string, activityId: number) => {
        if (loading) return;
        setSelectedByType((prev) => ({
        ...prev,
        [typeName]: prev[typeName] === activityId ? null : activityId,
        }));
    };

    return (
        <div className="activity-selector-backdrop">
        <div className="activity-selector-modal">
            <h3>Selecciona actividades (una por tipo)</h3>
            <div className="activity-list-container">
            {Object.entries(activitiesByType).map(([typeName, acts]) => (
                <div key={typeName} className="activity-type-group">
                <h4>{typeName}</h4>
                <ul className="activity-list">
                    {acts.map((activity) => {
                    const isSelected = selectedByType[typeName] === activity.id;
                    return (
                        <li
                        key={activity.id}
                        className={`activity-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSelectActivity(typeName, activity.id)}
                        title={activity.description}
                        >
                        {activity.title}
                        </li>
                    );
                    })}
                </ul>
                </div>
            ))}
            </div>

            <div className="modal-buttons">
            <button
                onClick={() => onConfirm(Object.values(selectedByType).filter((id): id is number => id !== null))}
                disabled={loading}
            >
                Confirmar
            </button>
            <button onClick={onClose} disabled={loading}>
                Cancelar
            </button>
            </div>
        </div>
        </div>
    );
    };

    export default ActivitySelector;
