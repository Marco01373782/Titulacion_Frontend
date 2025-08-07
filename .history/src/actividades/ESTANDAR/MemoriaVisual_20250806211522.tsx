import React, { useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';

const IMAGES = ['🍎', '🐶', '📘', '🪙', '🦋', '🧃', '🍌', '🌻'];

const shuffleArray = (arr: any[]) => arr.sort(() => Math.random() - 0.5);

const MemoriaVisual: React.FC<{ onFinish?: (score: number) => void }> = ({ onFinish }) => {
    const [step, setStep] = useState<'intro' | 'memorize' | 'select' | 'result'>('intro');
    const [imagesToShow, setImagesToShow] = useState<string[]>([]);
    const [options, setOptions] = useState<string[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [score, setScore] = useState<number | null>(null);

    const TOTAL = 5;

    const startActivity = () => {
        const selectedImages = shuffleArray([...IMAGES]).slice(0, TOTAL);
        const extraOptions = shuffleArray([...IMAGES].filter(i => !selectedImages.includes(i))).slice(0, 3);
        const combinedOptions = shuffleArray([...selectedImages, ...extraOptions]);

        setImagesToShow(selectedImages);
        setOptions(combinedOptions);
        setSelected([]);
        setStep('memorize');

        setTimeout(() => {
            setStep('select');
        }, 5100); 
    };

    const toggleSelect = (emoji: string) => {
        setSelected(prev =>
            prev.includes(emoji) ? prev.filter(i => i !== emoji) : [...prev, emoji]
        );
    };

    const calculateScore = () => {
        const correct = imagesToShow.filter((img, index) => selected[index] === img).length;
        const totalCorrect = imagesToShow.length;
        const normalized = Math.round((correct / totalCorrect) * 100);
        setScore(normalized);
        setStep('result');
        if (onFinish) onFinish(normalized); 
    };

    return (
        <Box sx={{
            width: '100%', height: '100%',
            background:'';
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            p: 2
        }}>
            {step === 'intro' && (
                <Paper elevation={4} sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ mb: 3 }}>🧠 Memoria Visual</Typography>
                    <Typography variant="h5" sx={{ mb: 4 }}>
                        Memoriza las imágenes que aparecerán y luego selecciona cuáles viste. Tienes 10 segundos.
                    </Typography>
                    <Button variant="contained" color="primary" size="large" onClick={startActivity}>
                        Comenzar
                    </Button>
                </Paper>
            )}

            {step === 'memorize' && (
                <Paper elevation={4} sx={{ p: 4, textAlign: 'center', maxWidth: 800 }}>
                    <Typography variant="h4" sx={{ mb: 3 }}>¡Memoriza la secuencia de estas imágenes!</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 3 }}>
                        {imagesToShow.map((img, idx) => (
                            <Paper key={idx} sx={{
                                fontSize: '6rem', p: 4, width: 140, height: 140,
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {img}
                            </Paper>
                        ))}
                    </Box>
                    <Typography sx={{ mt: 3, fontSize: '1.5rem' }}>⏳ Mostrando por 5 segundos...</Typography>
                </Paper>
            )}

            {step === 'select' && (
                <Paper elevation={4} sx={{ p: 4, textAlign: 'center', maxWidth: 800 }}>
                    <Typography variant="h4" sx={{ mb: 3 }}>¿En qué orden viste estas imágenes?</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
                        {options.map((img, idx) => (
                            <Paper
                                key={idx}
                                onClick={() => toggleSelect(img)}
                                sx={{
                                    fontSize: '5rem',
                                    p: 4, width: 120, height: 120,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    bgcolor: selected.includes(img) ? '#c8e6c9' : 'white',
                                    border: selected.includes(img) ? '4px solid green' : '2px solid #ccc'
                                }}
                            >
                                {img}
                            </Paper>
                        ))}
                    </Box>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={calculateScore}
                        sx={{ mt: 4, fontSize: '1.3rem', px: 4, py: 1.5 }}
                        disabled={selected.length < imagesToShow.length}
                    >
                        Enviar respuestas
                    </Button>
                </Paper>
            )}

            {step === 'result' && score !== null && (
                <Paper elevation={4} sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ mb: 2 }}>✅ Resultado</Typography>
                    <Typography variant="h1" sx={{ color: 'green' }}>{score}</Typography>
                    <Typography variant="h5" sx={{ mt: 2 }}>¡Buen trabajo!</Typography>
                </Paper>
            )}
        </Box>
    );
};

export default MemoriaVisual;
