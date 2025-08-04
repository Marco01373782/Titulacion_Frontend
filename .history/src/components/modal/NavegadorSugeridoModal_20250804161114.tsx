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
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseIcon from '@mui/icons-material/Close';

const NavegadorSugeridoModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isEdge = /Edg/.test(userAgent);

    if (isEdge) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          p: 2,
          borderRadius: 4,
          backgroundColor: theme.palette.background.paper,
          width: fullScreen ? '100%' : '500px',
          maxWidth: '90vw',
          mx: 'auto',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningAmberIcon sx={{ color: theme.palette.warning.main }} />
          <DialogTitle sx={{ m: 0, p: 0 }}>Navegador recomendado</DialogTitle>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ mt: 1 }}>
        <Typography variant="body1" color="text.primary">
          Hemos detectado que estás utilizando <strong>Microsoft Edge</strong>. Para una experiencia visual óptima y compatibilidad total, te recomendamos utilizar <strong>Google Chrome</strong>.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'flex-end', mt: 2 }}>
        <Button
          onClick={handleClose}
          variant="contained"
          color="primary"
          sx={{ borderRadius: 2, textTransform: 'none' }}
        >
          Entendido
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NavegadorSugeridoModal;
