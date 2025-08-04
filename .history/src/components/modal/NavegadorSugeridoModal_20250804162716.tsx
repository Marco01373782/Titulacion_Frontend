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
        const isEdge = /Edg/.test(userAgent);
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

    if (/Edg/.test(navigator.userAgent)) {turn (
    <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      <Typography variant="h5" color="error">
        Esta aplicación no es compatible con Microsoft Edge. Por favor, accede desde Google Chrome.
      </Typography>
    </Box>
  );
}

export default NavegadorSugeridoModal;
