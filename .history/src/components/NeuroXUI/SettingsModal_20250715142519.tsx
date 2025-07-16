import React from 'react';
import {
    Modal,
    Box,
    Typography,
    IconButton,
    Divider,
    useTheme,
    useMediaQuery,
    Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface SettingsModalProps {
    open: boolean;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onClose }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: isMobile ? '90vw' : '50vw',
                    maxWidth: 600,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 3,
                    maxHeight: '90vh',
                    overflowY: 'auto',
                }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" fontWeight="bold">
                        Ajustes
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Aquí puedes meter tus opciones reales */}
                <Typography variant="body1" mb={2}>
                    Opciones de configuración vendrán aquí.
                </Typography>

                <Button variant="contained" color="primary" fullWidth>
                    Guardar cambios
                </Button>
            </Box>
        </Modal>
    );
};

export default SettingsModal;
