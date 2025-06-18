    import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import CustomModal from '../../../components/NeuroXUI/CustomModal';
    import ContactModal from '../../../components/NeuroXUI/ContactModal';
    import './Home.css';
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
        <Box className="container">
        <Box className="header">
            <Button variant="contained" color="success" onClick={() => openModal('mision')}>Misión</Button>
            <img src={logoprincipal} alt="logo" className="logo" />
            <Button variant="contained" color="secondary" onClick={() => openModal('vision')}>Visión</Button>
            <Button variant="outlined" color="info" onClick={() => setContactOpen(true)}>Contacto</Button>
        </Box>

        <Box className="centro">
            <Typography variant="h4" className="tittle">Bienvenido a NeuroX</Typography>
            <img src={home} alt="home" />
            <Typography className="text">
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
