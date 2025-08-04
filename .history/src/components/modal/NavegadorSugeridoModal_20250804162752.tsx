import React, { useEffect, useState } from 'react';
import {
    Typography,
    useMediaQuery,
    useTheme,
    Box,
} from '@mui/material';


const NavegadorSugeridoModal: React.FC = () => {
    
    const theme = useTheme();
    

    useEffect(() => {
        const userAgent = navigator.userAgent;
        const isEdge = /Edg/.test(userAgent);
        const alreadySeen = localStorage.getItem('navegadorSugeridoModalCerrado');

        if (isEdge && !alreadySeen) {
            setOpen(true);
        }

        console.log("User Agent:", userAgent);
    }, []);

    

  return (
    <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      <Typography variant="h5" color="error">
        Esta aplicación no es compatible con Microsoft Edge. Por favor, accede desde Google Chrome.
      </Typography>
    </Box>
  );
}

export default NavegadorSugeridoModal;
