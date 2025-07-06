    import { useState, useEffect } from 'react';
    import { Box, Typography, Button, Paper, useTheme, useMediaQuery } from '@mui/material';
    import './MemoriaPrincipiante.css';

    const colores = ['🔴', '🟢', '🔵', '🟡'];

    const generarSecuencia = (longitud: number) => {
    return Array.from({ length: longitud }, () => colores[Math.floor(Math.random() * colores.length)]);
    };

    const MemoriaPrincipiante = ({ onFinish }: { onFinish?: (result: string) => void }) => {
    const [secuencia, setSecuencia] = useState<string[]>([]);
    const [mostrarSecuencia, setMostrarSecuencia] = useState(false);
    const [respuesta, setRespuesta] = useState<string[]>([]);
    const [resultado, setResultado] = useState<string | null>(null);
    const [contador, setContador] = useState<number>(3);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (contador > 0) {
        interval = setInterval(() => {
            setContador((prev) => prev - 1);
        }, 1000);
        } else {
        const nuevaSecuencia = generarSecuencia(4);
        setSecuencia(nuevaSecuencia);
        setMostrarSecuencia(true);
        const timer = setTimeout(() => {
            setMostrarSecuencia(false);
        }, 4000);
        return () => clearTimeout(timer);
        }

        return () => clearInterval(interval);
    }, [contador]);

    const handleColorClick = (color: string) => {
        const nuevaRespuesta = [...respuesta, color];
        setRespuesta(nuevaRespuesta);
        if (nuevaRespuesta.length === secuencia.length) {
        const aciertos = nuevaRespuesta.filter((c, i) => c === secuencia[i]).length;
        const porcentaje = Math.round((aciertos / secuencia.length) * 100);
        const resultadoTexto = `✅ Acertaste ${aciertos} de ${secuencia.length} colores. Puntaje: ${porcentaje}/100 🎯`;
        setResultado(resultadoTexto);
        if (onFinish) onFinish(porcentaje.toString());
        }
    };

    return (
        <Box className="actividad-wrapper">
        <Paper elevation={4} className="actividad-contenedor">
            <Typography variant="h4" className="titulo">
            🧠 Memoria Visual - Nivel Principiante
            </Typography>

            <Typography
            variant="body1"
            sx={{
                backgroundColor: '#FFF3CD',
                color: '#856404',
                padding: '0.8rem',
                borderRadius: '10px',
                marginBottom: '1.5rem',
                fontWeight: 500,
                fontSize: '1rem',
            }}
            >
            🕒 Tendrás 8 segundos para memorizar la secuencia de colores.
            Luego repite el orden haciendo clic en los botones. ¡Concentración total! 😎
            </Typography>

            {contador > 0 ? (
            <Typography variant="h5" color="primary">
                🔄 Prepárate en... {contador}
            </Typography>
            ) : mostrarSecuencia ? (
            <Box className="secuencia">
                {secuencia.map((color, i) => (
                <span key={i} className="color-circulo">{color}</span>
                ))}
                <Typography variant="subtitle1" className="texto">
                ¡Memoriza esta secuencia!
                </Typography>
            </Box>
            ) : (
            <>
                <Typography variant="subtitle1">
                Ahora repite la secuencia haciendo clic en los colores:
                </Typography>
                <Box className="opciones">
                {colores.map((color, i) => (
                    <Button
                    key={i}
                    onClick={() => handleColorClick(color)}
                    className="btn-color"
                    variant="contained"
                    >
                    {color}
                    </Button>
                ))}
                </Box>
            </>
            )}

            {resultado && (
            <Box className="resultado">
                <Typography variant="h6">{resultado}</Typography>
            </Box>
            )}
        </Paper>
        </Box>
    );
    };

    export default MemoriaPrincipiante;

    /*
    🎯 INSTRUCCIONES PARA EL USUARIO:

    - Tendrás 4 segundos para memorizar una secuencia de 4 colores.
    - La secuencia estará representada por emojis: 🔴🟢🔵🟡.
    - Cuando el tiempo termine, la secuencia desaparecerá.
    - Luego deberás repetir el orden correcto haciendo clic en los botones de colores.
    - Al final, verás tu resultado:
    ✅ Cuántos acertaste.
    🎯 Y un puntaje entre 0 y 100.

    ¡Usa tu atención y memoria al máximo y trata de mejorar tu puntaje cada vez!
    */
