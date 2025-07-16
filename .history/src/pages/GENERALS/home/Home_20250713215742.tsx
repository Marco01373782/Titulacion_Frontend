import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomModal from '../../../components/NeuroXUI/CustomModal';
import home from '../../../assets/home.png';
import logoprincipal from '../../../assets/imagenes/logo_principal.webp';
import logoIcono from '../../../assets/imagenes/logo_icono.webp';
import logoTexto from '../../../assets/imagenes/logo_text.webp';
import { Box, Button, Typography } from '@mui/material';

const Home: React.FC = () => {
  const [modalData, setModalData] = useState<{ title: string; content: string } | null>(null);
  const navigate = useNavigate();

  const openModal = (type: 'mision' | 'vision') => {
    setModalData({
      title: type === 'mision' ? 'Misión' : 'Visión',
      content:
        type === 'mision'
          ? 'Proporcionar una solución accesible y efectiva de terapia cognitiva para adultos mayores, promoviendo su bienestar mental y calidad de vida.'
          : 'Ser la plataforma de referencia en el cuidado cognitivo de adultos mayores, integrando tecnología, empatía y ciencia para un envejecimiento activo.'
    });
  };

  const closeModal = () => setModalData(null);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#F4F5FA',
        p: 2,
      }}
    >
      {/* Fondo decorativo translúcido */}
      <Box
        sx={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 0,
          backgroundImage: `url(${logoIcono}), url(${logoTexto})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '300px, 500px',
          backgroundPosition: 'top left, bottom right',
          opacity: 0.05,
        }}
      />

      {/* Contenido principal */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2
        }}
      >
        {/* Header con botones y logo */}
        <Box
          sx={{
            width: '100%',
            maxWidth: 1200,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            mb: 4,
            px: { xs: 1, sm: 2, md: 3 }
          }}
        >
          <Button
            variant="contained"
            color="success"
            onClick={() => openModal('mision')}
            sx={{
              flex: '1 1 auto',
              minWidth: 100
            }}
          >
            Misión
          </Button>

          <Box
            component="img"
            src={logoprincipal}
            alt="logo principal"
            sx={{
              width: { xs: 90, sm: 110, md: 140 },
              height: 'auto',
              mx: 2
            }}
          />

          <Button
            variant="contained"
            color="secondary"
            onClick={() => openModal('vision')}
            sx={{
              flex: '1 1 auto',
              minWidth: 100
            }}
          >
            Visión
          </Button>
        </Box>

        {/* Sección central */}
        <Box
          sx={{
            width: '100%',
            maxWidth: 600,
            textAlign: 'center',
            px: { xs: 1, sm: 2 }
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            fontWeight={700}
            sx={{ fontSize: { xs: '1.8rem', sm: '2rem', md: '2.2rem' } }}
          >
            Bienvenido a NeuroX
          </Typography>

          <Box
            component="img"
            src={home}
            alt="Imagen principal"
            sx={{
              width: '100%',
              maxWidth: { xs: 260, sm: 300, md: 400 },
              mb: 2
            }}
          />

          <Typography
            variant="body1"
            paragraph
            fontSize={18}
            fontWeight={500}
            sx={{ px: 1 }}
          >
            Una plataforma diseñada para acompañar, estimular y apoyar el bienestar cognitivo de los adultos mayores a través de actividades significativas.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/login')}
            sx={{ mt: 2 }}
          >
            Iniciar Sesión
          </Button>
        </Box>

        {/* Modal Misión / Visión */}
        {modalData && (
          <CustomModal
            open={!!modalData}
            title={modalData.title}
            content={modalData.content}
            onClose={closeModal}
          />
        )}
      </Box>
    </Box>
  );
};

export default Home;
