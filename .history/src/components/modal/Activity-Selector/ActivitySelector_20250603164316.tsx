    import React, { useState, useEffect } from 'react';
    import './ActivitySelector.css';
    import { Activity } from '../../../Types/ActivityTypes';

    interface Props {
    activitiesByType: Record<string, Activity[]>; // Actividades agrupadas por tipo
    selectedActivityIds: number[]; // actividades inicialmente seleccionadas
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
    // Estado que guarda por tipo qué actividad está seleccionada (id o null)
    const initialSelectedByType: Record<string, number | null> = {};

    Object.entries(activitiesByType).forEach(([typeName, acts]) => {
        // Buscar si alguna actividad de este tipo está seleccionada inicialmente
        const foundSelected = acts.find((a) => selectedActivityIds.includes(a.id));
        initialSelectedByType[typeName] = foundSelected ? foundSelected.id : null;
    });

    const [selectedByType, setSelectedByType] = useState<Record<string, number | null>>(initialSelectedByType);

    // Si activitiesByType cambia, actualizar estado local de selección
    useEffect(() => {
        const newSelectedByType: Record<string, number | null> = {};
        Object.entries(activitiesByType).forEach(([typeName, acts]) => {
        const foundSelected = acts.find((a) => selectedActivityIds.includes(a.id));
        newSelectedByType[typeName] = foundSelected ? foundSelected.id : null;
        });
        setSelectedByType(newSelectedByType);
    }, [activitiesByType, selectedActivityIds]);

    // Cuando cambia selectedByType, actualizar lista de ids seleccionados global
    useEffect(() => {
        const selectedIds = Object.values(selectedByType).filter((id): id is number => id !== null);
        onSelectionChange(selectedIds);
    }, [selectedByType, onSelectionChange]);

    const handleSelectActivity = (typeName: string, activityId: number) => {
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
                        onClick={() => !loading && handleSelectActivity(typeName, activity.id)}
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
            <button onClick={() => onConfirm(Object.values(selectedByType).filter((id): id is number => id !== null))} disabled={loading}>
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
