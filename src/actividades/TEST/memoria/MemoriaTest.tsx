import { useState, useEffect } from 'react';
import './MemoriaTest.css';

const palabras = ['gato', 'árbol', 'sol', 'libro', 'cielo'];

const MemoriaTest  = ({ onFinish }: { onFinish?: (result: string) => void }) =>  {
  const [mostrarPalabras, setMostrarPalabras] = useState(true);
  const [input, setInput] = useState('');
  const [resultado, setResultado] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMostrarPalabras(false);
    }, 6000); // 6 segundos para recordar
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const respuestas = input.toLowerCase().split(',').map(p => p.trim());
    const correctas = palabras.filter(p => respuestas.includes(p));
    const resultadoTexto = `Recordaste ${correctas.length} de ${palabras.length} palabras.`;
    setResultado(resultadoTexto);
    if (onFinish) {
      onFinish(resultadoTexto);
    }
  };

  return (
    <div className="memoria-container">
      <h2 className="titulo">🧠 Actividad de Memoria - Nivel Test</h2>

      {mostrarPalabras ? (
        <div className="instrucciones">
          <p>Observa las siguientes palabras. Tienes unos segundos para memorizarlas:</p>
          <div className="cartas-container">
            {palabras.map((palabra, i) => (
              <div className="carta" key={i}>{palabra}</div>
            ))}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="formulario">
          <p>
            Si puedes escribir, escribe las palabras que recuerdas, separadas por comas.
            <br />
            Si no puedes, <strong>pide a quien te acompaña</strong> que las escriba por ti.
          </p>
          <textarea
            className="input-memoria"
            rows={4}
            placeholder="Ejemplo: gato, sol, libro..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            required
          />
          <button type="submit" className="boton-enviar">Enviar respuestas</button>
        </form>
      )}

      {resultado && <div className="resultado">{resultado}</div>}
    </div>
  );
};

export default MemoriaTest;
