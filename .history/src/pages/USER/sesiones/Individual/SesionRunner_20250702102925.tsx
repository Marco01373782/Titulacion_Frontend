import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { saveSessionActivityResult, updateSesionUsuario, getSesionUsuarioById } from '../../../../services/ApiService';
import activityComponentsMap from '../activityComponentsMap';
import {
    Box, Paper, Typography, CircularProgress, Button, Dialog,
    DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import A

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
        const audio = new Audio('');
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

        const end = new Date();
        const durationSeconds = Math.floor((end.getTime() - startTime.getTime()) / 1000);
        const wrapper = activities[currentIndex];
        const activity = wrapper.activity || wrapper;
        const completedAt = end.toISOString().split('.')[0];

        const payload = {
            sesionUsuarioId,
            activityId: Number(activity.id),
            result: score !== null ? Number(score) : null,
            completedAt,
            durationSeconds,
        };

        try {
            await saveSessionActivityResult(payload);
            setDurations(prev => [...prev, durationSeconds]);
            if (score !== null) setScores(prev => [...prev, score]);
            setActivityScore(score);
            setShowResultModal(true);
        } catch (e) {
            console.error('❌ Error al guardar resultado:', e);
        }
    };

    const handleNext = async () => {
        setShowResultModal(false);
        if (currentIndex < activities.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            const totalDuration = durations.reduce((acc, cur) => acc + cur, 0);
            const activitiesResultAverage = scores.length > 0
                ? scores.reduce((a, b) => a + b, 0) / scores.length
                : null;

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

    if (isLoading) return (
        <Box sx={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
        </Box>
    );

    if (!activities.length) return (
        <Box sx={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h5">No hay actividades para esta sesión.</Typography>
        </Box>
    );

    const wrapper = activities[currentIndex];
    const activity = wrapper.activity || wrapper;
    const resourceUrl = activity.resourceUrl;
    const ActivityComponent = activityComponentsMap[resourceUrl];

    if (!ActivityComponent) return (
        <Box sx={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h5">No se encontró el componente para: {resourceUrl}</Typography>
        </Box>
    );

    return (
        <Box sx={{ width: '100%', height: '100vh', bgcolor: '#f4f5fa', p: 2, position: 'relative' }}>
            <Button
                variant="outlined"
                color="secondary"
                onClick={toggleMusic}
                startIcon={isMusicPlaying ? <VolumeOffIcon /> : <MusicNoteIcon />}
                sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1000 }}
            >
                {isMusicPlaying ? 'Silencio' : 'Música'}
            </Button>

            <Paper elevation={3} sx={{ width: '100%', height: '100%', p: 3, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Sesión: {session?.title} | Actividad {currentIndex + 1} de {activities.length}
                </Typography>

                <Dialog
                    open={showInstructionsModal}
                    onClose={() => { }}
                    disableEscapeKeyDown
                    fullWidth
                    maxWidth="md"
                    PaperProps={{
                        sx: {
                            height: '60vh',
                            bgcolor: 'rgb(237, 242, 188)',
                            borderRadius: 3,
                            p: 3,
                            boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                            display: 'flex',
                            flexDirection: 'column',
                        }
                    }}
                >
                    <DialogTitle>Instrucciones de la actividad</DialogTitle>
                    <DialogContent dividers>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line', fontSize: '1.2rem' }}>
                            {activity.description || 'No hay instrucciones disponibles para esta actividad.'}
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={handleStartActivity} fullWidth>
                            ¡Entendido, vamos!
                        </Button>
                    </DialogActions>
                </Dialog>

                <Box sx={{ flexGrow: 1, display: showInstructionsModal ? 'none' : 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityComponent onFinish={handleFinishActivity} />
                </Box>

                <Dialog open={showResultModal} onClose={() => { }}>
                    <DialogTitle>Actividad completada</DialogTitle>
                    <DialogContent>
                        <Typography>Puntaje obtenido: <strong>{activityScore}</strong></Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleNext} variant="contained" color="primary" fullWidth>
                            {currentIndex < activities.length - 1 ? 'Continuar' : 'Terminar sesión'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </Box>
    );
};

export default SesionRunner;
