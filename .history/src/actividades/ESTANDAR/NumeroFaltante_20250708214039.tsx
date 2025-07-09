import { useState } from 'react';
import { Box, Typography, Button, Paper, useMediaQuery, useTheme } from '@mui/material';

const figuras = ['⬛', '🔺', '🟦', '🟩', '🟨', '🔵', '⭐', '❤️'];

const generarFiguras = (cantidad: number): string[] => {
    const seleccionadas: Set<string> = new Set();
    while (seleccionadas.size < cantidad) {
        const figura = figuras[Math.floor(Math.random() * figuras.length)];
        seleccionadas.add(figura);
    }
    return Array.from(seleccionadas);
};

const FiguraFaltante = ({ onFinish }: { onFinish?: (result: string) => void }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [fase, setFase] = useState<'mostrar' | 'recordar' | 'seleccionar' | 'resultado'>('mostrar');
    const [figurasOriginales] = useState<string[]>(generarFiguras(4));
    const [figurasIncompletas, setFigurasIncompletas] = useState<string[]>([]);
    const [faltante, setFaltante] = useState<string | null>(null);
    const [opciones, setOpciones] = useState<string[]>([]);
    const [respuestaCorrecta, setRespuestaCorrecta] = useState<boolean | null>(null);

    const avanzar = () => {
        if (fase === 'mostrar') {
            const copia = [...figurasOriginales];
            const index = Math.floor(Math.random() * copia.length);
            const eliminado = copia.splice(index, 1)[0];
            setFigurasIncompletas(copia);
            setFaltante(eliminado);
            const distractor = figuras.find(f => !copia.includes(f) && f !== eliminado) || '⬜';
            setOpciones([eliminado, distractor].sort(() => Math.random() - 0.5));
            setFase('recordar');
        } else if (fase === 'recordar') {
            setFase('seleccionar');
        }
    };

    const manejarRespuesta = (valor: string) => {
        const acierto = valor === faltante;
        setRespuestaCorrecta(acierto);
        setFase('resultado');
        if (onFinish) onFinish(acierto ? '100' : '0');
    };

    const renderGrid = (figs: string[]) => (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                gap: 3,
                width: '100%',
                maxWidth: 900,
                justifyItems: 'center'
            }}
        >
            {figs.map((figura, i) => (
                <Paper
                    key={i}
                    elevation={4}
                    sx={{
                        width: isMobile ? 140 : 200,
                        height: isMobile ? 160 : 280,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: isMobile ? '3.5rem' : '6rem',
                        fontWeight: 'bold'
                    }}
                >
                    {figura}
                </Paper>
            ))}
        </Box>
    );

    return (
        <Box sx={{ width: '100%', height: '100%', p: 3, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <Typography variant="h4" textAlign="center">🎨 Recuerda la figura que falta</Typography>
            <Typography variant="h4" textAlign="center">🎨 Recuerda la figura que falta</Typography>

            {fase === 'mostrar' && (
                <>
                    {renderGrid(figurasOriginales)}
                    <Button variant="contained" onClick={avanzar} sx={{ mt: 3, fontSize: '1.2rem', px: 4 }}>Continuar</Button>
                </>
            )}

            {fase === 'recordar' && (
                <>
                    {renderGrid(figurasIncompletas)}
                    <Button variant="contained" onClick={avanzar} sx={{ mt: 3, fontSize: '1.2rem', px: 4 }}>¿Qué figura falta?</Button>
                </>
            )}

            {fase === 'seleccionar' && (
                <>
                    <Typography variant="body1" textAlign="center">Selecciona la figura que faltaba:</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 5, mt: 2 ,  widch:'100px',}}>
                        {opciones.map((figura, i) => (
                            <Button
                                key={i}
                                variant="outlined"
                                onClick={() => manejarRespuesta(figura)}
                                sx={{
                                    width: isMobile ? 120 : 180,
                                    height: isMobile ? 120 : 180,
                                    fontSize: isMobile ? '3rem' : '5rem'
                                }}
                            >
                                {figura}
                            </Button>
                        ))}
                    </Box>
                </>
            )}

            {fase === 'resultado' && (
                <Typography variant="h5" color={respuestaCorrecta ? 'green' : 'error'}>
                    {respuestaCorrecta ? '✅ ¡Correcto! +100' : `❌ Incorrecto. Era ${faltante}`}
                </Typography>
            )}
        </Box>
    );
};

export default FiguraFaltante;
