import React, { useEffect, useState } from 'react';
import { getPacientePorUsuario } from '../../../services/ApiService';
import PatientIntro from '../../pages/USER/patient/PatientIntro';
import RegisterPatient from '../../pages/USER/patient/patientRegister';
import PatientView from '../../pages/USER/patient/PatientView';

const PacienteFlow = () => {
  const [loading, setLoading] = useState(true);
  const [paciente, setPaciente] = useState<any>(null);
  const [showIntro, setShowIntro] = useState(false);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      // Aquí podrías redirigir a login o mostrar mensaje
      setLoading(false);
      return;
    }

    getPacientePorUsuario(userId)
      .then(res => {
        if (res.data && Object.keys(res.data).length > 0) {
          setPaciente(res.data);
        } else {
          setShowIntro(true);
        }
      })
      .catch(() => {
        // Si hay error (ej. 404 paciente no encontrado) mostramos intro
        setShowIntro(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div>Cargando...</div>;

  if (showIntro) return <PatientIntro onContinue={() => setShowIntro(false)} />;

  if (!paciente) return <RegisterPatient />;

  return <PatientView paciente={paciente} />;
};

export default PacienteFlow;
