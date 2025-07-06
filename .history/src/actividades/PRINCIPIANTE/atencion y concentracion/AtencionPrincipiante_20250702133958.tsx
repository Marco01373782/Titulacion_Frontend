import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import './AtencionPrincipiante.css';

const numeros = ['1', '2', '3', '4'];

const generarSecuencia = (longitud: number) => {
  return Array.from({ length: longitud }, () =>
    Math.floor(Math.random() * numeros.length)
  );
};

const AtencionPrincipiante = ({ onFinish }: { onFinish?: (resultado: string) => void }) => {
  const [secuencia, setSecuencia] = useState<number[]>([]);
  const [usuario, setUsuario] = useState<number[]>([]);
  const [mostrar, setMostrar] = useState(false);
  const [jugando, setJugando] = useState(false);
  const [resultado, setResultado] = useState('');

  useEffect(() => {
    const nuevaSecuencia = generarSecuencia(4);
    setSecuencia(nuevaSecuencia);
    setUsuario([]);
    setMostrar(true);
    setJugando(false);

    const mostrarTimer = setTimeout(() => {
      setMostrar(false);
      setJugando(true);
    }, 3000); // Mostrar durante 3 segundos

    return () => clearTimeout(mostrarTimer);
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
    <Box className="actividad-wrapper">
      <Paper elevation={4} className="actividad-contenedor">
        <Typography variant="h4" className="titulo">
          🧠 Atención Numérica - Principiante
        </Typography>

        <Typography className="instrucciones">
          Memoriza la secuencia de números y repítela en el mismo orden.
        </Typography>

        {mostrar && (
          <Box className="secuencia-mostrada">
            {secuencia.map((num, i) => (
              <Box key={i} className="numero-card visible">
                {numeros[num]}
              </Box>
            ))}
          </Box>
        )}

        {jugando && (
          <>
            <Typography variant="subtitle1" sx={{ marginTop: '1rem' }}>
              Selecciona la secuencia:
            </Typography>
            <Box className="botones-numeros">
              {numeros.map((n, i) => (
                <Button
                  key={i}
                  variant="contained"
                  className="numero-btn"
                  onClick={() => handleClick(i)}
                >
                  {n}
                </Button>
              ))}
            </Box>
          </>
        )}

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
