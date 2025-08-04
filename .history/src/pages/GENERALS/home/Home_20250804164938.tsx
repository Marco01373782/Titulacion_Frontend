import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomModal from '../../../components/NeuroXUI/CustomModal';

import home from '../../../assets/imagenes/home.webp';
import logoprincipal from '../../../assets/imagenes/logo_principal.webp';
import logoIcono from '../../../assets/imagenes/logo_icono.webp';
import logoTexto from '../../../assets/imagenes/logo_text.webp';

import {
    Box,
    Button,
    Typography,
    IconButton,
    useTheme,
    useMediaQuery
} from '@mui/material';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';

const NavegadorBanner: React.FC = () => {
    const [visible, setVisible] = useState(true); // siempre visible al cargar
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleClose = () => {
        setVisible(false);
        // ya no guardamos nada en localStorage
    };

    if (!visible) return null;

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1500,
                bgcolor: theme.palette.background.paper,
                borderBottom: `1px solid ${theme.palette.divider}`,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                px: 2,
                py: isMobile ? 1 : 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
            }}
        >
            <InfoOutlinedIcon sx={{ color: theme.palette.primary.main, fontSize: 22 }} />
            <Typography
                variant={isMobile ? 'body2' : 'body1'}
                sx={{ color: theme.palette.text.primary }}
            >
                Para una mejor experiencia, se recomienda usar <strong>Google Chrome</strong>.
            </Typography>

            <IconButton
                onClick={handleClose}
                size="small"
                sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}
                aria-label="Cerrar sugerencia de navegador"
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </Box>
    );
};


const Home: React.FC = () => {
    const [modalData, setModalData] = useState<{ title: string; content: string } | null>(null);
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
        <>
            <NavegadorBanner />

            <Box
                sx={{
                    minHeight: '100vh',
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: '#F4F5FA',
                    p: 2,

                }}
            >

                <Box
                    sx={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        zIndex: 0,
                        backgroundImage: `url(${logoIcono}), url(${logoTexto})`,
                        backgroundRepeat: 'repeat',
                        backgroundSize: '300px, 500px',
                        backgroundPosition: 'top left, bottom right',
                        opacity: 0.08,
                    }}
                />

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
                                    flexGrow: { xs: 1, md: 0 },
                                    ml: { xs: 1, md: 2 },
                                    minWidth: { md: 120 }
                                }}
                            >
                                Visión
                            </Button>
                        </Box>

                    </Box>

                    <Box sx={{ textAlign: 'center', maxWidth: 600 }}>
                        <Typography variant="h2" gutterBottom fontWeight={700}>Bienvenido a NeuroX</Typography>
                        <Box component="img" src={home} alt="home" sx={{ width: '100%', maxWidth: 370, mb: 3 }} />
                        <Typography variant="body1" paragraph fontSize={19} fontWeight={600}>
                            Una plataforma diseñada para acompañar, estimular y apoyar el bienestar cognitivo de los adultos mayores...
                        </Typography>
                        <Button variant="contained" color="primary" onClick={() => navigate('/login')}>Iniciar Sesión</Button>
                    </Box>

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
        </>
    );
};

export default Home;
