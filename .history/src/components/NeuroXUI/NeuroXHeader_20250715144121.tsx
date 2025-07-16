import React, { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, Typography, Box, IconButton, Button, useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Logosegundario from '../../assets/imagenes/logo_segundario.webp';
import { getUserById } from '../../services/ApiService';
import UserProfilemodal from './UserProfileModal';
//import SettingsModal from './SettingsModal';

interface NeuroXHeaderProps {
  onToggleSidebar: () => void;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  parentesco?: string;
}

const NeuroXHeader: React.FC<NeuroXHeaderProps> = ({ onToggleSidebar }) => {
  const theme = useTheme();
  const userRole = localStorage.getItem('userRole') || 'user';
  const userId = localStorage.getItem('userId');

  const [user, setUser] = useState<User | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  //const [settingsOpen, setSettingsOpen] = useState(false); // Estado modal ajustes

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      try {
        const res = await getUserById(Number(userId));
        setUser(res.data);
      } catch (error) {
        console.error('Error al obtener usuario:', error);
      }
    };
    fetchUser();
  }, [userId]);

  const handleClickUser = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserPopover = () => {
    setAnchorEl(null);
  };

  /const handleOpenSettings = () => {
    setSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setSettingsOpen(false);
  };

  return (
    <>
      <AppBar position="static" color="primary" elevation={3} sx={{ height: '7vh', justifyContent: 'center' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton onClick={onToggleSidebar} color="inherit">
              <MenuIcon />
            </IconButton>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              <img src={Logosegundario} alt="logo" style={{ height: 45 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                NeuroX
              </Typography>
              {userRole === 'admin' && (
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: -0.5 }}>
                  Panel de administración
                </Typography>
              )}
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <IconButton onClick={handleLogout} color="inherit">
              <ExitToAppIcon />
            </IconButton>
            <IconButton color="inherit" onClick={handleOpenSettings}>
              <SettingsIcon />
            </IconButton>

            {user && (
              <Button
                variant="outlined"
                sx={{ color: '#fff', borderColor: '#fff', textTransform: 'none' }}
                onClick={handleClickUser}
              >
                {user.firstName}
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {user && (
        <UserProfilemodal
          anchorEl={anchorEl}
          onClose={handleCloseUserPopover}
          user={user}
          onLogout={handleLogout}
        />
      )}

      {/* Ventana modal de ajustes 
      <SettingsModal open={settingsOpen} onClose={handleCloseSettings} />*/}
    </>
  );
};

export default NeuroXHeader;
