import { useState, useEffect } from 'react';
import './MemoriaSecuenciaAvanzada.css';

const generarSecuencia = (longitud: number): number[] => {
  const secuencia: number[] = [];
  for (let i = 0; i < longitud; i++) {
    secuencia.push(Math.floor(Math.random() * 90 + 10)); // números de 2 dígitos
  }
  return secuencia;
};

const MemoriaSecuenciaAvanzada = ({ onFinish }: { onFinish?: (result: string) => void }) => {
  const [fase, setFase] = useState<'mostrar' | 'input' | 'resultado'>('mostrar');
  const [secuencia, setSecuencia] = useState<number[]>([]);
  const [respuesta, setRespuesta] = useState('');
  const [mensajeResultado, setMensajeResultado] = useState('');

  useEffect(() => {
    const nuevaSecuencia = generarSecuencia(6); // Puedes ajustar la dificultad aquí
    setSecuencia(nuevaSecuencia);
    const temporizador = setTimeout(() => setFase('input'), 6000);
    return () => clearTimeout(temporizador);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const respuestaNumeros = respuesta.split(',').map(s => parseInt(s.trim()));
    const correctos = respuestaNumeros.filter((num, i) => num === secuencia[i]);
    const mensaje = `Recordaste correctamente ${correctos.length} de ${secuencia.length} números.`;
    setMensajeResultado(mensaje);
    setFase('resultado');
    if (onFinish) onFinish(mensaje);
  };

  return (
    <div className="memoria-avanzada-container">
      <h2 className="titulo">🧠 Memoria - Nivel Avanzado</h2>

      {fase === 'mostrar' && (
        <div className="fase-mostrar">
          <p>Observa y memoriza esta secuencia de números:</p>
          <div className="secuencia">
            {secuencia.map((n, i) => (
              <div key={i} className="numero">{n}</div>
            ))}
          </div>
        </div>
      )}

      {fase === 'input' && (
        <form onSubmit={handleSubmit} className="fase-input">
          <p>Escribe la secuencia que recuerdas, separando los números con comas.</p>
          <textarea
            className="input-secuencia"
            rows={3}
            value={respuesta}
            onChange={(e) => setRespuesta(e.target.value)}
            placeholder="Ej: 34, 76, 21, 89..."
            required
          />
          <button type="submit" className="boton-enviar">Enviar</button>
        </form>
      )}

      {fase === 'resultado' && (
        <div className="resultado">
          <p>{mensajeResultado}</p>
        </div>
      )}
    </div>
  );
};

export default MemoriaSecuenciaAvanzada;
