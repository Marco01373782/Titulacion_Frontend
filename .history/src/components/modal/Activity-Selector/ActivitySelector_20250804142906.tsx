    import React, { useState, useEffect } from 'react';
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

    const tipoLabels: Record<string, string> = {
    MEMORIA: 'Memoria',
    RAZONAMIENTO_LOGICO: 'Razonamiento Lógico',
    ATENCION_Y_CONCENTRACION: 'Atención y Concentración',
    };

    const ActivitySelector: React.FC<Props> = ({
    activitiesByType,
    selectedActivityIds,
    onSelectionChange,
    onConfirm,
    onClose,
    loading = false,
    }) => {
    const [selectedByType, setSelectedByType] = useState<Record<string, number | null>>({});

    useEffect(() => {
        const initial: Record<string, number | null> = {};
        Object.entries(activitiesByType).forEach(([typeName, acts]) => {
        const found = acts.find((a) => selectedActivityIds.includes(a.id));
        initial[typeName] = found ? found.id : null;
        });
        setSelectedByType(initial);
    }, [activitiesByType, selectedActivityIds]);

    useEffect(() => {
        const ids = Object.values(selectedByType).filter((id): id is number => id !== null);
        onSelectionChange(ids);
    }, [selectedByType]);

    const handleSelectActivity = (typeName: string, activityId: number) => {
        if (loading) return;
        setSelectedByType((prev) => ({
        ...prev,
        [typeName]: prev[typeName] === activityId ? null : activityId,
        }));
    };

    return (
        <div className="selector-backdrop">
        <div className="selector-modal">
            <h3>Selecciona una actividad por tipo</h3>

            <div className="selector-content">
            {Object.entries(activitiesByType).map(([typeName, acts]) => (
                <div key={typeName} className="selector-type-group">
                <h4>{tipoLabels[typeName] || typeName}</h4>
                <ul className="selector-activity-list">
                    {acts.map((activity) => {
                    const isSelected = selectedByType[typeName] === activity.id;
                    return (
                        <li
                        key={activity.id}
                        className={`selector-activity-item ${isSelected ? 'selected' : ''}`}
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

            <div className="selector-buttons">
            <button
                onClick={() =>
                onConfirm(Object.values(selectedByType).filter((id): id is number => id !== null))
                }
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
