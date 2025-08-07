import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    useMediaQuery,
    useTheme
} from '@mui/material';

const TODAS_LAS_PALABRAS = ['gato', 'perro', 'árbol', 'sol', 'libro', 'cielo', 'flor', 'ratón', 'mar', 'luna', 'estrella'];

const RecordarPalabras = ({ onFinish }: { onFinish?: (result: string) => void }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const TOTAL_OBJETIVO = 4; 
    const TOTAL_DISTRACTORES = 4;

    const [fase, setFase] = useState<'instruccion' | 'memorizar' | 'seleccionar' | 'resultado'>('instruccion');
    const [palabrasObjetivo] = useState<string[]>([...TODAS_LAS_PALABRAS].sort(() => Math.random() - 0.5).slice(0, TOTAL_OBJETIVO));
    const [palabrasMezcladas] = useState<string[]>(() => {
        const distractores = TODAS_LAS_PALABRAS
            .filter(p => !palabrasObjetivo.includes(p))
            .sort(() => Math.random() - 0.5)
            .slice(0, TOTAL_DISTRACTORES);
        return [...palabrasObjetivo, ...distractores].sort(() => Math.random() - 0.5);
    });

    const [seleccionadas, setSeleccionadas] = useState<string[]>([]);
    const [resultadoTexto, setResultadoTexto] = useState<string | null>(null);

    useEffect(() => {
        if (fase === 'memorizar') {
            const timer = setTimeout(() => setFase('seleccionar'), 4000);
            return () => clearTimeout(timer);
        }
    }, [fase]);

    const manejarSeleccion = (palabra: string) => {
        setSeleccionadas(prev =>
            prev.includes(palabra)
                ? prev.filter(p => p !== palabra)
                : [...prev, palabra].slice(0, palabrasObjetivo.length)
        );
    };

    const evaluar = () => {
        const aciertos = seleccionadas.filter(p => palabrasObjetivo.includes(p)).length;
        const puntaje = Math.round((aciertos / palabrasObjetivo.length) * 100);
        setResultadoTexto(`✅ Recordaste ${aciertos} de ${palabrasObjetivo.length} palabras. Puntaje: ${puntaje}/100`);
        if (onFinish) onFinish(puntaje.toString());
        setFase('resultado');
    };

    const renderGrid = (palabras: string[], desactivado = false) => (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
                gap: 2,
                width: '100%',
                maxWidth: 800,
                mt: 2,
                justifyItems: 'center',
            }}
        >
            {palabras.map((palabra, i) => (
                <Paper
                    key={i}
                    onClick={() => !desactivado && manejarSeleccion(palabra)}
                    elevation={4}
                    sx={{
                        width: isMobile ? 150 : 150,
                        height: isMobile ? 150 : 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: isMobile ? '1.5rem' : '2rem',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        cursor: desactivado ? 'default' : 'pointer',
                        border: seleccionadas.includes(palabra)
                            ? '4px solid #4caf50'
                            : '2px solid #ccc',
                        borderRadius: '12px',
                        backgroundColor: desactivado ? '#f5f5f5' : '#fff',
                        px: 1,
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
                height: '87vh',
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
            }}
        >
            <Typography variant="h4" textAlign="center">
                🧠 Memoria de Palabras
            </Typography>

            {fase === 'instruccion' && (
                <>
                    <Typography textAlign="center">
                        Memoriza las palabras. Luego trata de reconocerlas entre varias opciones.
                    </Typography>
                    <Box
                        component="button"
                        onClick={() => setFase('memorizar')}
                        style={{
                            marginTop: '16px',
                            padding: '12px 24px',
                            backgroundColor: '#1976d2',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}
                    >
                        Empezar
                    </Box>
                </>
            )}

            {fase === 'memorizar' && (
                <>
                    <Typography textAlign="center">Memoriza estas palabras (4 segundos):</Typography>
                    {renderGrid(palabrasObjetivo, true)}
                </>
            )}

            {fase === 'seleccionar' && (
                <>
                    <Typography textAlign="center">
                        Selecciona las palabras que viste (máx {palabrasObjetivo.length}):
                    </Typography>
                    {renderGrid(palabrasMezcladas)}
                    <Box
                        component="button"
                        onClick={evaluar}
                        disabled={seleccionadas.length === 0}
                        style={{
                            marginTop: '16px',
                            padding: '12px 24px',
                            backgroundColor: seleccionadas.length > 0 ? '#43a047' : '#aaa',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            cursor: seleccionadas.length > 0 ? 'pointer' : 'not-allowed'
                        }}
                    >
                        Enviar respuestas
                    </Box>
                </>
            )}

            {fase === 'resultado' && resultadoTexto && (
                <Typography variant="h6" color="primary" textAlign="center">
                    {resultadoTexto}
                </Typography>
            )}
        </Box>
    );
};

export default RecordarPalabras;
