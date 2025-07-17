// Reemplazo completo de GroupSesionGrid con MUI y 100% responsive sin Grid, solo Box

import { useEffect, useState } from 'react';
import { fetchAllSessions } from '../../../../services/ApiService';
import {
    Box,
    Typography,
    Button,
    Modal,
    Paper,
    useTheme,
    useMediaQuery,
} from '@mui/material';

const GroupSesionGrid = () => {
    const [sesiones, setSesiones] = useState<any[]>([]);
    const [selectedSesion, setSelectedSesion] = useState<any | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        fetchAllSessions().then((res) => setSesiones(res.data));
    }, []);

    const handleClickSesion = (sesion: any) => {
        setSelectedSesion(sesion);
        setShowModal(true);
    };

    const handleStartSesion = () => {
        if (selectedSesion) {
            window.location.href = `/user/Sesionesgrupales/${selectedSesion.id}`;
        }
    };

    return (
        <Box p={2} width={100} height={}>
            <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
                🧠 Modo Grupal: Selecciona una sesión
            </Typography>

            <Box
                display="flex"
                flexWrap="wrap"
                justifyContent="center"
                gap={2}
            >
                {sesiones.map((sesion) => (
                    <Paper
                        key={sesion.id}
                        elevation={3}
                        onClick={() => handleClickSesion(sesion)}
                        sx={{
                            width: isMobile ? '100%' : '200px',
                            padding: 2,
                            textAlign: 'center',
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: '#f0f0f0',
                            },
                        }}
                    >
                        <Typography variant="subtitle1" fontWeight="medium">
                            {sesion.title}
                        </Typography>
                    </Paper>
                ))}
            </Box>

            <Modal open={showModal} onClose={() => setShowModal(false)}>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    height="100vh"
                    px={2}
                >
                    <Paper
                        sx={{
                            width: '100%',
                            maxWidth: 400,
                            p: 4,
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            🚀 ¿Listo para comenzar?
                        </Typography>
                        <Typography variant="subtitle1" mb={3}>
                            <strong>{selectedSesion?.title}</strong>
                        </Typography>
                        <Box display="flex" flexDirection="column" gap={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleStartSesion}
                            >
                                Comenzar intento
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => setShowModal(false)}
                            >
                                Cancelar
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            </Modal>
        </Box>
    );
};

export default GroupSesionGrid;