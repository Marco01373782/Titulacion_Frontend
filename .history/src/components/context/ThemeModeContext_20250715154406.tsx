import React, { createContext, useContext, useState, useMemo } from 'react';
import { ThemeProvider } from '@mui/material';
import { lightTheme, darkTheme } from '../../theme';

interface ThemeModeContextType {
    darkMode: boolean;
    toggleDarkMode: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextType | undefined>(undefined);

export const useThemeMode = () => {
    const context = useContext(ThemeModeContext);
    if (!context) {
        throw new Error('useThemeMode debe usarse dentro de ThemeModeProvider');
    }
    return context;
};

export const ThemeModeProvider = ({ children }: { children: React.ReactNode }) => {
    const [darkMode, setDarkMode] = useState(() => {
        const stored = localStorage.getItem('darkMode');
        return stored === 'true';
    });

    const toggleDarkMode = () => {
        setDarkMode((prev) => {
            localStorage.setItem('darkMode', (!prev).toString());
            return !prev;
        });
    };

    const theme = useMemo(() => (darkMode ? darkTheme : lightTheme), [darkMode]);

    return (
        <ThemeModeContext.Provider value={{ darkMode, toggleDarkMode }}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ThemeModeContext.Provider>
    );
};
