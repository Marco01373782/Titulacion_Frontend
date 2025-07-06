    import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import CustomModal from '../../../components/NeuroXUI/CustomModal';
    import ContactModal from '../../../components/NeuroXUI/ContactModal';
    import home from '../../../assets/home.png';
    import logoprincipal from '../../../assets/imagenes/logo_principal.webp';
    import logoIcono from '../../../assets/imagenes/logo_icono.webp';
    import logoTexto from '../../../assets/imagenes/logo_text.webp';
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
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#F4F5FA',
            p: 2
        }}
        >
        {/* Fondo decorativo con logos grandes y translúcidos */}
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
            justifyContent: 'center'
            }}
        >
            {/* Header responsive */}
            <Box
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 4,
                gap: 2,
            }}
            >
            {/* Top row (en móvil solo 2 botones + logo en el centro) */}
            <Box
                sx={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: { xs: 1, md: 0 },
                }}
            >
                <Button 
                    variant="contained" 
                    color="success" 
                    onClick={() => openModal('mision')}
                    sx={{ 
                        flexGrow: { xs: 1, md: 0 },  // Crece solo en móvil, no en desktop
                        mr: { xs: 1, md: 2 },        // Margen derecho pequeño en móvil, más grande en desktop
                        minWidth: { md: 120 }        // Anchura mínima para que no sean gigantes ni pequeños en desktop
                    }}
                    >
                    Misión
                    </Button>

                <Box 
                component="img" 
                src={logoprincipal} 
                alt="logo" 
                sx={{ 
                    width: 120, 
                    height: 'auto', 
                    mx: 1, 
                    flexShrink: 0,
                    margin: '0 auto',
                }} 
                />

                <Button 
                variant="contained" 
                color="secondary" 
                onClick={() => openModal('vision')}
                sx={{ 
                    flexGrow: { xs: 1, md: 0 },  // Igual que arriba
                    ml: { xs: 1, md: 2 },        // Margen izquierdo pequeño en móvil, más grande en desktop
                    minWidth: { md: 120 }
                }}
                >
                Visión
                </Button>
            </Box>

            {/* Contacto abajo en móvil, a la derecha en desktop */}
            <Box
                sx={{
                mt: { xs: 1, md: 0 },
                width: { xs: '100%', md: 'auto' },
                display: 'flex',
                justifyContent: { xs: 'center', md: 'flex-end' },
                }}
            >
                <Button variant="outlined" color="info" onClick={() => setContactOpen(true)} sx={{ minWidth: 120 }}>
                Contacto
                </Button>
            </Box>
            </Box>

            <Box sx={{ textAlign: 'center', maxWidth: 600 }}>
            <Typography variant="h4" gutterBottom>Bienvenido a NeuroX</Typography>
            <Box component="img" src={home} alt="home" sx={{ width: '100%', maxWidth: 400, mb: 2 }} />
            <Typography variant="body1" paragraph fontWeight={800} font>
                Una plataforma diseñada para acompañar, estimular y apoyar el bienestar cognitivo de los adultos mayores...
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
        </Box>
    );
    };

    export default Home;
