import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6C63FF',
    },
    secondary: {
      main: '#FF6584',
    },
    background: {
      default: '#F4F5FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C2C2C',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: 'Poppins, Roboto, Arial, sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 700 },
    // ...
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          // Estilo común para todos los botones
          fontWeight: 600,
          textTransform: 'uppercase',
        },
        // Variante para actividades (cuando usas prop `variant="actividad"`)
        variants: [
          {
            props: { variant: 'actividad' },
            style: {
              boxShadow: '0 4px 8px rgba(123, 97, 255, 0.5)',
              borderRadius: 24,
              textTransform: 'none',
              fontSize: '1.1rem',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 6px 12px rgba(123, 97, 255, 0.7)',
              },
            },
          },
        ],
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: '16px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        },
      },
      variants: [
        {
          props: { variant: 'actividad' },
          style: {
            backgroundImage: 'linear-gradient(135deg, #f5f7ff 0%, #e1e8ff 100%)',
            borderRadius: 24,
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            padding: '20px',
          },
        },
      ],
    },
  },
});

export default theme;
