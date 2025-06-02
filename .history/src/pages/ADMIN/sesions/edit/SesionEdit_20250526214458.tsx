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

    // Cambiado: usamos title y description como en backend
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dificultadNombre, setDificultadNombre] = useState('');
    const [actividades, setActividades] = useState<any[]>([]);

    useEffect(() => {
    const fetchSesion = async () => {
        try {
            const resSesion = await fetchSessionById(Number(id));
            console.log('Respuesta de fetchSessionById:', resSesion); // DEBUG
            const sesion = resSesion.data; // cámbialo a .data.data si es necesario

            setTitle(sesion.title);
            setDescription(sesion.description);
            setDificultadNombre(sesion.difficulty?.nombre || 'Sin dificultad');

            const resActividades = await fetchActivitiesBySession(Number(id));
            const actividadesSolo = resActividades.data.map((sa: any) => sa.activity);
            setActividades(actividadesSolo);
        } catch (error) {
            console.error('Error al cargar la sesión:', error);
        }
         const resSesion = await fetchSessionById(Number(id));
console.log('Respuesta del backend:', resSesion);
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
                    {actividades.map((actividad) => (
                        <div key={actividad.id} className="actividad-card">
                            <p><strong>{actividad.nombre}</strong></p>
                            <p>Tipo: {actividad.type?.nombre}</p>
                            <p>Dificultad: {actividad.difficulty?.nombre}</p>
                        </div>
                    ))}
                </div>

                <button type="submit" className="btn-guardar">Guardar cambios</button>
            </form>
        </div>
    );
};

export default SesionEdit;
