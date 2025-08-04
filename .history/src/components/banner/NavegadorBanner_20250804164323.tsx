import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, useTheme, useMediaQuery } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';

const NavegadorBanner: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const closed = localStorage.getItem('navegadorBannerClosed');
        if (!closed) setVisible(true);
    }, []);

    const handleClose = () => {
        setVisible(false);
        localStorage.setItem('navegadorBannerClosed', 'true');
    };

    if (!visible) return null;

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0, // si quieres abajo, usa bottom: 0 y quita top
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

export default NavegadorBanner;
