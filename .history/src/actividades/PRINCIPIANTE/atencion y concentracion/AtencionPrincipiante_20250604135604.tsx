    import React, { useEffect, useState } from 'react';
    import './AtencionSecuenciaLuz.css';

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
        if (onFinish) onFinish('Incorrecto');
        return;
        }

        if (nuevoUsuario.length === secuencia.length) {
        setResultado('✅ Correcto');
        if (onFinish) onFinish('Correcto');
        }
    };

    return (
        <div className="secuencia-container">
        <h2>🎯 Atención - Principiante</h2>
        <p>Observa y repite la secuencia de colores</p>
        <div className="botones-luz">
            {colores.map((color, i) => {
            const iluminado = mostrarIndice > i
                && secuencia[i] === i
                && mostrarIndice <= secuencia.length;
            const activo = !jugando && iluminado;

            return (
                <button
                key={i}
                className={`luz-boton ${color} ${activo ? 'activo' : ''}`}
                onClick={() => handleClick(i)}
                disabled={!jugando || resultado !== ''}
                />
            );
            })}
        </div>
        {resultado && <p className="mensaje">{resultado}</p>}
        </div>
    );
    };

    export default AtencionSecuenciaLuz;
