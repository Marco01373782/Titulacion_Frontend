import React, { useEffect, useState } from 'react';
import './AtencionSimboloDiferente.css';

const simbolos = ['🔺', '🔻', '⚪️', '🟢', '🟡', '🔶', '🔷', '⬛️'];

const generarMatriz = () => {
  const base = simbolos[Math.floor(Math.random() * simbolos.length)];
  let diferente = base;
  while (diferente === base) {
    diferente = simbolos[Math.floor(Math.random() * simbolos.length)];
  }

  const matriz = Array.from({ length: 5 }, () =>
    Array.from({ length: 5 }, () => base)
  );

  const difX = Math.floor(Math.random() * 5);
  const difY = Math.floor(Math.random() * 5);
  matriz[difX][difY] = diferente;

  return { matriz, correcto: [difX, difY] };
};

const AtencionSimboloDiferente = ({ onFinish }: { onFinish?: (res: string) => void }) => {
  const [data, setData] = useState(() => generarMatriz());
  const [mensaje, setMensaje] = useState('');
  const [resuelto, setResuelto] = useState(false);
  const [startTime] = useState(Date.now());

  const handleClick = (i: number, j: number) => {
    if (resuelto) return;

    if (i === data.correcto[0] && j === data.correcto[1]) {
      const tiempo = ((Date.now() - startTime) / 1000).toFixed(2);
      setMensaje(`✅ ¡Correcto! Tiempo: ${tiempo} segundos`);
      setResuelto(true);
      if (onFinish) onFinish(`Correcto en ${tiempo} segundos`);
    } else {
      setMensaje('❌ Ese no es el símbolo diferente. Intenta de nuevo.');
    }
  };

  return (
    <div className="atencion-container">
      <h2>🎯 Atención - Test</h2>
      <p>Haz clic en el símbolo diferente</p>
      <div className="simbolo-grid">
        {data.matriz.map((fila, i) =>
          fila.map((simbolo, j) => (
            <button
              key={`${i}-${j}`}
              className="simbolo-btn"
              onClick={() => handleClick(i, j)}
              disabled={resuelto}
            >
              {simbolo}
            </button>
          ))
        )}
      </div>
      {mensaje && <p className="mensaje">{mensaje}</p>}
    </div>
  );
};

export default AtencionSimboloDiferente;
