import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Avatar,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Paper,
  Button
} from '@mui/material';
import { getPacientePorUsuario } from '../../../services/ApiService';

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  if (loading) {
    return (
      <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!patient) {
    return (
      <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
        <Typography variant="h6" color="text.secondary">
          No se encontró paciente registrado.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      p={2}
      bgcolor={theme.palette.background.default}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          maxWidth: 500,
          width: '100%',
          borderRadius: 3,
          textAlign: 'center',
          backgroundColor: theme.palette.background.paper
        }}
      >
        <Avatar
          src={patient.photoUrl || ''}
          sx={{
            width: isMobile ? 150 : 200,
            height: isMobile ? 150 : 200,
            margin: '0 auto',
            mb: 2,
            bgcolor: theme.palette.grey[300]
          }}
        >
          {!patient.photoUrl && 'Sin foto'}
        </Avatar>

        <Typography variant="h4" color="primary" mb={2}>
          {patient.firstname} {patient.secondname ?? ''} {patient.surname}
        </Typography>

        <Box display="flex" flexDirection="column" gap={1} alignItems="center" mb={3}>
          <Typography variant="body1" color="text.secondary">
            <strong>Edad:</strong> {patient.age} años
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <strong>Género:</strong> {patient.gender}
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/user/patient-edit')}
          fullWidth
          size="large"
        >
          Editar Información
        </Button>
      </Paper>
    </Box>
  );
};

export default PatientView;
