import { useState, useEffect } from 'react';
import './MemoriaTest.css';

const palabras = ['gato', 'árbol', 'sol', 'libro', 'cielo'];

interface MemoriaTestProps {
  onFinish?: (result: number) => void;
}

const MemoriaTest: React.FC<MemoriaTestProps> = ({ onFinish }) => {
  const [mostrarPalabras, setMostrarPalabras] = useState(true);
  const [input, setInput] = useState('');
  const [resultadoTexto, setResultadoTexto] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMostrarPalabras(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const respuestas = input.toLowerCase().split(',').map(p => p.trim());
    const correctas = palabras.filter(p => respuestas.includes(p));
    const texto = `Recordaste ${correctas.length} de ${palabras.length} palabras.`;
    setResultadoTexto(texto);

    // Enviamos un número al backend, no el texto
    if (onFinish) {
      onFinish(correctas.length);
    }
  };

  return (
    <div className="memoria-container">
      <h2 className="titulo">🧠 Actividad de Memoria - Nivel Test</h2>

      {mostrarPalabras ? (
        <div className="instrucciones">
          <p>Observa las siguientes palabras. Tienes 6 segundos para memorizarlas:</p>
          <div className="cartas-container">
            {palabras.map((palabra, i) => (
              <div className="carta" key={i}>{palabra}</div>
            ))}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="formulario">
          <p>
            Escribe las palabras que recuerdas, separadas por comas.
            <br />
            O pide ayuda para que las anote por ti.
          </p>
          <textarea
            className="input-memoria"
            rows={4}
            placeholder="Ej: gato, sol, libro..."
            value={input}
            onChange={e => setInput(e.target.value)}
            required
          />
          <button type="submit" className="boton-enviar">Enviar respuestas</button>
        </form>
      )}

      {resultadoTexto && <div className="resultado">{resultadoTexto}</div>}
    </div>
  );
};

export default MemoriaTest;
