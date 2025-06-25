import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  Box,
  Divider,
} from '@mui/material';

interface UserProfileModalProps {
  open: boolean;
  onClose: () => void;
  user: {
    firstName: string;
    lastName: string;
    email?: string;
    parentesco?: string;
  };
  onLogout: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ open, onClose, user, onLogout }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog open={open} onClose={onClose} fullScreen={fullScreen} maxWidth="xs" fullWidth>
      <DialogTitle>Perfil de Usuario</DialogTitle>
      <DialogContent dividers>
        <Box mb={1}>
          <Typography variant="subtitle2" color="text.secondary">Nombre:</Typography>
          <Typography variant="body1">{user.firstName} {user.lastName}</Typography>
        </Box>
        <Divider sx={{ my: 1 }} />

        <Box mb={1}>
          <Typography variant="subtitle2" color="text.secondary">Email:</Typography>
          <Typography variant="body1">{user.email || 'No disponible'}</Typography>
        </Box>
        <Divider sx={{ my: 1 }} />

        <Box mb={1}>
          <Typography variant="subtitle2" color="text.secondary">Parentesco:</Typography>
          <Typography variant="body1">{user.parentesco || 'No disponible'}</Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="outlined" color="primary" onClick={onClose}>
          Cerrar
        </Button>
        <Button variant="contained" color="error" onClick={onLogout}>
          Cerrar sesión
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserProfileModal;
