    import { useEffect, useState } from 'react';
    import { fetchAllSessions } from '../../../../services/ApiService';
    import './GroupSesionGrid.css';
    import './GroupSesionModal.css';

    const GroupSesionGrid = () => {
    const [sesiones, setSesiones] = useState<any[]>([]);
    const [selectedSesion, setSelectedSesion] = useState<any | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);

    useEffect(() => {
        fetchAllSessions().then((res) => setSesiones(res.data));
    }, []);

    const handleClickSesion = (sesion: any) => {
        setSelectedSesion(sesion);
        setShowModal(true);
    };

    const handleStartSesion = () => {
        if (selectedSesion) {
        window.location.href = `/user/Sesionesgrupales/${selectedSesion.id}`;
        }
    };

    return (
        <div className="group-grid-container">
        <h2 className="title">🧠 Modo Grupal: Selecciona una sesión</h2>
        <div className="group-grid">
            {sesiones.map((sesion) => (
            <div
                key={sesion.id}
                className="group-grid-item"
                onClick={() => handleClickSesion(sesion)}
            >
                <h3>{sesion.title}</h3>
                <p>{sesion.description}</p>
            </div>
            ))}
        </div>

        {showModal && selectedSesion && (
            <div className="modal-overlay">
            <div className="modal-content">
                <h2>🚀 ¿Listo para comenzar?</h2>
                <p><strong>{selectedSesion.title}</strong></p>
                <p>{selectedSesion.description}</p>
                <div className="modal-buttons">
                <button className="btn start" onClick={handleStartSesion}>
                    Comenzar intento
                </button>
                <button className="btn cancel" onClick={() => setShowModal(false)}>
                    Cancelar
                </button>
                </div>
            </div>
            </div>
        )}
        </div>
    );
    };

    export default GroupSesionGrid;
