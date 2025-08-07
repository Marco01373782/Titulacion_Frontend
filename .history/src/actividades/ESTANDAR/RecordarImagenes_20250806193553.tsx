import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    useMediaQuery,
    useTheme
} from '@mui/material';

import perrocolorido from '../../assets/actividades/perro-colorido.webp';
import gatocolorido from '../../assets/actividades/gato-colorido.webp';
import conejo from '../../assets/actividades/conejo colorido.webp';
import cerdo from '../../assets/actividades/cerdo.webp';
import pajaro from '../../assets/actividades/pajaro.webp';
import caballo from '../../assets/actividades/caballo.webp';

const imagenesDisponibles = [
    perrocolorido,
    gatocolorido,
    conejo,
    cerdo,
    pajaro,
    caballo,
];

const RecordarImagenes = ({ onFinish }: { onFinish?: (result: string) => void }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [fase, setFase] = useState<'instruccion' | 'memorizar' | 'seleccionar' | 'resultado'>('instruccion');
    const [imagenesObjetivo, setImagenesObjetivo] = useState<string[]>([]);
    const [imagenesMezcladas, setImagenesMezcladas] = useState<string[]>([]);
    const [seleccionadas, setSeleccionadas] = useState<string[]>([]);
    const [resultadoTexto, setResultadoTexto] = useState<string | null>(null);

    useEffect(() => {
        if (fase === 'memorizar') {
            const timer = setTimeout(() => setFase('seleccionar'), 6500); // 8 segundos para memorizar
            return () => clearTimeout(timer);
        }
    }, [fase]);

    const iniciarActividad = () => {
        const seleccionadas = imagenesDisponibles.sort(() => Math.random() - 0.5).slice(0, 4); // un poco más difícil
        setImagenesObjetivo(seleccionadas);

        const distractores = imagenesDisponibles
            .filter(p => !seleccionadas.includes(p))
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

        const mezcladas = [...seleccionadas, ...distractores].sort(() => Math.random() - 0.5);
        setImagenesMezcladas(mezcladas);
        setSeleccionadas([]);
        setResultadoTexto(null);
        setFase('memorizar');
    };

    const manejarSeleccion = (src: string) => {
        setSeleccionadas(prev => {
            if (prev.includes(src)) {
                return prev.filter(p => p !== src);
            } else if (prev.length < imagenesObjetivo.length) {
                return [...prev, src];
            } else {
                return prev;
            }
        });
    };

    const evaluar = () => {
        const aciertos = seleccionadas.filter(img => imagenesObjetivo.includes(img)).length;
        const puntaje = Math.round((aciertos / imagenesObjetivo.length) * 100);
        setResultadoTexto(`✅ Recordaste ${aciertos} de ${imagenesObjetivo.length} imágenes. Puntaje: ${puntaje}/100`);
        if (onFinish) onFinish(puntaje.toString());
        setFase('resultado');
    };

    const renderGrid = (imagenes: string[], desactivado = false) => (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 2,
                width: '100%',
                maxWidth: 1000,
                mt: 2,
            }}
        >
            {imagenes.map((src, index) => (
                <Paper
                    key={index}
                    onClick={() => !desactivado && manejarSeleccion(src)}
                    elevation={4}
                    sx={{
                        border: seleccionadas.includes(src)
                            ? '5px solid #4caf50'
                            : '2px solid #ccc',
                        borderRadius: '14px',
                        cursor: desactivado ? 'default' : 'pointer',
                        overflow: 'hidden',
                        height: isMobile ? 150 : 200,
                        backgroundColor: '#fff',
                        transition: 'all 0.3s',
                    }}
                >
                    <img
                        src={src}
                        alt={`imagen-${index}`}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                </Paper>
            ))}
        </Box>
    );

    return (
        <Box
            sx={{
                width: '100%',
                minHeight: '85vh',
                p: 2,
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2
            }}
        >
            <Typography variant="h4" textAlign="center">
                🧠 Memoria Visual
            </Typography>

            {fase === 'instruccion' && (
                <>
                    <Typography textAlign="center">
                        Memoriza las imágenes que aparecerán. Luego deberás reconocerlas.
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={iniciarActividad}
                        sx={{ mt: 2 }}
                    >
                        Empezar
                    </Button>
                </>
            )}

            {fase === 'memorizar' && (
                <>
                    <Typography textAlign="center">
                        Memoriza estas imágenes (8 segundos):
                    </Typography>
                    {renderGrid(imagenesObjetivo, true)}
                </>
            )}

            {fase === 'seleccionar' && (
                <>
                    <Typography textAlign="center">
                        Selecciona las {imagenesObjetivo.length} imágenes que viste antes:
                    </Typography>
                    {renderGrid(imagenesMezcladas)}
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
                </>
            )}
        </Box>
    );
};

export default RecordarImagenes;