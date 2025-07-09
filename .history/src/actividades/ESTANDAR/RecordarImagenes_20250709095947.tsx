import { useState } from 'react';
import { Box, Typography, Button, Paper, useMediaQuery, useTheme } from '@mui/material';
import perrocolorido from '../../assets/actividades/perro-colorido.webp'
import gatocolorido from '../../assets/actividades/gato-colorido.webp'

// Coloca aquí las rutas de tus imágenes (pueden ser locales o URLs externas)
const imagenesDisponibles = [
    perrocolorido,
    gatocolorido,
    '/img/arbol.png',
    '/img/casa.png',
    '/img/casa.png',
    '/img/casa.png',
    
];

const RecordarImagenes = ({ onFinish }: { onFinish?: (result: string) => void }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [fase, setFase] = useState<'mostrar' | 'seleccionar' | 'resultado'>('mostrar');
    const [imagenesObjetivo] = useState<string[]>(
        imagenesDisponibles.sort(() => Math.random() - 0.5).slice(0, 2)
    );
    const [imagenesMezcladas] = useState<string[]>(
        [...imagenesObjetivo, ...imagenesDisponibles.filter(p => !imagenesObjetivo.includes(p))]
            .sort(() => Math.random() - 0.5)
            .slice(0, Math.floor(Math.random() * 3) + 6) // entre 4 y 6
            .sort(() => Math.random() - 0.5)
    );
    const [seleccionadas, setSeleccionadas] = useState<string[]>([]);
    const [resultadoTexto, setResultadoTexto] = useState<string | null>(null);

    const manejarSeleccion = (imagen: string) => {
        setSeleccionadas(prev =>
            prev.includes(imagen) ? prev.filter(p => p !== imagen) : [...prev, imagen]
        );
    };

    const evaluar = () => {
        const aciertos = seleccionadas.filter(p => imagenesObjetivo.includes(p)).length;
        const puntaje = aciertos * 50;
        setResultadoTexto(`✅ Recordaste ${aciertos} de 2 imágenes. Puntaje: ${puntaje}/100`);
        if (onFinish) onFinish(puntaje.toString());
        setFase('resultado');
    };

    const renderGrid = (imagenes: string[]) => (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                gap: 2,
                width: '100%',
                maxWidth: '100%',
                justifyItems: 'center',
                mt: 1
            }}
        >
            {imagenes.map((src, i) => (
                <Paper
                    key={i}
                    onClick={() => fase === 'seleccionar' && manejarSeleccion(src)}
                    elevation={4}
                    sx={{
                        width: isMobile ? 180 : 240,
                        height: isMobile ? 240 : 310,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: seleccionadas.includes(src) ? '4px solid #4caf50' : '2px solid #ccc',
                        borderRadius: '10px',
                        cursor: fase === 'seleccionar' ? 'pointer' : 'default',
                        overflow: 'hidden',
                        backgroundColor: '#f9f9f9'
                    }}
                >
                    <img src={src} alt={`imagen-${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                🧠 Memoria Visual: ¿Qué imágenes viste antes?
            </Typography>

            {fase === 'mostrar' && (
                <>
                    <Typography textAlign="center">
                        Observa con atencion y recuerda las siguientes imágenes:
                    </Typography>
                    {renderGrid(imagenesObjetivo)}
                    <Button variant="contained" onClick={() => setFase('seleccionar')} sx={{ mt: 3 }}>
                        Continuar
                    </Button>
                </>
            )}

            {fase === 'seleccionar' && (
                <>
                <Typography variant="h4" textAlign="center">
                🧠 Memoria Visual: ¿Qué imágenes viste antes?
            </Typography>
                    <Typography textAlign="center">
                        Selecciona las imágenes que viste anteriormente:
                    </Typography>
                    {renderGrid(imagenesMezcladas)}
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

export default RecordarImagenes;
