import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { saveSessionActivityResult, updateSesionUsuario, getSesionUsuarioById, getAverageForSessionAndUser } from '../../../../services/ApiService';
import activityComponentsMap from '../activityComponentsMap';
import {
    Box, Paper, Typography, CircularProgress, Button, Dialog,
    DialogTitle, DialogContent, DialogActions, Backdrop
} from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import ActividadAtencion from './ActividadAtencion';

const SesionRunner: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const session = location.state?.session || JSON.parse(localStorage.getItem('selectedSession') || 'null');
    const initialActivities = location.state?.activities || JSON.parse(localStorage.getItem('selectedActivities') || '[]');

    const [activities] = useState<any[]>(initialActivities);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(initialActivities.length === 0);
    const [activityScore, setActivityScore] = useState<number | null>(null);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [durations, setDurations] = useState<number[]>([]);
    const [scores, setScores] = useState<number[]>([]);
    const [showResultModal, setShowResultModal] = useState(false);
    const [showInstructionsModal, setShowInstructionsModal] = useState(true);
    const [isMusicPlaying, setIsMusicPlaying] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const userId = Number(localStorage.getItem('userId'));
    const sesionUsuarioId = Number(localStorage.getItem('selectedSesionUsuarioId'));

    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (activities.length > 0) setIsLoading(false);
    }, [activities]);

    useEffect(() => {
        if (activities.length > 0 && currentIndex < activities.length) {
            setActivityScore(null);
            setStartTime(null);
            setShowInstructionsModal(true);
        }
    }, [currentIndex, activities]);

    useEffect(() => {
        const audio = new Audio('../../../../../src/music/audio.mp3');
        audio.loop = true;
        audio.volume = 0.3;
        audioRef.current = audio;
        audio.play().catch(e => console.warn('Autoplay bloqueado:', e));

        return () => {
            audio.pause();
            audioRef.current = null;
        };
    }, []);

    const toggleMusic = () => {
        if (audioRef.current) {
            if (isMusicPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsMusicPlaying(!isMusicPlaying);
        }
    };

    const handleStartActivity = () => {
        setStartTime(new Date());
        setShowInstructionsModal(false);
    };

    const handleFinishActivity = async (score: number | null) => {
        if (!startTime || !session || userId == null) return;
        setIsSubmitting(true);

        const end = new Date();
        const durationSeconds = Math.floor((end.getTime() - startTime.getTime()) / 1000);
        const wrapper = activities[currentIndex];
        const activity = wrapper.activity || wrapper;
        const completedAt = end.toISOString().split('.')[0];

        const normalizedScore = score !== null ? Math.min(100, Math.max(0, score)) : null;

        const payload = {
            sesionUsuarioId,
            activityId: Number(activity.id),
            result: normalizedScore,
            completedAt,
            durationSeconds,
        };

        try {
            await saveSessionActivityResult(payload);
            setDurations(prev => [...prev, durationSeconds]);
            if (normalizedScore !== null) setScores(prev => [...prev, normalizedScore]);
            setActivityScore(normalizedScore);
            setShowResultModal(true);
        } catch (e) {
            console.error('❌ Error al guardar resultado:', e);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNext = async () => {
        setShowResultModal(false);
        if (currentIndex < activities.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            const totalDuration = durations.reduce((acc, cur) => acc + cur, 0);

            let activitiesResultAverage = null;
            try {
                const backendAverage = await getAverageForSessionAndUser(session.id, userId);
                activitiesResultAverage = backendAverage ? Number(backendAverage) : null;
            } catch (e) {
                console.error('Error obteniendo promedio backend:', e);
                activitiesResultAverage = scores.length > 0
                    ? Math.min(100, parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)))
                    : null;
            }

            const endedAt = new Date().toISOString().split('.')[0];
            const mode = localStorage.getItem('selectedMode') || 'INDIVIDUAL';

            try {
                const existingSession = await getSesionUsuarioById(sesionUsuarioId);
                const updatedPayload = {
                    ...existingSession,
                    status: 'COMPLETADA',
                    endedAt,
                    sessionDurationSeconds: totalDuration,
                    result: activitiesResultAverage,
                    mode,
                    startedAt: existingSession.startedAt || new Date().toISOString().split('.')[0],
                    date: existingSession.date || new Date().toISOString().split('T')[0]
                };
                await updateSesionUsuario(sesionUsuarioId, updatedPayload);
                navigate('/user/Sesiones');
            } catch (error) {
                alert('❌ No se pudo completar la sesión.');
            }
        }
    };

    if (!activities.length) return (
        <Box sx={{ width: '100%', height: '89vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h5">No hay actividades para esta sesión.</Typography>
        </Box>
    );

    const wrapper = activities[currentIndex];
    const activity = wrapper.activity || wrapper;
    const resourceUrl = activity.resourceUrl;
    const ActivityComponent = activity.type === 'ATENCION'
        ? ActividadAtencion
        : activityComponentsMap[resourceUrl];

    return (
        <Box sx={{ width: '100%', height: '89vh', position: 'relative' }}>
            <Button
                variant="outlined"
                color="secondary"
                onClick={toggleMusic}
                startIcon={isMusicPlaying ? <VolumeOffIcon /> : <MusicNoteIcon />}
                sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1000 }}
            >
                {isMusicPlaying ? 'Silencio' : 'Música'}
            </Button>

            <Paper elevation={3} sx={{ width: '100%', height: '100%', p: 0.8, display: 'flex', flexDirection: 'column', bgcolor: 't' }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Sesión: {session?.title} | Actividad {currentIndex + 1} de {activities.length}
                </Typography>

                <Dialog open={showInstructionsModal} onClose={() => { }} disableEscapeKeyDown fullWidth maxWidth="md"
                    PaperProps={{
                        sx: {
                            height: '65vh',
                            bgcolor: 'rgb(255, 251, 230)',
                            borderRadius: 3,
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                        }
                    }}
                >
                    <DialogTitle sx={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 'bold' }}>
                        🧠 Instrucciones
                    </DialogTitle>
                    <DialogContent dividers sx={{ flexGrow: 1 }}>
                        <Typography variant="body1" sx={{ fontSize: '1.3rem', textAlign: 'center' }}>
                            {activity.description || 'No hay instrucciones disponibles para esta actividad.'}
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button  variant="contained"  onClick={handleStartActivity} fullWidth size="large" >
                            ¡Entendido, vamos!
                        </Button>
                    </DialogActions>
                </Dialog>

                <Box sx={{ flexGrow: 1, display: showInstructionsModal ? 'none' : 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityComponent onFinish={handleFinishActivity} activity={activity} />
                </Box>

                <Dialog open={showResultModal} onClose={() => { }} fullWidth maxWidth="xs"
                    PaperProps={{
                        sx: {
                            textAlign: 'center',
                            p: 4,
                            borderRadius: 4,
                            bgcolor: '#E8F5E9'
                        }
                    }}
                >
                    <DialogTitle sx={{ fontSize: '1.8rem', color: 'green' }}>✅ Actividad Completada</DialogTitle>
                    <DialogContent>
                        <Typography sx={{ fontSize: '1.5rem', mt: 2 }}>
                            Puntaje obtenido:
                        </Typography>
                        <Typography sx={{ fontSize: '3rem', fontWeight: 'bold', color: 'green', mt: 1 }}>
                            {activityScore}
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ mt: 3 }}>
                        <Button onClick={handleNext} variant="contained" color="primary" fullWidth size="large">
                            {currentIndex < activities.length - 1 ? '➡ Continuar' : '🏁 Terminar sesión'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Paper>

            {(isLoading || isSubmitting) && (
                <Backdrop open sx={{ zIndex: 9999, color: '#fff', flexDirection: 'column' }}>
                    <CircularProgress color="inherit" />
                    <Typography sx={{ mt: 2 }}>Procesando...</Typography>
                </Backdrop>
            )}
        </Box>
    );
};

export default SesionRunner;
