
    import Box from '@mui/material/Box';
    import Typography from '@mui/material/Typography';
    import Card from '@mui/material/Card';
    import CardContent from '@mui/material/CardContent';
    import Divider from '@mui/material/Divider';
    import Chip from '@mui/material/Chip';
    import { useTheme, useMediaQuery } from '@mui/material';
    import GroupsIcon from '@mui/icons-material/Groups';
    import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';
    import CelebrationIcon from '@mui/icons-material/Celebration';

    const DashboardGrupal = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box width="100%" height="100%" p={isMobile ? 2 : 4}>
        <Typography variant="h2" gutterBottom color="primary">
            Modo Grupal
        </Typography>

        <Typography variant="body1" color="text.secondary" mb={4}>
           El modo individual permite al cuidador o familiar acompañar a un grupo de adultos mayores  colectivas guiadas por un facilitador. No hay registro de progreso, ofreciendo sesiones libres, dinámicas y recreativas que promueven la participación social.
        </Typography>

        <Divider sx={{ my: 3 }}>
            <Chip label="Características del modo grupal" color="secondary" />
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
                <GroupsIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h3" gutterBottom>
                Actividades compartidas
                </Typography>
                <Typography variant="body1" color="text.secondary">
                Pensado para trabajar con varios adultos mayores al mismo tiempo, fomentando la interacción social.
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
                <HistoryToggleOffIcon color="warning" sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h3" gutterBottom>
                Sesiones libres
                </Typography>
                <Typography variant="body1" color="text.secondary">
                Las sesiones se pueden repetir libremente, no tienen registros, límites ni seguimiento de progreso.
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
                <CelebrationIcon color="success" sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h3" gutterBottom>
                Participación recreativa
                </Typography>
                <Typography variant="body1" color="text.secondary">
                Enfoque lúdico para estimular habilidades cognitivas mientras disfrutan en grupo.
                </Typography>
            </CardContent>
            </Card>
        </Box>
        </Box>
    );
    };

    export default DashboardGrupal;
