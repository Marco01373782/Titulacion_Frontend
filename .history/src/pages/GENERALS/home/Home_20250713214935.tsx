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
    const navigate = useNavigate();

    const openModal = (type: 'mision' | 'vision') => {
        setModalData({
            title: type === 'mision' ? 'Misión' : 'Visión',
            content:
                type === 'mision'
                    ? 'Proporcionar una solución accesible y efectiva de terapia cognitiva para adultos mayores...'
                    : 'Ser la plataforma de referencia en el cuidado cognitivo de adultos mayores...'
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
                p: 2
            }}
        >
            {/* Fondo decorativo */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    zIndex: 0,
                    backgroundImage: `url(${logoIcono}), url(${logoTexto})`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '300px, 500px',
                    backgroundPosition: 'top left, bottom right',
                    opacity: 0.05
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
                {/* Header */}
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 4,
                        gap: 2
                    }}
                >
                    {/* Botones + logo */}
                    <Box
                        sx={{
                            display: 'flex',
                            width: '100%',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <Button
                            variant="contained"
                            color="success"
                            onClick={() => openModal('mision')}
                            sx={{
                                flexGrow: { xs: 1, md: 0 },
                                mr: { xs: 1, md: 2 },
                                minWidth: { md: 120 }
                            }}
                        >
                            Misión
                        </Button>

                        <Box
                            component="img"
                            src={logoprincipal}
                            alt="logo"
                            sx={{
                                width: { xs: 100, md: 120 },
                                height: 'auto',
                                mx: 1,
                                flexShrink: 0
                            }}
                        />

                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => openModal('vision')}
                            sx={{
                                flexGrow: { xs: 1, md: 0 },
                                ml: { xs: 1, md: 2 },
                                minWidth: { md: 120 }
                            }}
                        >
                            Visión
                        </Button>
                    </Box>
                </Box>

                {/* Sección central */}
                <Box sx={{ textAlign: 'center', maxWidth: 600 }}>
                    <Typography
                        variant="h4"
                        gutterBottom
                        fontWeight={700}
                        sx={{ fontSize: { xs: '1.8rem', md: '2.2rem' } }}
                    >
                        Bienvenido a NeuroX
                    </Typography>

                    <Box
                        component="img"
                        src={home}
                        alt="home"
                        sx={{
                            width: '100%',
                            maxWidth: { xs: 280, md: 400 },
                            mb: 2
                        }}
                    />

                    <Typography
                        variant="body1"
                        paragraph
                        fontSize={18}
                        fontWeight={500}
                        sx={{ px: 2 }}
                    >
                        Una plataforma diseñada para acompañar, estimular y apoyar el bienestar cognitivo de los adultos mayores...
                    </Typography>

                    <Button variant="contained" color="primary" onClick={() => navigate('/login')}>
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

                {/* ContactModal eliminado */}
            </Box>
        </Box>
    );
};

export default Home;
