    import { useState } from 'react';
    import './RazonamientoTest.css';

    const ejercicios = [
    { secuencia: [2, 4, 6, 8, '?'], respuesta: 10 },
    { secuencia: [5, 10, 20, '?'], respuesta: 40 },
    { secuencia: [1, 4, 9, 16, '?'], respuesta: 25 },
    { secuencia: [2, 3, 5, 7, 11, '?'], respuesta: 13 },
    { secuencia: [21, 18, 15, '?'], respuesta: 12 },
    ];

    const Razonamiento = ({ onFinish }: { onFinish?: (result: number) => void }) => {
    const [indice] = useState(0);
    const [respuesta, setRespuesta] = useState('');
    const [resultado, setResultado] = useState<string | null>(null);

    const ejercicio = ejercicios[indice];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const esCorrecta = parseInt(respuesta) === ejercicio.respuesta;
        const mensaje = esCorrecta
        ? '¡Correcto! Buen trabajo.'
        : `Incorrecto. La respuesta era ${ejercicio.respuesta}.`;

        setResultado(mensaje);

        // ✅ Enviamos número como score
        if (onFinish) onFinish(esCorrecta ? 99 : 0);
    };

    return (
        <div className="razonamiento-test">
        <h2>🔍 Razonamiento - Nivel Test</h2>
        <p>Completa la secuencia lógica con el número que falta:</p>
        <div className="secuencia">
            {ejercicio.secuencia.map((n, i) => (
            <span key={i} className="elemento">
                {n === '?' ? '?' : n}
                {i < ejercicio.secuencia.length - 1 ? ', ' : ''}
            </span>
            ))}
        </div>

        {resultado ? (
            <div className="resultado">
            <p>{resultado}</p>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="formulario">
            <input
                type="number"
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
                placeholder="¿Cuál es el siguiente número?"
                required
                className="input-respuesta"
            />
            <button type="submit" className="boton">Enviar</button>
            </form>
        )}
        </div>
    );
    };

    export default RazonamientoTest;
