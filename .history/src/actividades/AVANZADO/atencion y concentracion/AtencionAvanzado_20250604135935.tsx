import { useEffect, useState } from 'react';
import './AtencionAvanzado.css';

const coloresDisponibles = ['red', 'green', 'blue', 'yellow'];
const colorProhibido = 'red'; // color a evitar

type Cuadro = {
  id: number;
  color: string;
};

export const AtencionAvanzado = ({ onFinish }: { onFinish?: (resultado: string) => void }) => {
  const [cuadros, setCuadros] = useState<Cuadro[]>([]);
  const [resultado, setResultado] = useState('');
  const [puntaje, setPuntaje] = useState(0);
  const [juegoActivo, setJuegoActivo] = useState(true);
  const [contador, setContador] = useState(0);

  useEffect(() => {
    if (!juegoActivo) return;

    const interval = setInterval(() => {
      setContador((prev) => prev + 1);
      const colorAleatorio = coloresDisponibles[Math.floor(Math.random() * coloresDisponibles.length)];
      const nuevoCuadro: Cuadro = {
        id: Date.now(),
        color: colorAleatorio,
      };
      setCuadros((prev) => [...prev.slice(-4), nuevoCuadro]); // máximo 4
    }, 1000);

    return () => clearInterval(interval);
  }, [juegoActivo]);

  const manejarClick = (cuadro: Cuadro) => {
    if (!juegoActivo) return;

    if (cuadro.color === colorProhibido) {
      setResultado('❌ ¡Fallaste! Pulsaste el color prohibido');
      setJuegoActivo(false);
      if (onFinish) onFinish('Falló');
    } else {
      setPuntaje((p) => p + 1);
    }
  };

  useEffect(() => {
    if (contador >= 10 && juegoActivo) {
      setResultado(`✅ ¡Bien hecho! Puntaje: ${puntaje}`);
      setJuegoActivo(false);
      if (onFinish) onFinish('Correcto');
    }
  }, [contador, juegoActivo, puntaje, onFinish]);

  return (
    <div className="color-prohibido-container">
      <h2>🎯 Atención - Avanzado</h2>
      <p>No pulses el color <strong style={{ color: colorProhibido }}>{colorProhibido.toUpperCase()}</strong></p>
      <div className="cuadro-zona">
        {cuadros.map((cuadro) => (
          <div
            key={cuadro.id}
            className={`cuadro ${cuadro.color}`}
            onClick={() => manejarClick(cuadro)}
          />
        ))}
      </div>
      {resultado && <p className="resultado">{resultado}</p>}
    </div>
  );
};

export default AtencionAvanzado;
