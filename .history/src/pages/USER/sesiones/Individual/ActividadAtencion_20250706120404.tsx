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
    CircularProgress,
    useMediaQuery,
    useTheme
} from '@mui/material';

interface Props {
    onFinish: (score: number) => void;
    activity: any;
}

const getEmbedUrl = (url: string): string => {
    if (!url) return '';
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
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
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showQuestion, setShowQuestion] = useState(false);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

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

    const handleSubmitAnswer = () => {
        if (selectedAnswer === null) return;
        const isCorrect = questions[currentIndex].answerOptions[selectedAnswer].isCorrect;
        if (isCorrect) setScore(prev => prev + 1);

        setSelectedAnswer(null);
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
        }, 500);
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
                    onClick={() => {
                        setVideoEnded(true);
                        setShowQuestion(true);
                    }}
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
                    Omitir video y Continuar
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
            open={showQuestion}
            fullScreen={fullScreen}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: 'white',
                    p: 4,
                    borderRadius: 3,
                    minHeight: fullScreen ? '100%' : 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }
            }}
        >
            <DialogTitle sx={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700 }}>
                Pregunta {currentIndex + 1} de {questions.length}
            </DialogTitle>
            <DialogContent sx={{ textAlign: 'center' }}>
                <Typography variant="h5" sx={{ mb: 4 }}>
                    {currentQuestion.questionText}
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                    {currentQuestion.answerOptions?.map((answer: any, idx: number) => (
                        <Button
                            key={idx}
                            variant={selectedAnswer === idx ? 'contained' : 'outlined'}
                            size="large"
                            fullWidth
                            onClick={() => setSelectedAnswer(idx)}
                            sx={{
                                fontSize: '1.1rem',
                                borderRadius: 2,
                                py: 1.5,
                                bgcolor: selectedAnswer === idx ? 'primary.main' : 'inherit',
                                color: selectedAnswer === idx ? 'white' : 'inherit',
                            }}
                        >
                            {answer.answerText}
                        </Button>
                    ))}
                </Box>
            </DialogContent>
            <DialogActions sx={{ flexDirection: 'column', gap: 2 }}>
                <Button
                    variant="contained"
                    size="large"
                    color="success"
                    disabled={selectedAnswer === null}
                    onClick={handleSubmitAnswer}
                    fullWidth
                    sx={{ py: 1.5, fontWeight: 600 }}
                >
                    Enviar respuesta
                </Button>
                <Typography variant="body2" color="textSecondary">
                    Concéntrate y elige la mejor opción 💡
                </Typography>
            </DialogActions>
        </Dialog>
    );
};

export default ActividadAtencion;
