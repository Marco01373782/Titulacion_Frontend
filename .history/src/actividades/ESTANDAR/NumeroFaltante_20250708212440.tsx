import { useState } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

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
    const [fase, setFase] = useState<'mostrar' | 'seleccionar' | 'resultado'>('mostrar');
    const [figurasMostradas] = useState<string[]>(generarFiguras(5));
    const [faltante, setFaltante] = useState<string | null>(null);
    const [opciones, setOpciones] = useState<string[]>([]);
    const [respuestaCorrecta, setRespuestaCorrecta] = useState<boolean | null>(null);

    const avanzar = () => {
        if (fase === 'mostrar') {
            const copia = [...figurasMostradas];
            const index = Math.floor(Math.random() * copia.length);
            const figuraEliminada = copia.splice(index, 1)[0];
            setFaltante(figuraEliminada);
            const distractor = figuras.find(f => !copia.includes(f) && f !== figuraEliminada) || '⬜';
            setOpciones([figuraEliminada, distractor].sort(() => Math.random() - 0.5));
            setFase('seleccionar');
        }
    };

    const manejarRespuesta = (valor: string) => {
        const acierto = valor === faltante;
        setRespuestaCorrecta(acierto);
        setFase('resultado');
        if (onFinish) onFinish(acierto ? '100' : '0');
    };

    return (
        <Box sx={{ width: '100%', height: '100%', p: 3, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <Typography variant="h4" textAlign="center">🎨 Memoria: ¿Qué figura falta?</Typography>

            {fase === 'mostrar' && (
                <>
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center', width: '100%', height: '50%', alignItems: 'center' }}>
                        {figurasMostradas.map((figura, i) => (
                            <Paper key={i} elevation={4} sx={{ width: 200, height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', fontWeight: 'bold' }}>
                                {figura}
                            </Paper>
                        ))}
                    </Box>
                    <Button variant="contained" onClick={avanzar} sx={{ mt: 3, fontSize: '1.2rem', px: 4 }}>Continuar</Button>
                </>
            )}

            {fase === 'seleccionar' && faltante !== null && (
                <>
                    <Typography variant="body1" textAlign="center">Selecciona la figura que faltaba:</Typography>
                    <Box sx={{ display: 'flex', gap: 4, mt: 2 }}>
                        {opciones.map((figura, i) => (
                            <Button key={i} variant="outlined" onClick={() => manejarRespuesta(figura)} sx={{ width: 120, height: 120, fontSize: '3rem' }}>
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
