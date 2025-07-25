  import React from 'react';
  import Box from '@mui/material/Box';
  import Typography from '@mui/material/Typography';
  import Card from '@mui/material/Card';
  import CardContent from '@mui/material/CardContent';
  import Divider from '@mui/material/Divider';
  import Chip from '@mui/material/Chip';
  import { useTheme, useMediaQuery, GridContainer, GridItem } from '@mui/material';
  import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
  import TrendingUpIcon from '@mui/icons-material/TrendingUp';
  import AutoGraphIcon from '@mui/icons-material/AutoGraph';

  const DashboardIndividual = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
      <Box width="100%" height="100%" p={isMobile ? 2 : 4}>
        <Typography variant="h2" gutterBottom color="primary">
          Modo Individual
        </Typography>

        <Typography variant="body1" color="text.secondary" mb={4}>
          El modo individual permite al cuidador acompañar al usuario en un camino progresivo de estimulación cognitiva personalizada.
          A medida que completa cada sesión, se desbloquea la siguiente, garantizando un entrenamiento ordenado, adaptativo y seguro.
        </Typography>

        <Divider sx={{ my: 3 }}>
          <Chip label="Características del modo individual" color="secondary" />
        </Divider>

        <GridContainer spacing={3}>
          <GridItem xs={12} md={4}>
            <Card sx={{ height: '100%', borderLeft: `6px solid ${theme.palette.primary.main}`, borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <SelfImprovementIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h3" gutterBottom>
                  Sesiones progresivas
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Cada sesión completada desbloquea la siguiente. El avance depende del ritmo individual, no del tiempo.
                </Typography>
              </CardContent>
            </Card>
          </GridItem>

          <GridItem xs={12} md={4}>
            <Card sx={{ height: '100%', borderLeft: `6px solid ${theme.palette.success.main}`, borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <TrendingUpIcon color="success" sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h3" gutterBottom>
                  Seguimiento detallado
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Se registran resultados, tiempos y evolución de cada actividad para análisis y mejora continua.
                </Typography>
              </CardContent>
            </Card>
          </GridItem>

          <GridItem xs={12} md={4}>
            <Card sx={{ height: '100%', borderLeft: `6px solid ${theme.palette.warning.main}`, borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <AutoGraphIcon color="warning" sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h3" gutterBottom>
                  Adaptación constante
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  El sistema ajusta automáticamente el nivel de dificultad según el progreso y desempeño del usuario.
                </Typography>
              </CardContent>
            </Card>
          </GridItem>
        </GridContainer>
      </Box>
    );
  };

  export default DashboardIndividual;
