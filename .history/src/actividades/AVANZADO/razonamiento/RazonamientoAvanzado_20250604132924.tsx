import React, { useState } from 'react';
import './RazonamientoRompecabezas.css';

const solucion = [
  [1, 2, 3],
  [3, 1, 2],
  [2, 3, 1],
];

// Posiciones ocultas para que el usuario las complete
const ocultarCeldas = [
  [false, true, false],
  [false, false, true],
  [true, false, false],
];

const RazonamientoRompecabezas = ({ onFinish }: { onFinish?: (res: string) => void }) => {
  const [celdas, setCeldas] = useState<number[][]>(() =>
    solucion.map((fila, i) =>
      fila.map((val, j) => (ocultarCeldas[i][j] ? 0 : val))
    )
  );
  const [mensaje, setMensaje] = useState('');
  const [finalizado, setFinalizado] = useState(false);

  const handleChange = (fila: number, col: number, value: string) => {
    const val = parseInt(value);
    if (isNaN(val) || val < 1 || val > 3) return;

    const copia = [...celdas];
    copia[fila][col] = val;
    setCeldas(copia);
  };

  const verificar = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (celdas[i][j] !== solucion[i][j]) {
          setMensaje('❌ Aún hay errores, inténtalo de nuevo.');
          return;
        }
      }
    }
    setMensaje('✅ ¡Correcto! Has resuelto el rompecabezas.');
    setFinalizado(true);
    if (onFinish) onFinish('Rompecabezas resuelto correctamente');
  };

  return (
    <div className="rompecabezas-container">
      <h2>🔍 Razonamiento - Avanzado</h2>
      <p>Completa la cuadrícula. Cada número (1-3) debe estar **una vez por fila y columna**.</p>

      <div className="grid">
        {celdas.map((fila, i) =>
          fila.map((celda, j) => (
            <input
              key={`${i}-${j}`}
              type="number"
              min={1}
              max={3}
              value={celda === 0 ? '' : celda}
              disabled={!ocultarCeldas[i][j] || finalizado}
              onChange={(e) => handleChange(i, j, e.target.value)}
              className="cell"
            />
          ))
        )}
      </div>

      {!finalizado && (
        <button className="verificar-btn" onClick={verificar}>
          Verificar
        </button>
      )}

      {mensaje && <p className="mensaje">{mensaje}</p>}
    </div>
  );
};

export default RazonamientoRompecabezas;
