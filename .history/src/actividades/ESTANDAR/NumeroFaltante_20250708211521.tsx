import { useState } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

const generarNumeros = (cantidad: number): number[] => {
    const numeros: Set<number> = new Set();
    while (numeros.size < cantidad) {
        numeros.add(Math.floor(Math.random() * 10));
    }
    return Array.from(numeros);
};

const NumeroFaltante = ({ onFinish }: { onFinish?: (result: string) => void }) => {
    const [fase, setFase] = useState<'mostrar' | 'seleccionar' | 'resultado'>('mostrar');
    const [numeros, /*setNumeros*/] = useState<number[]>(generarNumeros(5));
    const [faltante, setFaltante] = useState<number | null>(null);
    const [opciones, setOpciones] = useState<number[]>([]);
    const [respuestaCorrecta, setRespuestaCorrecta] = useState<boolean | null>(null);

    const avanzar = () => {
        if (fase === 'mostrar') {
            const copia = [...numeros];
            const index = Math.floor(Math.random() * copia.length);
            const eliminado = copia.splice(index, 1)[0];
            setFaltante(eliminado);
            const distractor = generarNumeros(1).find((n) => !copia.includes(n) && n !== eliminado) || 0;
            setOpciones([eliminado, distractor].sort(() => Math.random() - 0.5));
            setFase('seleccionar');
        }
    };

    const manejarRespuesta = (valor: number) => {
        const acierto = valor === faltante;
        setRespuestaCorrecta(acierto);
        setFase('resultado');
        if (onFinish) onFinish(acierto ? '100' : '0');
    };

    return (
        <Box sx={{ width: '100%', height: '100%', p: 3, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, background:'red' }}>
            <Typography variant="h4" textAlign="center">🔢 Memoria: ¿Qué número falta?</Typography>

            {fase === 'mostrar' && (
                <>
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' ,background:'blue',width: '100%', height: '50%', alignItems: 'center',}}>
                        {numeros.map((num, i) => (
                            <Paper key={i} elevation={4} sx={{ width: 200, height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' ,background:'green' , fontWeight:}}>
                                {num}
                            </Paper>
                        ))}
                    </Box>
                    <Button variant="contained" onClick={avanzar} sx={{ mt: 3, fontSize: '1.2rem', px: 4 }}>Continuar</Button>
                </>
            )}

            {fase === 'seleccionar' && faltante !== null && (
                <>
                    <Typography variant="body1" textAlign="center">Selecciona el número que faltaba:</Typography>
                    <Box sx={{ display: 'flex', gap: 4, mt: 2 }}>
                        {opciones.map((num, i) => (
                            <Button key={i} variant="outlined" onClick={() => manejarRespuesta(num)} sx={{ width: 80, height: 80, fontSize: '2rem' }}>
                                {num}
                            </Button>
                        ))}
                    </Box>
                </>
            )}

            {fase === 'resultado' && (
                <>
                    <Typography variant="h5" color={respuestaCorrecta ? 'green' : 'error'}>
                        {respuestaCorrecta ? '✅ ¡Correcto! +100' : `❌ Incorrecto. Era el ${faltante}`}
                    </Typography>
                </>
            )}
        </Box>
    );
};

export default NumeroFaltante;
