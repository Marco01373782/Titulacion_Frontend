import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    useMediaQuery,
    useTheme,
    Box,
    IconButton
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';

const NavegadorSugeridoModal: React.FC = () => {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const userAgent = navigator.userAgent;
        if (/Edg/.test(navigator.userAgent)) {
  return (
    <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      <Typography variant="h5" color="error">
        Esta aplicación no es compatible con Microsoft Edge. Por favor, accede desde Google Chrome.
      </Typography>
    </Box>
  );
}

        const alreadySeen = localStorage.getItem('navegadorSugeridoModalCerrado');

        if (isEdge && !alreadySeen) {
            setOpen(true);
        }

        console.log("User Agent:", userAgent);
    }, []);

    const handleClose = () => {
        setOpen(false);
        localStorage.setItem('navegadorSugeridoModalCerrado', 'true');
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullScreen={fullScreen}
            PaperProps={{
                sx: {
                    p: 2,
                    borderRadius: 4,
                    backgroundColor: theme.palette.background.paper,
                    width: fullScreen ? '100%' : '500px',
                    maxWidth: '90vw',
                    mx: 'auto',
                },
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InfoOutlinedIcon sx={{ color: theme.palette.primary.main }} />
                    <DialogTitle sx={{ m: 0, p: 0 }}>Sugerencia de navegador</DialogTitle>
                </Box>
                <IconButton onClick={handleClose} size="small">
                    <CloseIcon />
                </IconButton>
            </Box>

            <DialogContent sx={{ mt: 1 }}>
                <Typography variant="body1" color="text.primary">
                    ¡Hola! Hemos detectado que estás usando <strong>Microsoft Edge</strong>.
                    Para una experiencia visual más fluida y compatibilidad completa,
                    te sugerimos usar <strong>Google Chrome</strong>.
                </Typography>
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'flex-end', mt: 2 }}>
                <Button
                    onClick={handleClose}
                    variant="contained"
                    color="primary"
                    sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                    Gracias por la sugerencia
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NavegadorSugeridoModal;
