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
                setQuestions(res.data);
            } catch (e) {
                console.error('Error cargando preguntas:', e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchQuestions();
    }, [activity.id]);

    const handleAnswer = (isCorrect: boolean) => {
        if (isCorrect) {
            setScore((prev) => prev + 1);
        }
        setShowQuestion(false);
        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex((prev) => prev + 1);
                setShowQuestion(true);
            } else {
                const total = questions.length;
                const finalScore = Math.round((score + (isCorrect ? 1 : 0)) / total * 100);
                onFinish(finalScore);
            }
        }, 400);
    };

    if (isLoading) return (
        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress />
        </Box>
    );

    return (
        <Box sx={{ width: '100%', height: '100%' }}>
            {!videoEnded ? (
                <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                    <Box component="iframe"
                        src={activity.resourceUrl.replace("watch?v=", "embed/")}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onLoad={() => console.log('Video cargado')}
                        style={{ width: '100%', height: '100%', border: 'none', borderRadius: '12px' }}
                    />
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
            ) : (
                <Dialog
                    open={showQuestion || currentIndex === 0}
                    onClose={() => { }}
                    fullScreen
                    PaperProps={{
                        sx: {
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            bgcolor: 'white',
                            p: 3
                        }
                    }}
                >
                    <DialogTitle sx={{ fontSize: '1.6rem', textAlign: 'center' }}>
                        Pregunta {currentIndex + 1} de {questions.length}
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="h5" textAlign="center" gutterBottom>
                            {questions[currentIndex].questionText}
                        </Typography>
                        <Box display="flex" flexDirection="column" gap={2} mt={2}>
                            {questions[currentIndex].answers.map((answer: any, idx: number) => (
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
                        <Typography variant="body2" color="textSecondary">
                            Responde con calma y concentración 💡
                        </Typography>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
};

export default ActividadAtencion;
