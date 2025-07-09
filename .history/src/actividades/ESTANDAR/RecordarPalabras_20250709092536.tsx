import { useState } from 'react';
import { Box, Typography, Button, Paper, useMediaQuery, useTheme } from '@mui/material';

const todasLasPalabras = ['gato', 'perro', 'sol', 'libro', 'cielo', 'flor', 'ratón'];

const RecordarPalabras = ({ onFinish }: { onFinish?: (result: string) => void }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [fase, setFase] = useState<'mostrar' | 'seleccionar' | 'resultado'>('mostrar');
    const [palabrasObjetivo] = useState<string[]>(
        todasLasPalabras.sort(() => Math.random() - 0.5).slice(0, 2)
    );
    const [palabrasMezcladas] = useState<string[]>(
        [...palabrasObjetivo, ...todasLasPalabras.filter(p => !palabrasObjetivo.includes(p))]
            .sort(() => Math.random() - 0.5)
            .slice(0, Math.floor(Math.random() * 3) + 4) // entre 4 y 6
            .sort(() => Math.random() - 0.5)
    );
    const [seleccionadas, setSeleccionadas] = useState<string[]>([]);
    const [resultadoTexto, setResultadoTexto] = useState<string | null>(null);

    const manejarSeleccion = (palabra: string) => {
        setSeleccionadas(prev =>
            prev.includes(palabra) ? prev.filter(p => p !== palabra) : [...prev, palabra]
        );
    };

    const evaluar = () => {
        const aciertos = seleccionadas.filter(p => palabrasObjetivo.includes(p)).length;
        const puntaje = aciertos * 50;
        setResultadoTexto(`✅ Recordaste ${aciertos} de 2 palabras. Puntaje: ${puntaje}/100`);
        if (onFinish) onFinish(puntaje.toString());
        setFase('resultado');
    };

    const renderGrid = (palabras: string[]) => (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: isMobile ? 'repeat(1, 1fr)' : 'repeat(4, 1fr)',
                gap: 2,
                width: '100%',
                maxWidth: 900,
                justifyItems: 'center',
                mt: 3
            }}
        >
            {palabras.map((palabra, i) => (
                <Paper
                    key={i}
                    onClick={() => fase === 'seleccionar' && manejarSeleccion(palabra)}
                    elevation={4}
                    sx={{
                        width: isMobile ? 140 : 200,
                        height: isMobile ? 120 : 180,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: isMobile ? '1.5rem' : '2rem',
                        fontWeight: 'bold',
                        cursor: fase === 'seleccionar' ? 'pointer' : 'default',
                        border: seleccionadas.includes(palabra) ? '3px solid #4caf50' : '2px solid #ccc',
                        borderRadius: '12px',
                        backgroundColor: '#bl'
                    }}
                >
                    {palabra}
                </Paper>
            ))}
        </Box>
    );

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
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
                🧠 Memoria: ¿Recuerdas las palabras?
            </Typography>

            {fase === 'mostrar' && (
                <>
                    <Typography textAlign="center">
                        Memoriza las siguientes palabras. Luego deberás reconocerlas entre varias opciones:
                    </Typography>
                    {renderGrid(palabrasObjetivo)}
                    <Button variant="contained" onClick={() => setFase('seleccionar')} sx={{ mt: 3 }}>
                        Continuar
                    </Button>
                </>
            )}

            {fase === 'seleccionar' && (
                <>
                    <Typography textAlign="center">
                        Selecciona las palabras que viste anteriormente. Puedes elegir 1 o 2.
                    </Typography>
                    {renderGrid(palabrasMezcladas)}
                    <Button variant="contained" onClick={evaluar} sx={{ mt: 3 }}>
                        Enviar respuestas
                    </Button>
                </>
            )}

            {fase === 'resultado' && resultadoTexto && (
                <Typography variant="h6" color="primary">
                    {resultadoTexto}
                </Typography>
            )}
        </Box>
    );
};

export default RecordarPalabras;
