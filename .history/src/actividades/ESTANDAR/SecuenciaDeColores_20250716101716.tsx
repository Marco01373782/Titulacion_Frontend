import { useState } from 'react';
import { Box, Typography, Button, Paper, useMediaQuery, useTheme } from '@mui/material';

const colores = ['🔴', '🟢', '🔵', '🟡'];

const generarSecuencia = (longitud: number) => {
    return Array.from({ length: longitud }, () => colores[Math.floor(Math.random() * colores.length)]);
};

const ColoresSecuencia = ({ onFinish }: { onFinish?: (result: string) => void }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [fase, setFase] = useState<'inicio' | 'mostrar' | 'responder' | 'resultado'>('inicio');
    const [secuencia, setSecuencia] = useState<string[]>([]);
    const [respuesta, setRespuesta] = useState<string[]>([]);
    const [resultado, setResultado] = useState<string | null>(null);

    const iniciar = () => {
        const nuevaSecuencia = generarSecuencia(4);
        setSecuencia(nuevaSecuencia);
        setRespuesta([]);
        setResultado(null);
        setFase('mostrar');
    };

    const avanzar = () => {
        if (fase === 'mostrar') {
            setFase('responder');
        }
    };

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

    return (
        <Box sx={{ width: '100%', height: '100%', p: 3, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <Paper elevation={4} sx={{ width: '100%', maxWidth: 900, minHeight: '80vh', p: 4, borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <Typography variant="h4" sx={{ color: '#6C63FF', fontWeight: 700 }}>
                    🧠 Memoria Visual - Colores
                </Typography>

                {fase === 'inicio' && (
                    <>
                        <Typography variant="body1" sx={{ fontSize: '1.1rem', color: '#555', textAlign: 'center' }}>
                            Tendrás que memorizar una secuencia de colores y luego repetirla en el orden correcto.
                        </Typography>
                        <Button variant="contained" size="large" onClick={iniciar} sx={{ fontSize: '1.2rem', px: 5 }}>
                            Iniciar
                        </Button>
                    </>
                )}

                {fase === 'mostrar' && (
                    <>
                        <Typography variant="body1">Memoriza esta secuencia:</Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', mt: 2 }}>
                            {secuencia.map((color, i) => (
                                <Paper key={i} elevation={3} sx={{ width: isMobile ? 120 : 160, height: isMobile ? 100 : 160, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isMobile ? '2.5rem' : '4rem' }}>
                                    {color}
                                </Paper>
                            ))}
                        </Box>
                        <Button variant="contained" onClick={avanzar} sx={{ mt: 3, fontSize: '1.2rem', px: 4 }}>
                            Continuar
                        </Button>
                    </>
                )}

                {fase === 'responder' && (
                    <>
                        <Typography variant="body1">Repite la secuencia haciendo clic en los colores:</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2, mt: 3 }}>
                            {colores.map((color, i) => (
                                <Button
                                    key={i}
                                    onClick={() => handleColorClick(color)}
                                    variant="contained"
                                    sx={{ fontSize: isMobile ? '2rem' : '3rem', px: 4, py: 2, minWidth: isMobile ? 80 : 120 }}
                                >
                                    {color}
                                </Button>
                            ))}
                        </Box>
                    </>
                )}

                {fase === 'resultado' && resultado && (
                    <Box sx={{ p: 2, borderRadius: 2, backgroundColor: '#d4edda', color: '#155724', fontWeight: 'bold' }}>
                        <Typography variant="h6">{resultado}</Typography>
                        {/*<Button variant="outlined" onClick={iniciar} sx={{ mt: 2 }}>
                            Intentar otra vez
                        </Button>*/}
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default ColoresSecuencia;
