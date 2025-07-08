
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { useTheme, useMediaQuery } from '@mui/material';
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
        El modo individual permite al cuidador o familiar acompañar al adulto mayor en un camino entretenido y divertido de estimulación cognitiva.
        Todas las sesiones estan disponibles pero una ves terminada se guardara el resultado y no se podra volver a realizar.
      </Typography>

      <Divider sx={{ my: 3 }}>
        <Chip label="Características del modo individual" color="secondary" />
      </Divider>

      <Box
        display="flex"
        flexDirection={isMobile ? 'column' : 'row'}
        gap={3}
      >
        <Card
          sx={{
            flex: 1,
            height: '100%',
            borderLeft: `6px solid ${theme.palette.primary.main}`,
            borderRadius: 3,
            boxShadow: 3
          }}
        >
          <CardContent>
            <SelfImprovementIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
            <Typography variant="h3" gutterBottom>
              Sesiones Disponibles
            </Typography>
            <Typography variant="body1" color="text.secondary">
              
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            flex: 1,
            height: '100%',
            borderLeft: `6px solid ${theme.palette.success.main}`,
            borderRadius: 3,
            boxShadow: 3
          }}
        >
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

        <Card
          sx={{
            flex: 1,
            height: '100%',
            borderLeft: `6px solid ${theme.palette.warning.main}`,
            borderRadius: 3,
            boxShadow: 3
          }}
        >
          <CardContent>
            <AutoGraphIcon color="warning" sx={{ fontSize: 40, mb: 2 }} />
            <Typography variant="h3" gutterBottom>
              Adaptación del Usuario
            </Typography>
            <Typography variant="body1" color="text.secondary">
              El sistema permite seleccionar manualmente el nivel de dificultad de las sesiones adaptandose a las capacidades y necesidades del usuario.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default DashboardIndividual;
