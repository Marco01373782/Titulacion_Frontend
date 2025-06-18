import React, { useEffect, useState } from 'react';
import { getPacientePorUsuario } from '../../../services/ApiService';
import PatientIntro from './PatientIntro';
import RegisterPatient from './RegisterPatient';
import PatientView from './PatientView';

const PacienteFlow = () => {
  const [loading, setLoading] = useState(true);
  const [paciente, setPaciente] = useState(null);
  const [showIntro, setShowIntro] = useState(false);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      // Aquí podrías redirigir a login o lo que convenga
      return;
    }

    getPacientePorUsuario(userId)
      .then(res => {
        if (res.data) {
          setPaciente(res.data);
          setLoading(false);
        } else {
          setShowIntro(true);
          setLoading(false);
        }
      })
      .catch(() => {
        setShowIntro(true);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div>Cargando...</div>;

  if (showIntro) return <PatientIntro onContinue={() => setShowIntro(false)} />;

  if (!paciente) return <RegisterPatient />;

  return <PatientView paciente={paciente} />;
};

export default PacienteFlow;
