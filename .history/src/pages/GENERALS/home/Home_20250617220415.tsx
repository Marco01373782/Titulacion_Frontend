import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomModal from '../../../components/NeuroXUI/CustomModal';
import ContactModal from '../../../components/NeuroXUI/ContactModal';
import home from '../../../assets/home.png';
import logoprincipal from '../../../assets/imagenes/logo_principal.webp';
import { Box, Button, Typography } from '@mui/material';

const Home: React.FC = () => {
  const [modalData, setModalData] = useState<{ title: string; content: string } | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const navigate = useNavigate();

  const openModal = (type: 'mision' | 'vision') => {
    if (type === 'mision') {
      setModalData({
        title: 'Misión',
        content: 'Proporcionar una solución accesible y efectiva de terapia cognitiva para adultos mayores...'
      });
    } else {
      setModalData({
        title: 'Visión',
        content: 'Ser la plataforma de referencia en el cuidado cognitivo de adultos mayores...'
      });
    }
  };

  const closeModal = () => setModalData(null);

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        p: 2 
      }}
    >
      <Box 
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          mb: 4,
          flexWrap: 'wrap'
        }}
      >
        <Button variant="contained" color="success" onClick={() => openModal('mision')}>Misión</Button>
        <Box component="img" src={logoprincipal} alt="logo" sx={{ width: 120, height: 'auto' }} />
        <Button variant="contained" color="secondary" onClick={() => openModal('vision')}>Visión</Button>
        <Button variant="outlined" color="info" onClick={() => setContactOpen(true)}>Contacto</Button>
      </Box>

      <Box sx={{ textAlign: 'center', maxWidth: 600 }}>
        <Typography variant="h4" gutterBottom>Bienvenido a NeuroX</Typography>
        <Box component="img" src={home} alt="home" sx={{ width: '100%', maxWidth: 400, mb: 2 }} />
        <Typography variant="body1" paragraph>
          Una plataforma diseñada para acompañar, estimular y apoyar el bienestar cognitivo...
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/login')}>Iniciar Sesión</Button>
      </Box>

      {/* Modal Mision/Vision */}
      {modalData && (
        <CustomModal
          open={!!modalData}
          title={modalData.title}
          content={modalData.content}
          onClose={closeModal}
        />
      )}

      {/* Modal Contacto */}
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </Box>
  );
};

export default Home;
