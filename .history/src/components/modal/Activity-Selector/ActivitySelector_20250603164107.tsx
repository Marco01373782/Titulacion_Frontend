import { Activity} from "../../../Types/ActivityTypes";

interface Props {
  activitiesByType: Record<string, Activity[]>; // agrupado por tipo de actividad
  selectedActivityIds: number[];
  onSelectionChange: React.Dispatch<React.SetStateAction<number[]>>;
  onClose: () => void;
  onConfirm: (selectedIds: number[]) => void;
  loading: boolean;
}

const ActivitySelector: React.FC<Props> = ({
  activitiesByType,
  selectedActivityIds,
  onSelectionChange,
  onClose,
  onConfirm,
  loading,
}) => {
    // Filtrar actividades por la dificultad de la sesión
    const filteredActivities = activities.filter(
        (a) => a.difficulty.id === sessionDifficultyId
    );

    // Agrupar actividades filtradas por tipo (por nombre)
    const groupedByType = filteredActivities.reduce<Record<string, Activity[]>>((acc, activity) => {
        const typeName = activity.type.name;
        if (!acc[typeName]) acc[typeName] = [];
        acc[typeName].push(activity);
        return acc;
    }, {});

    // Estado que guarda por tipo qué actividad está seleccionada (id o null)
    const initialSelectedByType: Record<string, number | null> = {};

    Object.entries(groupedByType).forEach(([typeName, acts]) => {
        // Buscar si alguna de las actividades de este tipo está en selectedActivityIds para inicializar estado
        const foundSelected = acts.find((a) => selectedActivityIds.includes(a.id));
        initialSelectedByType[typeName] = foundSelected ? foundSelected.id : null;
    });

    const [selectedByType, setSelectedByType] = useState<Record<string, number | null>>(initialSelectedByType);

    const handleSelection = (typeName: string, activityId: number) => {
        setSelectedByType((prev) => ({
        ...prev,
        [typeName]: activityId,
        }));
    };

    const handleConfirm = () => {
        // Extraer ids seleccionados, filtrando null
        const selectedIds = Object.values(selectedByType).filter((id): id is number => id !== null);
        onConfirm(selectedIds);
    };

    return (
        <div className="activity-selector-overlay">
        <div className="activity-selector-modal">
            <h3>Selecciona una actividad por tipo</h3>

            {Object.entries(groupedByType).map(([type, acts]) => (
            <div key={type} className="activity-group">
                <h4>{type}</h4>
                <ul>
                {acts.map((activity) => (
                    <li key={activity.id}>
                    <label>
                        <input
                        type="radio"
                        name={type} // nombre por tipo para grupo radio
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
