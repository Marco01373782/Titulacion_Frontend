import { useState, useEffect } from 'react';
import './MemoriaPrincipiante.css';

const colores = ['🔴', '🟢', '🔵', '🟡'];

const generarSecuencia = (longitud: number) => {
  return Array.from({ length: longitud }, () => colores[Math.floor(Math.random() * colores.length)]);
};

const MemoriaPrincipiante = ({ onFinish }: { onFinish?: (result: string) => void }) => {
  const [secuencia, setSecuencia] = useState<string[]>([]);
  const [mostrarSecuencia, setMostrarSecuencia] = useState(true);
  const [respuesta, setRespuesta] = useState<string[]>([]);
  const [resultado, setResultado] = useState<string | null>(null);

  useEffect(() => {
    const nuevaSecuencia = generarSecuencia(4); // dificultad principiante
    setSecuencia(nuevaSecuencia);
    const timer = setTimeout(() => {
      setMostrarSecuencia(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleColorClick = (color: string) => {
    const nuevaRespuesta = [...respuesta, color];
    setRespuesta(nuevaRespuesta);
    if (nuevaRespuesta.length === secuencia.length) {
      const aciertos = nuevaRespuesta.filter((c, i) => c === secuencia[i]).length;
      const resultadoTexto = `Acertaste ${aciertos} de ${secuencia.length} colores.`;
      setResultado(resultadoTexto);
      if (onFinish) onFinish(resultadoTexto);
    }
  };

  return (
    <div className="memoria-principiante">
      <h2>🧠 Memoria Visual - Nivel Principiante</h2>
      {mostrarSecuencia ? (
        <div className="secuencia">
          {secuencia.map((color, i) => (
            <span key={i} className="color-circulo">{color}</span>
          ))}
          <p className="texto">Memoriza el orden de los colores</p>
        </div>
      ) : (
        <>
          <p>Haz clic en los colores en el orden correcto:</p>
          <div className="opciones">
            {colores.map((color, i) => (
              <button key={i} onClick={() => handleColorClick(color)} className="btn-color">{color}</button>
            ))}
          </div>
        </>
      )}
      {resultado && <div className="resultado">{resultado}</div>}
    </div>
  );
};

export default MemoriaPrincipiante;
