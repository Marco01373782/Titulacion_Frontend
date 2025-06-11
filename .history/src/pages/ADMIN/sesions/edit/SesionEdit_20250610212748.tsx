import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    fetchSessionById,
    fetchActivitiesBySession,
    updateSessionBasic
} from '../../../../services/ApiService';
import LoadingOverlay from '../../../../components/modal/Loading/LoadingOverlay';
import Toast from '../../../../components/toast/Toast';
import './SesionEdit.css';

const SesionEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dificultadNombre, setDificultadNombre] = useState('Sin dificultad');
    const [actividades, setActividades] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

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
                const actividadesSolo = resActividades.map((sa: any) => sa.activity);

                setActividades(actividadesSolo);
            } catch (error) {
                console.error('Error al cargar la sesión:', error);
                setToast({ message: 'No se pudo cargar la sesión.', type: 'error' });
            } finally {
                setLoading(false);
            }
        };

        fetchSesion();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            setToast({ message: 'El título es obligatorio.', type: 'error' });
            return;
        }

        setSaving(true);
        try {
            await updateSessionBasic(Number(id), { title, description });

            setToast({ message: 'Sesión actualizada correctamente', type: 'success' });

            
            setTimeout(() => {
                navigate('/admin/gestionar-sesiones');
            }, 1500);
        } catch (error) {
            console.error('Error al actualizar la sesión:', error);
            setToast({ message: 'No se pudo actualizar la sesión.', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="sesion-edit-container">
            <h2>Editar Sesión</h2>

            {/* LoadingOverlay visible cuando carga o guarda */}
            <LoadingOverlay visible={loading || saving} message={saving ? 'Actualizando sesión...' : 'Cargando sesión...'} />

            <form onSubmit={handleSubmit} className="sesion-edit-form">
                <label>
                    Título:
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        disabled={loading || saving}
                    />
                </label>

                <label>
                    Descripción:
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        disabled={loading || saving}
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
                    disabled={loading || saving}
                >
                    Guardar cambios
                </button>
            </form>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default SesionEdit;
