import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    fetchSessionById,
    fetchActivitiesBySession,
    updateSessionBasic
} from '../../../../services/ApiService';
import './SesionEdit.css';

const SesionEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dificultadNombre, setDificultadNombre] = useState('Sin dificultad');
    const [actividades, setActividades] = useState<any[]>([]);

    useEffect(() => {
        const fetchSesion = async () => {
            try {
                const resSesion = await fetchSessionById(Number(id));
                // Ajusta según cómo venga la estructura exacta
                const sesion = resSesion.data; // o resSesion.data.data si es necesario

                setTitle(sesion.title);
                setDescription(sesion.description);
                setDificultadNombre(sesion.difficulty?.name || 'Sin dificultad');

                const resActividades = await fetchActivitiesBySession(Number(id));
                // Aquí suponemos que cada item tiene un objeto "activity"
                // Ajusta según cómo venga la data
                const actividadesSolo = resActividades.data.map((sa: any) => sa.activity);
                setActividades(actividadesSolo);
            } catch (error) {
                console.error('Error al cargar la sesión:', error);
            }
        };

        fetchSesion();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await updateSessionBasic(Number(id), { title, description });
            alert('Sesión actualizada correctamente');
            navigate('/app/gestionar-sesiones');
        } catch (error) {
            console.error('Error al actualizar la sesión:', error);
            alert('Hubo un error al actualizar la sesión');
        }
    };

    return (
        <div className="sesion-edit-container">
            <h2>Editar Sesión</h2>
            <form onSubmit={handleSubmit} className="sesion-edit-form">
                <label>
                    Título:
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Descripción:
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                    />
                </label>

                <div className="readonly-field">
                    <strong>Dificultad:</strong> {dificultadNombre}
                </div>

                <div className="actividades-lista">
                    <h4>Actividades asignadas:</h4>
                    {actividades.length > 0 ? (
                        actividades.map((actividad) => (
                            <div key={actividad.id} className="actividad-card">
                                <p><strong>{actividad.name || actividad.nombre}</strong></p>
                            </div>
                        ))
                    ) : (
                        <p>No hay actividades asignadas.</p>
                    )}
                </div>

                <button type="submit" className="btn-guardar">Guardar cambios</button>
            </form>
        </div>
    );
};

export default SesionEdit;
