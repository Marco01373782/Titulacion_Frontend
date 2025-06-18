import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6C63FF', // Un azul-violeta moderno
    },
    secondary: {
      main: '#FF6584', // Un coral suave
    },
    background: {
      default: '#F4F5FA', // Fondo gris muy suave
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C2C2C',
      secondary: '#666666',
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
    fontFamily: 'Poppins, Roboto, Arial, sans-serif', // fuente más moderna
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
    borderRadius: 16, 
  },
});

export default theme;
