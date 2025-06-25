    import React from 'react';
    import { Box, Typography, Button, useTheme } from '@mui/material';
    import HomeAdults from '../../../assets/home.png';

    interface PatientIntroProps {
    onContinue: () => void;
    }

    const PatientIntro: React.FC<PatientIntroProps> = ({ onContinue }) => {
    const theme = useTheme();

    return (
        <Box
        width="100%",
        height: '100vh',
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        padding={2}
        textAlign="center"
        >
        <Typography variant="h2" color="primary" mb={2}>
            ¡Hola! Bienvenido
        </Typography>

        <Typography variant="body1" color="text.secondary" maxWidth={600} mb={3}>
            Estamos felices de tenerte aquí. Antes de continuar, por favor completa los datos de tu adulto mayor.
        </Typography>

        <Box
            component="img"
            src={HomeAdults}
            alt="paciente"
            sx={{
            width: { xs: 200, sm: 250, md: 280 },
            height: { xs: 200, sm: 250, md: 280 },
            objectFit: 'contain',
            mb: 3
            }}
        />

        <Typography variant="body1" color="text.secondary" maxWidth={650} mb={4}>
            Queremos acompañar a nuestros adultos en su bienestar cognitivo. <br />
            Y tú eres parte esencial de este camino.
        </Typography>

        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
            <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ width: 180, height: 45 }}
            onClick={onContinue}
            >
            Completar Registro
            </Button>

            <Button
            variant="contained"
            color="success"
            size="large"
            sx={{ width: 180, height: 45 }}
            onClick={() => window.location.replace('/user/dashboard')}
            >
            Omitir
            </Button>
        </Box>
        </Box>
    );
    };

    export default PatientIntro;
