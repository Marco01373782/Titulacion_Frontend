import { useEffect, useState } from 'react';
import { Box, Typography, Paper, TextField, Button } from '@mui/material';
import './RazonamientoPrincipiante.css';

type Pregunta = {
    enunciado: string;
    respuesta: number;
};

const generarPregunta = (): Pregunta => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const operacion = ['+', '-', '*'][Math.floor(Math.random() * 3)];
    let respuesta = 0;

    switch (operacion) {
        case '+':
            respuesta = a + b;
            break;
        case '-':
            respuesta = a - b;
            break;
        case '*':
            respuesta = a * b;
            break;
    }

    return {
        enunciado: `${a} ${operacion} ${b}`,
        respuesta,
    };
};

const RazonamientoPrincipiante = ({ onFinish }: { onFinish?: (result: string) => void }) => {
    const [pregunta, setPregunta] = useState<Pregunta>(generarPregunta());
    const [respuesta, setRespuesta] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [tiempo, setTiempo] = useState(10);
    const [correctas, setCorrectas] = useState(0);
    const [intentos, setIntentos] = useState(0);
    const [finalizado, setFinalizado] = useState(false);

    useEffect(() => {
        if (tiempo <= 0) {
            validarRespuesta();
        }
        const timer = setTimeout(() => setTiempo((t) => t - 1), 1000);
        return () => clearTimeout(timer);
    }, [tiempo]);

    const validarRespuesta = () => {
        const esCorrecta = parseInt(respuesta) === pregunta.respuesta;
        if (esCorrecta) {
            setCorrectas((prev) => prev + 1);
            setMensaje('✅ ¡Correcto!');
        } else {
            setMensaje(`❌ Incorrecto. Era ${pregunta.respuesta}`);
        }

        const nuevoIntento = intentos + 1;

        if (nuevoIntento >= 5) {
            setFinalizado(true);
            const puntaje = Math.round(((correctas + (esCorrecta ? 1 : 0)) / 5) * 100);
            if (onFinish) onFinish(puntaje.toString());
        } else {
            setTimeout(() => {
                setPregunta(generarPregunta());
                setRespuesta('');
                setMensaje('');
                setTiempo(10);
                setIntentos(nuevoIntento);
            }, 1000);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        validarRespuesta();
    };

    return (
        <Box className="actividad-wrapper">
            <Paper elevation={4} className="actividad-contenedor">
                <Typography variant="h4" className="titulo">🔍 Razonamiento - Principiante</Typography>

                <Typography
                    variant="body1"
                    className="instrucciones"
                >
                    Resuelve la operación antes que se acabe el tiempo. Tienes 5 intentos para demostrar tu lógica. ¡A pensar rápido! 🧠⚡
                </Typography>

                {!finalizado && (
                    <>
                        <Typography variant="h3" className="pregunta">{pregunta.enunciado}</Typography>
                        <Typography variant="subtitle1" className="tiempo">⏳ Tiempo: {tiempo}s</Typography>

                        <form onSubmit={handleSubmit} className="formulario">
                            <TextField
                                value={respuesta}
                                onChange={(e) => setRespuesta(e.target.value)}
                                placeholder="Tu respuesta"
                                type="number"
                                variant="outlined"
                                className="input"
                                inputProps={{ style: { fontSize: '1.5rem', textAlign: 'center' } }}
                                required
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                className="boton"
                                sx={{ fontSize: '1.2rem', padding: '0.6rem 2rem' }}
                            >
                                Enviar
                            </Button>
                        </form>
                    </>
                )}

                {mensaje && <Typography className="mensaje">{mensaje}</Typography>}

                {finalizado && (
                    <Box className="resultado-final">
                        <Typography variant="h6">🎯 Completado. Puntaje: {Math.round((correctas / 5) * 100)}/100</Typography>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default RazonamientoPrincipiante;

/*
🎯 INSTRUCCIONES PARA EL USUARIO (en pantalla):

Resuelve 5 operaciones matemáticas rápidas.  
Tienes 10 segundos por pregunta.  
Al final recibirás un puntaje sobre 100.  
¡Piensa rápido y responde bien! 🧠⚡
*/
