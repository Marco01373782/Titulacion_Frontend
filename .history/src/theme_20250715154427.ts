// theme.ts
import { createTheme } from '@mui/material/styles';

const commonSettings = {
    typography: {
        fontFamily: 'Poppins, Roboto, Arial, sans-serif',
        h1: { fontSize: '2.5rem', fontWeight: 700 },
        h2: { fontSize: '2rem', fontWeight: 600 },
        h3: { fontSize: '1.75rem', fontWeight: 500 },
        body1: { fontSize: '1.1rem' },
        button: { fontWeight: 600 },
    },
    shape: { borderRadius: 16 },
};

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#6C63FF' },
        secondary: { main: '#FF6584' },
        background: { default: '#F4F5FA', paper: '#FFFFFF' },
        text: { primary: '#2C2C2C', secondary: '#666666' },
        success: { main: '#4CAF50' },
        error: { main: '#E53935' },
        warning: { main: '#FFB300' },
    },
    ...commonSettings,
});

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#6C63FF' },
        secondary: { main: '#FF6584' },
        background: { default: '#1C1C1E', paper: '#2C2C2E' },
        text: { primary: '#FFFFFF', secondary: '#CCCCCC' },
        success: { main: '#4CAF50' },
        error: { main: '#EF5350' },
        warning: { main: '#FFCA28' },
    },
    ...commonSettings,
});
