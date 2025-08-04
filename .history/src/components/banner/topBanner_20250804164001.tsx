import React, { useState, useEffect } from 'react';
import { Alert, IconButton, Collapse } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const TopBanner = () => {
    const [open, setOpen] = useState(true);

    useEffect(() => {
        const hasClosedBanner = localStorage.getItem('bannerClosed');
        if (hasClosedBanner) setOpen(false);
    }, []);

    const handleClose = () => {
        setOpen(false);
        localStorage.setItem('bannerClosed', 'true'); // Para no volver a mostrarlo
    };

    return (
        <Collapse in={open}>
            <Alert
                severity="info"
                action={
                    <IconButton
                        color="inherit"
                        size="small"
                        onClick={handleClose}
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                }
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1200,
                    borderRadius: 0
                }}
            >
                <strong>NeuroX</strong> - Nuestra misión es apoyar el bienestar cognitivo de los adultos mayores. 💜
            </Alert>
        </Collapse>
    );
};
