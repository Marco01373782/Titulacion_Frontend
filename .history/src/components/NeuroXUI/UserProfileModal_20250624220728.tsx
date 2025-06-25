import React from 'react';
import {
  Popover,
  Box,
  Typography,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';

interface UserProfilePopoverProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  user: {
    firstName: string;
    lastName: string;
    email?: string;
    parentesco?: string;
  };
  onLogout: () => void;
}

const : React.FC<UserProfilePopoverProps> = ({
  anchorEl,
  onClose,
  user,
  onLogout,
}) => {
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        sx: {
          width: isMobile ? '90vw' : 280,
          p: 2,
          borderRadius: 2,
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <Box>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Nombre
        </Typography>
        <Typography variant="body1" mb={1}>
          {user.firstName} {user.lastName}
        </Typography>

        <Divider sx={{ my: 1 }} />

        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Email
        </Typography>
        <Typography variant="body1" mb={1}>
          {user.email || 'No disponible'}
        </Typography>

        <Divider sx={{ my: 1 }} />

        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Parentesco
        </Typography>
        <Typography variant="body1" mb={2}>
          {user.parentesco || 'No disponible'}
        </Typography>

        <Box display="flex" justifyContent="space-between" gap={1}>
          <Button variant="outlined" onClick={onClose} fullWidth>
            Cerrar
          </Button>
          <Button variant="contained" color="error" onClick={onLogout} fullWidth>
            Cerrar sesión
          </Button>
        </Box>
      </Box>
    </Popover>
  );
};

export default UserProfilePopover;
