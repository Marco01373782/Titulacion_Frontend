import { useState } from 'react';
import { Box, Typography, Button, Paper, useMediaQuery, useTheme } from '@mui/material';

const figuras = ['⬛', '🔺', '🟦', '🟩', '🟨', '🔵', '⭐', '❤️', '🟫', '🟣'];

const generarFiguras = (cantidad: number): string[] => {
    const seleccionadas = new Set<string>();
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
    const [figurasOriginales] = useState<string[]>(generarFiguras(5));
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

            // Generar opciones con 2 distractores únicos
            const distractores = figuras
                .filter(f => f !== eliminado && !copia.includes(f))
                .sort(() => Math.random() - 0.5)
                .slice(0, 2);
            const opcionesFinales = [eliminado, ...distractores].sort(() => Math.random() - 0.5);
            setOpciones(opcionesFinales);

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
                gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(100px, 1fr))',
                gap: 3,
                width: '100%',
                maxWidth: 800,
                justifyItems: 'center',
            }}
        >
            {figs.map((figura, i) => (
                <Paper
                    key={i}
                    elevation={4}
                    sx={{
                        width: isMobile ? 100 : 140,
                        height: isMobile ? 100 : 160,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: isMobile ? '2.5rem' : '4rem',
                        fontWeight: 'bold',
                        borderRadius: '12px',
                        backgroundColor: '#fff',
                    }}
                >
                    {figura}
                </Paper>
            ))}
        </Box>
    );

    return (
        <Box
            sx={{
                width: '100%',
                minHeight: '100%',
                p: 3,
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4
            }}
        >
            <Typography variant="h4" textAlign="center">
                🎨 Figura Faltante
            </Typography>

            {fase === 'mostrar' && (
                <>
                    <Typography textAlign="center">
                        Observa estas figuras y memorízalas.
                    </Typography>
                    {renderGrid(figurasOriginales)}
                    <Button
                        variant="contained"
                        onClick={avanzar}
                        sx={{ mt: 2 }}
                    >
                        Continuar
                    </Button>
                </>
            )}

            {fase === 'recordar' && (
                <>
                    <Typography textAlign="center">
                        Ahora falta una figura. ¿Cuál es?
                    </Typography>
                    {renderGrid(figurasIncompletas)}
                    <Button
                        variant="contained"
                        onClick={avanzar}
                        sx={{ mt: 2 }}
                    >
                        Siguiente
                    </Button>
                </>
            )}

            {fase === 'seleccionar' && (
                <>
                    <Typography textAlign="center">
                        Selecciona la figura que crees que falta:
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: 3,
                            mt: 2,
                        }}
                    >
                        {opciones.map((figura, i) => (
                            <Button
                                key={i}
                                variant="outlined"
                                onClick={() => manejarRespuesta(figura)}
                                sx={{
                                    width: isMobile ? 90 : 120,
                                    height: isMobile ? 90 : 120,
                                    fontSize: isMobile ? '2.5rem' : '4rem',
                                }}
                            >
                                {figura}
                            </Button>
                        ))}
                    </Box>
                </>
            )}

            {fase === 'resultado' && (
                <>
                    <Typography
                        variant="h5"
                        color={respuestaCorrecta ? 'green' : 'error'}
                        textAlign="center"
                    >
                        {respuestaCorrecta
                            ? '✅ ¡Correcto! +100'
                            : `❌ Incorrecto. La figura era: ${faltante}`}
                    </Typography>
                    /*<Button
                        variant="outlined"
                        sx={{ mt: 2 }}
                        onClick={() => window.location.reload()}
                    >
                        Reintentar
                    </Button>
                </>
            )}
        </Box>
    );
};

export default FiguraFaltante;
