    import { useEffect, useState } from 'react';
    import { Link } from 'react-router-dom';
    
    import './SesionList.css';

    interface Difficulty {
    id: number;
    name: string;
    }

    interface Session {
    id: number;
    title: string;
    description: string;
    difficulty: {
        id: number;
        name: string;
    };
    }

    const SessionList = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
    const [difficulties, setDifficulties] = useState<Difficulty[]>([]);
    const [selectedDifficulty, setSelectedDifficulty] = useState<number | 'all'>('all');

    useEffect(() => {
        const fetchData = async () => {
        try {
            const sesRes = await fetchSessions();
            setSessions(sesRes.data);
            setFilteredSessions(sesRes.data);

            const diffRes = await fetchDifficulties();
            setDifficulties(diffRes.data);
        } catch (err) {
            console.error('Error al cargar sesiones o dificultades', err);
        }
        };
        fetchData();
    }, []);

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value === 'all' ? 'all' : Number(e.target.value);
        setSelectedDifficulty(value);

        if (value === 'all') {
        setFilteredSessions(sessions);
        } else {
        setFilteredSessions(sessions.filter(s => s.difficulty.id === value));
        }
    };

    return (
        <div className="session-list-container">
        <h2>Gestión de Sesiones</h2>

        <div className="filter-bar">
            <label>Filtrar por dificultad:</label>
            <select value={selectedDifficulty} onChange={handleFilterChange}>
            <option value="all">Todas</option>
            {difficulties.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
            ))}
            </select>

            <Link to="/app/crear-sesion" className="btn-create">Crear nueva sesión</Link>
        </div>

        <ul className="session-list">
            {filteredSessions.map(session => (
            <li key={session.id} className="session-card">
                <div>
                <h3>{session.title}</h3>
                <p>{session.description}</p>
                <span className="tag">{session.difficulty.name}</span>
                </div>
                <Link to={`/app/editar-sesion/${session.id}`} className="btn-edit">Editar</Link>
            </li>
            ))}
        </ul>
        </div>
    );
    };

    export default SessionList;
