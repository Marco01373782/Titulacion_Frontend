import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchActivitiesBySession } from '../../../../services/ApiService';
import activityComponentsMap from '../activityComponentsMap';
import ActividadAtencion from '../Individual/ActividadAtencion';
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    useMediaQuery,
    useTheme
} from '@mui/material';

const GroupSesionRunner: React.FC = () => {
    const { sesionId } = useParams();
    const navigate = useNavigate();
    const [activities, setActivities] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [activityScore, setActivityScore] = useState<number | null>(null);
    const [showContinue, setShowContinue] = useState<boolean>(false);
    const [isFinished, setIsFinished] = useState<boolean>(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchActivitiesBySession(Number(sesionId));
                setActivities(data);
            } catch (error) {
                console.error('Error al obtener actividades:', error);
            }
        };
        fetchData();
    }, [sesionId]);

    const handleFinishActivity = (score: number) => {
        setActivityScore(score);
        setShowContinue(true);
    };

    const handleContinue = () => {
        setShowContinue(false);
        setActivityScore(null);
        if (currentIndex < activities.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsFinished(true);
        }
    };

    const handleFinishSession = () => {
        navigate('/user/Sesiones');
    };

    const wrapper = activities[currentIndex];
    const activity = wrapper?.activity || wrapper;
    const resourceUrl = activity?.resourceUrl;
    const isAtencion = activity?.type === 'ATENCION';
    const CurrentActivity = isAtencion ? ActividadAtencion : activityComponentsMap[resourceUrl];

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                p: 0,
                m: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f4f4f4'
            }}
        >
            {!isFinished ? (
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        maxWidth: '100vw',
                        maxHeight: '100vh',
                        padding: isMobile ? '8px' : '16px',
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Typography
                        variant={isMobile ? 'subtitle1' : 'h6'}
                        textAlign="center"
                        sx={{ mt: 1 }}
                    >
                        Actividad {currentIndex + 1} de {activities.length}
                    </Typography>

                    <Box
                        sx={{
                            flexGrow: 1,
                            width: '100%',
                            maxWidth: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            p: isMobile ? 0 : 2,
                            overflow: 'hidden'
                        }}
                    >
                        {CurrentActivity ? (
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    maxWidth: isMobile ? '95%' : '100%',
                                    maxHeight: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <CurrentActivity onFinish={handleFinishActivity} activity={activity} />
                            </Box>
                        ) : (
                            <CircularProgress />
                        )}
                    </Box>

                    {showContinue && (
                        <Box
                            sx={{
                                textAlign: 'center',
                                width: '100%',
                                py: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Typography
                                variant={isMobile ? 'h4' : 'h3'}
                                sx={{ fontWeight: 'bold', mb: 2 }}
                            >
                                ✅ Puntaje: {activityScore}
                            </Typography>
                            <Button
                                onClick={handleContinue}
                                variant="contained"
                                size="large"
                                sx={{ width: isMobile ? '100%' : '300px' }}
                            >
                                {currentIndex < activities.length - 1 ? '➡ Continuar' : '🏁 Finalizar sesión'}
                            </Button>
                        </Box>
                    )}
                </Box>
            ) : (
                <Box textAlign="center" sx={{ px: 2 }}>
                    <Typography variant="h4" gutterBottom>🎉 ¡Sesión Completada!</Typography>
                    <Typography variant="body1">Gracias por participar 💪🧠</Typography>
                    <Button
                        onClick={handleFinishSession}
                        variant="contained"
                        sx={{ mt: 3 }}
                    >
                        Volver al menú 
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default GroupSesionRunner;
