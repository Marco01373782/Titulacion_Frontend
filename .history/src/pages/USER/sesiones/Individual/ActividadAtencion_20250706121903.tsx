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
    useTheme,
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

const colorPalette = ['#4CAF50', '#FF9800', '#2196F3', '#E91E63'];

const ActividadAtencion: React.FC<Props> = ({ onFinish, activity }) => {
    const [videoEnded, setVideoEnded] = useState(false);
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showQuestion, setShowQuestion] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 20,
                        right: 20,
                        zIndex: 10,
                        width: isMobile ? '100%' : 'auto',
                        display: 'flex',
                        justifyContent: isMobile ? 'center' : 'flex-end',
                        px: isMobile ? 2 : 0,
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={() => {
                            setVideoEnded(true);
                            setShowQuestion(true);
                        }}
                        sx={{
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.8)',
                            },
                            width: isMobile ? '100%' : 'auto'
                        }}
                    >
                        Omitir video y Continuar
                    </Button>
                </Box>
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
                    maxHeight: '85vh',
                    overflowY: 'auto',
                    bgcolor: 'white',
                    p: 3,
                    borderRadius: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }
            }}
        >
            <DialogTitle sx={{ fontSize: '1.2rem', textAlign: 'center', mb: 2 }}>
                Pregunta {currentIndex + 1} de {questions.length}
            </DialogTitle>
            <DialogContent>
                <Typography variant="h5" textAlign="center" gutterBottom>
                    {currentQuestion.questionText}
                </Typography>

                <Box
                    display="flex"
                    flexDirection={isMobile ? 'column' : 'row'}
                    flexWrap="wrap"
                    justifyContent="center"
                    gap={2}
                    mt={3}
                >
                    {currentQuestion.answerOptions?.map((answer: any, idx: number) => (
                        <Button
                            key={idx}
                            variant={selectedAnswer === idx ? 'contained' : 'outlined'}
                            onClick={() => setSelectedAnswer(idx)}
                            sx={{
                                minWidth: isMobile ? '100%' : '40%',
                                height: '60px',
                                fontSize: '1rem',
                                fontWeight: 800,
                                wid
                                borderRadius: 1,
                                textTransform: 'none',
                                bgcolor: selectedAnswer === idx ? colorPalette[idx % colorPalette.length] : '',
                                color: selectedAnswer === idx ? 'white' : 'inherit',
                                borderColor: colorPalette[idx % colorPalette.length],
                                '&:hover': {
                                    opacity: 0.9,
                                },
                            }}
                        >
                            {answer.answerText}
                        </Button>
                    ))}
                </Box>
            </DialogContent>

            <DialogActions sx={{ flexDirection: 'column', gap: 2, mt: 2 }}>
                <Button
                    variant="contained"
                    size="large"
                    color="primary"
                    disabled={selectedAnswer === null}
                    onClick={handleSubmitAnswer}
                    fullWidth
                    sx={{ py: 1.5, fontWeight: 700 }}
                >
                    Enviar respuesta
                </Button>
                <Typography variant="body2" color="textSecondary" textAlign="center">
                    Piensa bien tu respuesta antes de enviar 🧠
                </Typography>
            </DialogActions>
        </Dialog>
    );
};

export default ActividadAtencion;
