    // src/components/NeuroXUI/NeuroXHeader.tsx

    import React from 'react';
    import { AppBar, Toolbar, Typography, Box, IconButton, Chip, useTheme } from '@mui/material';
    import MenuIcon from '@mui/icons-material/Menu';
    import SettingsIcon from '@mui/icons-material/Settings';
    import ExitToAppIcon from '@mui/icons-material/ExitToApp';
    import AccountCircleIcon from '@mui/icons-material/AccountCircle';

    import Logosegundario from '../../assets/imagenes/logo_segundario.webp';

    interface NeuroXHeaderProps {
    onToggleSidebar: () => void;
    }

    const NeuroXHeader: React.FC<NeuroXHeaderProps> = ({ onToggleSidebar }) => {
    const theme = useTheme();
    const userRole = localStorage.getItem('userRole') || 'user';

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <AppBar position="static" color="primary" elevation={3} sx={{ height: '7vh', justifyContent: 'center' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
            {/* Botón de abrir sidebar (solo para móviles) */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton onClick={onToggleSidebar} color="inherit">
                <MenuIcon />
            </IconButton>
            </Box>

            {/* Logo y título */}
            <Box display="flex" alignItems="center" gap={2}>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                <img src={Logosegundario} alt="logo" style={{ height: 45 }} />
            </Box>
            <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                NeuroX
                </Typography>
                {userRole === 'admin' && (
                <Typography variant="body2" sx={{ color: '#000000aa', mt: -0.5 }}>
                    Panel de administración
                </Typography>
                )}
            </Box>
            </Box>

            {/* Iconos derecha */}
            <Box display="flex" alignItems="center" gap={2}>
            <IconButton onClick={handleLogout} color="inherit">
                <ExitToAppIcon />
            </IconButton>
            <IconButton color="inherit">
                <SettingsIcon />
            </IconButton>
            <IconButton color="inherit">
                <AccountCircleIcon />
            </IconButton>

            {/* Rol */}
            <Chip
                label={userRole === 'admin' ? 'ADMIN' : 'USR'}
                sx={{
                bgcolor: userRole === 'admin' ? '#6dde5e' : '#ffffffcc',
                color: '#000',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                }}
            />
            </Box>
        </Toolbar>
        </AppBar>
    );
    };

    export default NeuroXHeader;
