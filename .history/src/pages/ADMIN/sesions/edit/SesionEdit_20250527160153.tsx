    import React, { useEffect, useState } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import {
        fetchSessionById,
        fetchActivitiesBySession,
        updateSessionBasic
    } from '../../../../services/ApiService';
    import LoadingOve
    import './SesionEdit.css';

    const SesionEdit = () => {
        const { id } = useParams();
        const navigate = useNavigate();

        const [title, setTitle] = useState('');
        const [description, setDescription] = useState('');
        const [dificultadNombre, setDificultadNombre] = useState('Sin dificultad');
        const [actividades, setActividades] = useState<any[]>([]);
        const [loading, setLoading] = useState(false);

        useEffect(() => {
            const fetchSesion = async () => {
                setLoading(true);
                try {
                    const resSesion = await fetchSessionById(Number(id));
                    const sesion = resSesion.data;

                    setTitle(sesion.title);
                    setDescription(sesion.description);
                    setDificultadNombre(sesion.difficulty?.name || 'Sin dificultad');

                    const resActividades = await fetchActivitiesBySession(Number(id));
                    const actividadesSolo = resActividades.data.map((sa: any) => sa.activity);
                    setActividades(actividadesSolo);
                } catch (error) {
                    console.error('Error al cargar la sesión:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchSesion();
        }, [id]);

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setLoading(true);
            try {
                await updateSessionBasic(Number(id), { title, description });
                alert('Sesión actualizada correctamente');
                navigate('/app/gestionar-sesiones');
            } catch (error) {
                console.error('Error al actualizar la sesión:', error);
                alert('Hubo un error al actualizar la sesión');
            } finally {
                setLoading(false);
            }
        };

        return (
            <div className="sesion-edit-container">
                <h2>Editar Sesión</h2>

                {/* LoadingOverlay aparece encima de todo cuando loading=true */}
                <LoadingOverlay visible={loading} message="Cargando..." />

                <form onSubmit={handleSubmit} className="sesion-edit-form">
                    <label>
                        Título:
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            disabled={loading} // opcional para evitar editar mientras carga o guarda
                        />
                    </label>

                    <label>
                        Descripción:
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            disabled={loading} // igual para textarea
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
                                    <p><strong>{actividad.title || actividad.nombre}</strong></p>
                                </div>
                            ))
                        ) : (
                            <p>No hay actividades asignadas.</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn-guardar"
                        disabled={loading} // evitar clicks múltiples
                    >
                        Guardar cambios
                    </button>
                </form>
            </div>
        );
    };

    export default SesionEdit;
