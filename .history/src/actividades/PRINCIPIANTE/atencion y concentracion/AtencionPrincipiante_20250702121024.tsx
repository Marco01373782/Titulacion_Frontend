import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import './AtencionPrincipiante.css';

const colores = ['red', 'green', 'blue', 'yellow'];

const generarSecuencia = (longitud: number) => {
    return Array.from({ length: longitud }, () =>
        Math.floor(Math.random() * colores.length)
    );
};

const AtencionPrincipiante = ({ onFinish }: { onFinish?: (resultado: string) => void }) => {
    const [secuencia, setSecuencia] = useState<number[]>([]);
    const [usuario, setUsuario] = useState<number[]>([]);
    const [mostrarIndice, setMostrarIndice] = useState(0);
    const [jugando, setJugando] = useState(false);
    const [resultado, setResultado] = useState('');

    useEffect(() => {
        const nuevaSecuencia = generarSecuencia(4);
        setSecuencia(nuevaSecuencia);
        setUsuario([]);
        setMostrarIndice(0);
        setJugando(false);

        const interval = setInterval(() => {
            setMostrarIndice((i) => i + 1);
        }, 800);

        setTimeout(() => {
            clearInterval(interval);
            setJugando(true);
        }, 800 * nuevaSecuencia.length + 500);

        return () => clearInterval(interval);
    }, []);

    const handleClick = (i: number) => {
        if (!jugando || resultado) return;

        const nuevoUsuario = [...usuario, i];
        setUsuario(nuevoUsuario);

        if (secuencia[nuevoUsuario.length - 1] !== i) {
            setResultado('❌ Incorrecto');
            if (onFinish) onFinish('0');
            return;
        }

        if (nuevoUsuario.length === secuencia.length) {
            setResultado('✅ Correcto');
            if (onFinish) onFinish('100');
        }
    };

    return (
        <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#f4f5fa', p: 2, position: 'relative' }}>

            <Paper elevation={4} className="actividad-contenedor">
                <Typography variant="h4" className="titulo">
                    🎯 Atención - Principiante
                </Typography>

                <Typography
                    variant="body1"
                    className="instrucciones"
                >
                    Observa la secuencia de luces y repítela en el mismo orden. Una falla termina la ronda.
                </Typography>

                <Box className="botones-luz">
                    {colores.map((color, i) => {
                        const iluminado = mostrarIndice > i && secuencia[i] === i && mostrarIndice <= secuencia.length;
                        const activo = !jugando && iluminado;

                        return (
                            <Button
                                key={i}
                                className={`luz-boton ${color} ${activo ? 'activo' : ''}`}
                                onClick={() => handleClick(i)}
                                disabled={!jugando || resultado !== ''}
                            />
                        );
                    })}
                </Box>

                {resultado && (
                    <Typography className="mensaje">
                        {resultado} {resultado === '✅ Correcto' ? '🎉 Puntaje: 100/100' : '💥 Puntaje: 0/100'}
                    </Typography>
                )}
            </Paper>
        </Box>
    );
};

export default AtencionPrincipiante;

/*
🧠 INSTRUCCIONES PARA EL USUARIO (menos de 250 caracteres):

Observa la secuencia de luces de colores y repítela en el mismo orden.  
Solo tienes una oportunidad. Una falla termina el ejercicio.  
Tu puntaje será 100 si aciertas todo, 0 si fallas.
*/
