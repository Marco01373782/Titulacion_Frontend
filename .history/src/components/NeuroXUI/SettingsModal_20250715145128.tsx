/*import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    IconButton,
    Divider,
    useTheme,
    useMediaQuery,
    Button,
    Switch,
    FormControlLabel,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface SettingsModalProps {
    open: boolean;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onClose }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [darkMode, setDarkMode] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [confirmReset, setConfirmReset] = useState(false);

    const handleReset = () => {
        // Aquí pondrías tu lógica real, por ejemplo:
        console.log('¡Progreso borrado!');
        setConfirmReset(false);
    };

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

                {/* Modo oscuro */}
                <FormControlLabel
                    control={
                        <Switch
                            checked={darkMode}
                            onChange={() => setDarkMode(!darkMode)}
                            color="primary"
                        />
                    }
                    label="Modo oscuro"
                />

                {/* Sonido */}
                <FormControlLabel
                    control={
                        <Switch
                            checked={soundEnabled}
                            onChange={() => setSoundEnabled(!soundEnabled)}
                            color="primary"
                        />
                    }
                    label="Sonido activado"
                />

                {/* Borrar progreso */}
                <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => setConfirmReset(true)}
                >
                    Borrar todo mi progreso
                </Button>

                {/* Diálogo de confirmación */}
                <Dialog
                    open={confirmReset}
                    onClose={() => setConfirmReset(false)}
                >
                    <DialogTitle>¿Estás seguro?</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Esto eliminará todo tu progreso. Esta acción no se puede deshacer.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmReset(false)} color="primary">
                            Cancelar
                        </Button>
                        <Button onClick={handleReset} color="error">
                            Confirmar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Modal>
    );
};

export default SettingsModal;
