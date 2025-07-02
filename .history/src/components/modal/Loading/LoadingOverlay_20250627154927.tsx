import React from 'react';
import { Backdrop, Box, CircularProgress, Typography, useTheme } from '@mui/material';

interface Props {
  visible: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<Props> = ({ visible, message = 'Cargando...' }) => {
  const theme = useTheme();

  return (
    <Backdrop
      open={visible}
      sx={{
        color: theme.palette.primary.main,
        zIndex: (theme) => theme.zIndex.drawer + 1000,
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <CircularProgress color="inherit" size={50} thickness={5} />
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          padding: '1rem 2rem',
          borderRadius: 2,
          boxShadow: theme.shadows[5],
          minWidth: 220,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" color="textPrimary">
          {message}
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default LoadingOverlay;
