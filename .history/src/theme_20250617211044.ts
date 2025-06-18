// src/theme/theme.ts

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976D2', // Azul NeuroX
    },
    secondary: {
      main: '#FFA726', // Naranja cálido
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
    success: {
      main: '#4CAF50',
    },
    error: {
      main: '#E53935',
    },
    warning: {
      main: '#FFB300',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1.1rem',
    },
    button: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12, // Bordes suaves para amigable visual
  },
});

export default theme;
