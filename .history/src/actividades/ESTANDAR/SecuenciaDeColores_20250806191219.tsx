import { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, useMediaQuery, useTheme } from '@mui/material';

const colores = ['🔴', '🟢', '🔵', '🟡', '🟣', '🟤', '⚫', '⚪'];

const generarSecuencia = (longitud: number) => {
    return Array.from({ length: longitud }, () => colores[Math.floor(Math.random() * colores.length)]);
};

const ColoresSecuencia = ({ onFinish }: { onFinish?: (result: string) => void }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [fase, setFase] = useState<'inicio' | 'mostrando' | 'responder' | 'resultado'>('inicio');
    const [secuencia, setSecuencia] = useState<string[]>([]);
    const [indiceActual, setIndiceActual] = useState<number>(0);
    const [flash, setFlash] = useState<string | null>(null);
    const [respuesta, setRespuesta] = useState<string[]>([]);
    const [resultado, setResultado] = useState<string | null>(null);

    const iniciar = () => {
        const nuevaSecuencia = generarSecuencia(4); 
        setSecuencia(nuevaSecuencia);
        setRespuesta([]);
        setResultado(null);
        setIndiceActual(0);
        setFase('mostrando');
    };

    useEffect(() => {
        if (fase === 'mostrando') {
            if (indiceActual < secuencia.length) {
                const timeout1 = setTimeout(() => {
                    setFlash(secuencia[indiceActual]);
                }, 600);

                const timeout2 = setTimeout(() => {
                    setFlash(null);
                    setIndiceActual(prev => prev + 1);
                }, 1600);

                return () => {
                    clearTimeout(timeout1);
                    clearTimeout(timeout2);
                };
            } else {
                const timeout = setTimeout(() => {
                    setFase('responder');
                    setIndiceActual(0);
                }, 1200);
                return () => clearTimeout(timeout);
            }
        }
    }, [fase, indiceActual]);

    const handleColorClick = (color: string) => {
        const nuevaRespuesta = [...respuesta, color];
        setRespuesta(nuevaRespuesta);
        if (nuevaRespuesta.length === secuencia.length) {
            const aciertos = nuevaRespuesta.filter((c, i) => c === secuencia[i]).length;
            const porcentaje = Math.round((aciertos / secuencia.length) * 100);
            const resultadoTexto = `✅ Acertaste ${aciertos} de ${secuencia.length} colores. Puntaje: ${porcentaje}/100 🎯`;
            setResultado(resultadoTexto);
            setFase('resultado');
            if (onFinish) onFinish(porcentaje.toString());
        }
    };

    const tamañoBoton = isMobile ? 80 : 120;

    return (
        <Box sx={{
            width: '100%',
            minHeight: '100vh',
            p: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            backgroundColor: '#ff0000'
        }}>
            <Paper elevation={5} sx={{
                width: '100%',
                maxWidth: 900,
                minHeight: '80vh',
                p: 5,
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                backgroundColor: '#ffffff'
            }}>
                <Typography variant="h4" sx={{ color: '#6C63FF', fontWeight: 'bold', textAlign: 'center' }}>
                    🧠 Memoria Visual - Colores Avanzado
                </Typography>

                {fase === 'inicio' && (
                    <>
                        <Typography textAlign="center" sx={{ fontSize: '1.2rem', color: '#333' }}>
                            Memoriza la secuencia de colores (4). Se mostrará uno por uno.
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={iniciar}
                            sx={{ mt: 3, px: 5, fontSize: '1.2rem' }}
                        >
                            Comenzar
                        </Button>
                    </>
                )}

                {fase === 'mostrando' && (
                    <>
                        <Typography variant="body1" textAlign="center">
                            Observa atentamente...
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                            {flash && (
                                <Paper elevation={6} sx={{
                                    width: tamañoBoton * 2,
                                    height: tamañoBoton * 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: isMobile ? '3rem' : '4rem',
                                    backgroundColor: '#ffeaa7',
                                    borderRadius: 3
                                }}>
                                    {flash}
                                </Paper>
                            )}
                        </Box>
                    </>
                )}

                {fase === 'responder' && (
                    <>
                        <Typography textAlign="center">
                            Repite la secuencia tocando los colores en orden:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2, mt: 3 }}>
                            {colores.map((color, i) => (
                                <Button
                                    key={i}
                                    onClick={() => handleColorClick(color)}
                                    variant="contained"
                                    sx={{
                                        fontSize: isMobile ? '2.5rem' : '3.5rem',
                                        width: tamañoBoton,
                                        height: tamañoBoton,
                                    }}
                                >
                                    {color}
                                </Button>
                            ))}
                        </Box>
                        <Typography variant="caption" sx={{ mt: 2 }}>
                            {respuesta.length}/{secuencia.length} seleccionados
                        </Typography>
                    </>
                )}

                {fase === 'resultado' && resultado && (
                    <Box sx={{ mt: 3, backgroundColor: '#e0f7fa', p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" textAlign="center" color="primary">
                            {resultado}
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default ColoresSecuencia;
