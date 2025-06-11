    import React, { createContext, useContext, useState, useEffect } from 'react';

    type ModeType = 'INDIVIDUAL' | 'GRUPAL';

    interface ModeContextType {
    mode: ModeType;
    setMode: (mode: ModeType) => void;
    }

    const ModeContext = createContext<ModeContextType | undefined>(undefined);

    export const ModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mode, setModeState] = useState<ModeType>(() => {
        const savedMode = localStorage.getItem('selectedMode');
        return (savedMode as ModeType) || 'INDIVIDUAL';
    });

    const setMode = (newMode: ModeType) => {
        setModeState(newMode);
        localStorage.setItem('selectedMode', newMode);
    };

    useEffect(() => {
        const savedMode = localStorage.getItem('selectedMode');
        if (savedMode) {
        setModeState(savedMode as ModeType);
        }
    }, []);

    return (
        <ModeContext.Provider value={{ mode, setMode }}>
        {children}
        </ModeContext.Provider>
    );
    };

    export const useMode = () => {
    const context = useContext(ModeContext);
    if (!context) {
        throw new Error('useMode debe usarse dentro de ModeProvider');
    }
    return context;
    };
