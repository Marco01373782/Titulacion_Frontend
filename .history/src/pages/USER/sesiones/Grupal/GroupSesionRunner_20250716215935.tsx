import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchActivitiesBySession } from '../../../../services/ApiService';
import activityComponentsMap from '../activityComponentsMap';
import ActividadAtencion from '../Individual/ActividadAtencion';
import {
    Box,
    Typography,
    Button,
    Paper,
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
        navigate('/app/sesion-grupal-grid');
    };

    const wrapper = activities[currentIndex];
    const activity = wrapper?.activity || wrapper;
    const resourceUrl = activity?.resourceUrl;
    const isAtencion = activity?.type === 'ATENCION';
    const CurrentActivity = isAtencion ? ActividadAtencion : activityComponentsMap[resourceUrl];

    return (
        <Box sx={{ width: '95%', height: '100vh', p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {!isFinished ? (
                <Paper elevation={4} sx={{ width: '100%', maxWidth: '960px', height: '100%', p: isMobile ? 1 : 3, borderRadius: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Typography variant="h6" textAlign="center" sx={{ mb: 2 }}>
                        Actividad {currentIndex + 1} de {activities.length}
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {CurrentActivity ? (
                            <CurrentActivity onFinish={handleFinishActivity} activity={activity} />
                        ) : (
                            <CircularProgress />
                        )}
                    </Box>

                    {showContinue && (
                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Typography variant="subtitle1">✅ Resultado: <strong>{activityScore}</strong></Typography>
                            <Button onClick={handleContinue} variant="contained" size="large" sx={{ mt: 2 }}>
                                {currentIndex < activities.length - 1 ? '➡ Continuar' : '🏁 Finalizar sesión'}
                            </Button>
                        </Box>
                    )}
                </Paper>
            ) : (
                <Box textAlign="center">
                    <Typography variant="h4" gutterBottom>🎉 ¡Sesión Completada!</Typography>
                    <Typography variant="body1">Gracias por participar 💪🧠</Typography>
                    <Button onClick={handleFinishSession} variant="contained" sx={{ mt: 3 }}>
                        Volver al menú grupal
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default GroupSesionRunner;
