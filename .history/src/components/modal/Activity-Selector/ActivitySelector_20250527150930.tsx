    import React, { useState } from 'react';
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
    // Cambiamos de un array a un objeto para guardar selección por tipo
    // clave: nombre tipo, valor: id de la actividad seleccionada
    const initialSelectedByType: Record<string, number | null> = {};

    // Inicializamos con selectedActivityIds y actividades
    activities.forEach((activity) => {
        if (selectedActivityIds.includes(activity.id)) {
        initialSelectedByType[activity.type.name] = activity.id;
        } else if (!(activity.type.name in initialSelectedByType)) {
        initialSelectedByType[activity.type.name] = null;
        }
    });

    const [selectedByType, setSelectedByType] = useState<Record<string, number | null>>(initialSelectedByType);

    // Al seleccionar una actividad, actualizamos solo esa selección por tipo
    const handleSelection = (typeName: string, activityId: number) => {
        setSelectedByType((prev) => ({
        ...prev,
        [typeName]: activityId,
        }));
    };

    // Al confirmar, obtenemos todos los ids seleccionados (sin nulls)
    const handleConfirm = () => {
        const selectedIds = Object.values(selectedByType).filter((id): id is number => id !== null);
        onConfirm(selectedIds);
    };

    // Agrupamos actividades por tipo (igual que antes)
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
                            name={type} // agrupamos por tipo
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
            <div className="modal-buttons">
            <button onClick={handleConfirm}>✅ Confirmar</button>
            <button onClick={onClose}>❌ Cancelar</button>
            </div>
        </div>
        </div>
    );
    };

    export default ActivitySelector;
