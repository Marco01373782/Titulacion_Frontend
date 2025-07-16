import { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    useMediaQuery,
    useTheme
} from '@mui/material';

const todasLasPalabras = ['gato', 'perro', 'árbol', 'sol', 'libro', 'cielo', 'flor', 'ratón', 'mar', 'luna', 'estrella'];

const RecordarPalabras = ({ onFinish }: { onFinish?: (result: string) => void }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [fase, setFase] = useState<'instruccion' | 'memorizar' | 'seleccionar' | 'resultado'>('instruccion');
    const [palabrasObjetivo] = useState<string[]>(
        todasLasPalabras.sort(() => Math.random() - 0.5).slice(0, 3) // cambia a 2, 3, etc.
    );
    const [palabrasMezcladas] = useState<string[]>(() => {
        const distractores = todasLasPalabras.filter(p => !palabrasObjetivo.includes(p)).sort(() => Math.random() - 0.5).slice(0, 4);
        return [...palabrasObjetivo, ...distractores].sort(() => Math.random() - 0.5);
    });
    const [seleccionadas, setSeleccionadas] = useState<string[]>([]);
    const [resultadoTexto, setResultadoTexto] = useState<string | null>(null);

    const manejarSeleccion = (palabra: string) => {
        setSeleccionadas(prev =>
            prev.includes(palabra)
                ? prev.filter(p => p !== palabra)
                : [...prev, palabra].slice(0, palabrasObjetivo.length) // máx n palabras
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
                justifyItems: 'center',
                mt: 2,
            }}
        >
            {palabras.map((palabra, i) => (
                <Paper
                    key={i}
                    onClick={() => !desactivado && manejarSeleccion(palabra)}
                    elevation={4}
                    sx={{
                        width: isMobile ? '90%' : 180,
                        height: isMobile ? 100 : 150,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        cursor: desactivado ? 'default' : 'pointer',
                        border: seleccionadas.includes(palabra)
                            ? '3px solid #4caf50'
                            : '2px solid #ccc',
                        borderRadius: '12px',
                        backgroundColor: desactivado ? '#f5f5f5' : '#fff',
                        px: 1
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
                gap: 3,
            }}
        >
            <Typography variant="h4" textAlign="center">
                🧠 Memoria: ¿Puedes recordar las palabras?
            </Typography>

            {fase === 'instruccion' && (
                <>
                    <Typography textAlign="center">
                        Memoriza las palabras que aparecerán. Luego deberás reconocerlas entre varias.
                    </Typography>
                    <Button variant="contained" onClick={() => setFase('memorizar')} sx={{ mt: 2 }}>
                        Empezar
                    </Button>
                </>
            )}

            {fase === 'memorizar' && (
                <>
                    <Typography textAlign="center">Memoriza estas palabras:</Typography>
                    {renderGrid(palabrasObjetivo, true)}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setFase('seleccionar')}
                        sx={{ mt: 2 }}
                    >
                        Estoy listo
                    </Button>
                </>
            )}

            {fase === 'seleccionar' && (
                <>
                    <Typography textAlign="center">
                        Selecciona las palabras que viste. Puedes elegir hasta {palabrasObjetivo.length}.
                    </Typography>
                    {renderGrid(palabrasMezcladas)}
                    <Button
                        variant="contained"
                        onClick={evaluar}
                        disabled={seleccionadas.length === 0}
                        sx={{ mt: 2 }}
                    >
                        Enviar respuestas
                    </Button>
                </>
            )}

            {fase === 'resultado' && resultadoTexto && (
                <>
                    <Typography variant="h6" color="primary" textAlign="center">
                        {resultadoTexto}
                    </Typography>
                    {<Button
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

export default RecordarPalabras;
