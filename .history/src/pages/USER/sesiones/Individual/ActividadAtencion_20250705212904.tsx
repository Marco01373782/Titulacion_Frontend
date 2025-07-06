import React, { useEffect, useState } from 'react';
import { getQuestionsByActivity } from '../../../../services/ApiService';
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress
} from '@mui/material';

interface Props {
    onFinish: (score: number) => void;
    activity: any;
}

// 🧠 Extrae el ID del video de YouTube y devuelve el embed URL
const getEmbedUrl = (url: string): string => {
    if (!url) return '';

    // Si es el formato corto tipo https://youtu.be/VIDEO_ID
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

    // Si es el formato largo tipo https://www.youtube.com/watch?v=VIDEO_ID
    const longMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (longMatch) return `https://www.youtube.com/embed/${longMatch[1]}`;

    return '';
};


const ActividadAtencion: React.FC<Props> = ({ onFinish, activity }) => {
    const [videoEnded, setVideoEnded] = useState(false);
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [showQuestion, setShowQuestion] = useState(false);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await getQuestionsByActivity(activity.id);
                setQuestions(res.data || []);
            } catch (e) {
                console.error('❌ Error cargando preguntas:', e);
                setQuestions([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchQuestions();
    }, [activity.id]);

    const handleAnswer = (isCorrect: boolean) => {
        if (isCorrect) setScore(prev => prev + 1);
        setShowQuestion(false);

        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setShowQuestion(true);
            } else {
                const total = questions.length;
                const finalScore = Math.round(((score + (isCorrect ? 1 : 0)) / total) * 100);
                onFinish(finalScore);
            }
        }, 400);
    };

    if (isLoading) {
        return (
            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    const currentQuestion = questions[currentIndex];
    const embedUrl = getEmbedUrl(activity.resourceUrl || '');
    

    if (!videoEnded) {
        return (
            <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                {embedUrl ? (
                    <Box
                        component="iframe"
                        src={embedUrl}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        sx={{ width: '100%', height: '100%', border: 'none', borderRadius: '12px' }}
                    />
                ) : (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography color="error" variant="h6">
                            ❌ No se pudo cargar el video. Verifica la URL en la actividad.
                        </Typography>
                    </Box>
                )}
                <Button
                    variant="contained"
                    onClick={() => setVideoEnded(true)}
                    sx={{
                        position: 'absolute',
                        bottom: 20,
                        right: 20,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.8)',
                        }
                    }}
                >
                    Omitir video
                </Button>
            </Box>
        );
    }

    if (!currentQuestion) {
        return (
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="h6" color="error" gutterBottom>
                    No hay preguntas disponibles para esta actividad.
                </Typography>
                <Button onClick={() => onFinish(0)} variant="contained">
                    Finalizar
                </Button>
            </Box>
        );
    }

    return (
        <Dialog
            open={showQuestion || currentIndex === 0}
            onClose={() => { }}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: {
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    bgcolor: 'white',
                    p: 3,
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }
            }}
        >
            <DialogTitle sx={{ fontSize: '1.6rem', textAlign: 'center' }}>
                Pregunta {currentIndex + 1} de {questions.length}
            </DialogTitle>
            <DialogContent>
                <Typography variant="h5" textAlign="center" gutterBottom>
                    {currentQuestion.questionText}
                </Typography>
                <Box display="flex" flexDirection="column" gap={2} mt={2}>
                    {currentQuestion.answerOptions?.map((answer: any, idx: number) => (
                        <Button
                            key={idx}
                            variant="contained"
                            fullWidth
                            size="large"
                            color="primary"
                            onClick={() => handleAnswer(answer.isCorrect)}
                        >
                            {answer.answerText}
                        </Button>
                    ))}
                </Box>
            </DialogContent>
            <DialogActions>
                <Typography variant="body2" color="textSecondary" sx={{ mx: 'auto' }}>
                    Responde con calma y concentración 💡
                </Typography>
            </DialogActions>
        </Dialog>
    );
};

export default ActividadAtencion;
