import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useMode } from '../context/ModeContext';
import {
    Drawer, useMediaQuery, Box, IconButton, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText, Divider, Typography, useTheme, Dialog, DialogTitle,
    DialogContent, DialogContentText, DialogActions, Button
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
    const navigate = useNavigate();
    const isDesktop = useMediaQuery('(min-width:769px)');

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const userRole = localStorage.getItem('userRole');
    if (!userRole || (userRole !== 'user' && userRole !== 'admin')) return null;

    const handleModeChange = () => {
        const newMode = mode === 'INDIVIDUAL' ? 'LIBRE' : 'INDIVIDUAL';
        setMode(newMode);
        setShowConfirmDialog(false);
        navigate(newMode === 'INDIVIDUAL' ? '/user/dashboard' : '/user/dashboard-grupal');
    };

    const content = (
        <>
            {userRole === 'user' && (
                <Box
                    onClick={() => {
                    setShowConfirmDialog(true);
                    if (!isDesktop) onClose(); 
                }}

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
                        if (e.key === 'Enter' || e.key === ' ') setShowConfirmDialog(true);
                    }}
                >
                    {mode === 'LIBRE' ? <GroupIcon /> : <PersonIcon />}
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
                                <ListItemText primary="Adulto Mayor" />
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

                {userRole === 'user' && mode === 'LIBRE' && (
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
                        <ListItem disablePadding>
                            <ListItemButton component={RouterLink} to="/admin/gestionar-usuarios" onClick={onClose}>
                                <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                                    <SportsEsportsIcon />
                                </ListItemIcon>
                                <ListItemText primary="Usuarios" />
                            </ListItemButton>
                        </ListItem>
                    </>
                )}
            </List>
        </>
    );

    return (
        <>
            {isDesktop ? (
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
            ) : (
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
            )}

            <Dialog
                open={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
            >
                <DialogTitle>Cambiar Modo</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro de cambiar al modo {mode === 'INDIVIDUAL' ? 'LIBRE' : 'INDIVIDUAL'}?
                        Se restablecerá tu vista actual y serás redirigido automáticamente.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowConfirmDialog(false)} color="primary">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleModeChange}
                        color="secondary"
                        variant="contained"
                    >
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Sidebar;
