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
        Este modo está diseñado para que el cuidador o familiar acompañe al adulto mayor en una experiencia estimulante, divertida y adaptada a sus capacidades. 
        Todas las sesiones están disponibles, pero una vez completadas, se registran los resultados y no pueden repetirse.
      </Typography>

      <Divider sx={{ my: 3 }}>
        <Chip label="Características del Modo Individual" color="secondary" />
      </Divider>

      <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} gap={3}>
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
              Sesiones únicas
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Cada sesión puede realizarse una sola vez. Al completarla, sus resultados quedan registrados y no podrá repetirse, garantizando una evaluación precisa del progreso.
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
              Seguimiento inteligente
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Se registra el rendimiento, el tiempo de respuesta y la evolución en cada sesión y actividad, permitiendo un análisis detallado del avance cognitivo.
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
              Actividades variadas
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Las actividades están diseñadas para estimular distintas áreas cognitivas. Incluyen juegos de memoria y dinámicas con videos seguidos de preguntas de atención y razonamiento.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default DashboardIndividual;
