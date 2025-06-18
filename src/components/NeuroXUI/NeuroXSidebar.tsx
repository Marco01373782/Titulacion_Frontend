    import React from 'react';
    import { Link as RouterLink } from 'react-router-dom';
    import { useMode } from '../context/ModeContext';
    import {
    Drawer, useMediaQuery, Box, IconButton, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText, Divider, Typography, useTheme
    } from '@mui/material';
    import GroupIcon from '@mui/icons-material/Group';
    import PersonIcon from '@mui/icons-material/Person';
    import CloseIcon from '@mui/icons-material/Close';
    import DashboardIcon from '@mui/icons-material/Dashboard';
    import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
    import BarChartIcon from '@mui/icons-material/BarChart';
    import AssignmentIcon from '@mui/icons-material/Assignment';

    interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    }

    const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const { mode, setMode } = useMode();
    const theme = useTheme();

    const toggleMode = () => {
        setMode(mode === 'INDIVIDUAL' ? 'GRUPAL' : 'INDIVIDUAL');
    };

    const userRole = localStorage.getItem('userRole');
    const isDesktop = useMediaQuery('(min-width:769px)');

    if (!userRole || (userRole !== 'user' && userRole !== 'admin')) return null;

    const content = (
        <>
        {userRole === 'user' && (
            <Box
            onClick={toggleMode}
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: theme.palette.secondary.main,
                borderRadius: 9999,
                px: 2,
                py: 1,
                mx: 2,
                mb: 2,
                cursor: 'pointer',
                color: 'white',
                userSelect: 'none',
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') toggleMode();
            }}
            >
            {mode === 'GRUPAL' ? <GroupIcon /> : <PersonIcon />}
            <Typography variant="button" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>
                {mode}
            </Typography>
            </Box>
        )}

        <Divider sx={{ bgcolor: theme.palette.divider }} />

        <List sx={{ flexGrow: 1 }}>
    {userRole === 'user' && mode === 'INDIVIDUAL' && (
        <>
            <ListItem disablePadding>
                <ListItemButton component={RouterLink} to="/user/dashboard" onClick={onClose}>
                    <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton component={RouterLink} to="/user/Sesiones" onClick={onClose}>
                    <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                        <SportsEsportsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Sesiones" />
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton component={RouterLink} to="/user/patient-flow" onClick={onClose}>
                    <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                        <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Paciente" />
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton component={RouterLink} to="/user/estadisticas" onClick={onClose}>
                    <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                        <BarChartIcon />
                    </ListItemIcon>
                    <ListItemText primary="Estadísticas" />
                </ListItemButton>
            </ListItem>
        </>
    )}

    {userRole === 'user' && mode === 'GRUPAL' && (
        <>
            <ListItem disablePadding>
                <ListItemButton component={RouterLink} to="/user/dashboard-grupal" onClick={onClose}>
                    <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton component={RouterLink} to="/user/Sesiones" onClick={onClose}>
                    <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                        <SportsEsportsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Sesiones Grupales" />
                </ListItemButton>
            </ListItem>
        </>
    )}

    {userRole === 'admin' && (
        <>
            <ListItem disablePadding>
                <ListItemButton component={RouterLink} to="/admin/gestionar-actividades" onClick={onClose}>
                    <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                        <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Actividades" />
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton component={RouterLink} to="/admin/gestionar-sesiones" onClick={onClose}>
                    <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                        <SportsEsportsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Sesiones" />
                </ListItemButton>
            </ListItem>
        </>
    )}
</List>

        </>
    );

    if (isDesktop) {
        return (
        <Box
            sx={{
            width: 250,
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            display: 'flex',
            flexDirection: 'column',
            paddingTop: 2,
            height: 'calc(100vh - 7vh)',
            position: 'fixed',
            top: '7vh',
            left: 0,
            zIndex: 1200,
            borderRight: `1px solid ${theme.palette.divider}`,
            }}
        >
            {content}
        </Box>
        );
    }

    return (
        <Drawer
        anchor="left"
        open={isOpen}
        onClose={onClose}
        PaperProps={{
            sx: {
            width: 250,
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            display: 'flex',
            flexDirection: 'column',
            paddingTop: 2,
            },
        }}
        >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 1 }}>
            <IconButton onClick={onClose} sx={{ color: theme.palette.text.primary }}>
            <CloseIcon />
            </IconButton>
        </Box>
        {content}
        </Drawer>
    );
    };

    export default Sidebar;
