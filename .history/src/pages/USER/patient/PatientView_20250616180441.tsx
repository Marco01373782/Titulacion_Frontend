    import { useEffect, useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { getPacientePorUsuario } from '../../../services/ApiService';
    import './patientView.css';

    interface Patient {
    id: number;
    firstname: string;
    secondname?: string;
    surname: string;
    age: number;
    photoUrl?: string;
    gender: string;
    }

    const PatientView = () => {
    const [patient, setPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
        alert('Inicia sesión primero');
        navigate('/login');
        return;
        }

        getPacientePorUsuario(userId)
        .then((res) => {
            setPatient(res.data);
            setLoading(false);
        })
        .catch((err) => {
            console.error('Error al cargar paciente:', err);
            alert('Error al cargar los datos del paciente');
            setLoading(false);
        });
    }, [navigate]);

    if (loading) return <p style={{textAlign: 'center'}}>Cargando paciente...</p>;

    if (!patient) return <p style={{textAlign: 'center'}}>No se encontró paciente registrado.</p>;

    return (
        <div className="container-patientview">
        <div className="photo-container">
            {patient.photoUrl ? (
            <img src={patient.photoUrl} alt="Foto del paciente" className="patient-photo" />
            ) : (
            <div className="no-photo">Sin foto</div>
            )}
        </div>

        <h2 className="patient-name">
            {patient.firstname} {patient.secondname ?? ''} {patient.surname}
        </h2>

        <div className="patient-info">
            <div className="info-item">
            <span className="label">Edad:</span> {patient.age} años
            </div>
            <div className="info-item">
            <span className="label">Género:</span> {patient.gender}
            </div>
        </div>
        </div>
    );
    };

    export default PatientView;
