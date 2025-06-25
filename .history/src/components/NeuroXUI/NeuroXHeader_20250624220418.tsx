import React, { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, Typography, Box, IconButton, Button, useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Logosegundario from '../../assets/imagenes/logo_segundario.webp';
import { getUserById } from '../../services/ApiService';
import UserProfileModal from '../UserProfileModal/UserProfileModal';

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
  const [modalOpen, setModalOpen] = useState(false);

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
            <IconButton color="inherit">
              <SettingsIcon />
            </IconButton>

            {user && (
              <Button
                variant="outlined"
                sx={{ color: '#fff', borderColor: '#fff', textTransform: 'none' }}
                onClick={() => setModalOpen(true)}
              >
                {user.firstName}
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {user && (
        <UserProfileModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          user={user}
          onLogout={handleLogout}
        />
      )}
    </>
  );
};

export default NeuroXHeader;
