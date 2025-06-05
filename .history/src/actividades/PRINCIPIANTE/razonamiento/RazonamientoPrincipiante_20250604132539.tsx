    import { useEffect, useState } from 'react';
    import './RazonamientoAritmetica.css';

    type Pregunta = {
    enunciado: string;
    respuesta: number;
    };

    const generarPregunta = (): Pregunta => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const operacion = ['+', '-', '*'][Math.floor(Math.random() * 3)];
    let respuesta = 0;

    switch (operacion) {
        case '+':
        respuesta = a + b;
        break;
        case '-':
        respuesta = a - b;
        break;
        case '*':
        respuesta = a * b;
        break;
    }

    return {
        enunciado: `${a} ${operacion} ${b}`,
        respuesta,
    };
    };

    const RazonamientoPrincipiante = ({ onFinish }: { onFinish?: (result: string) => void }) => {
    const [pregunta, setPregunta] = useState<Pregunta>(generarPregunta());
    const [respuesta, setRespuesta] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [tiempo, setTiempo] = useState(10); // 10 segundos por pregunta
    const [correctas, setCorrectas] = useState(0);
    const [intentos, setIntentos] = useState(0);
    const [finalizado, setFinalizado] = useState(false);

    useEffect(() => {
        if (tiempo <= 0) {
        validarRespuesta(); // autoenviar si se agota el tiempo
        }
        const timer = setTimeout(() => setTiempo(tiempo - 1), 1000);
        return () => clearTimeout(timer);
    }, [tiempo]);

    const validarRespuesta = () => {
        const esCorrecta = parseInt(respuesta) === pregunta.respuesta;
        if (esCorrecta) {
        setCorrectas((prev) => prev + 1);
        setMensaje('✅ ¡Correcto!');
        } else {
        setMensaje(`❌ Incorrecto. Era ${pregunta.respuesta}`);
        }

        const nuevoIntento = intentos + 1;
        setIntentos(nuevoIntento);

        if (nuevoIntento >= 5) {
        setFinalizado(true);
        if (onFinish) {
            onFinish(`Aciertos: ${correctas + (esCorrecta ? 1 : 0)} / 5`);
        }
        } else {
        setTimeout(() => {
            setPregunta(generarPregunta());
            setRespuesta('');
            setMensaje('');
            setTiempo(10);
            setIntentos(nuevoIntento);
        }, 1000);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        validarRespuesta();
    };

    return (
        <div className="aritmetica-container">
        <h2>🔍 Razonamiento - Principiante</h2>
        <p>Resuelve rápidamente la operación antes que el tiempo se acabe:</p>

        {!finalizado && (
            <>
            <div className="pregunta">{pregunta.enunciado}</div>
            <div className="tiempo">⏳ Tiempo restante: {tiempo}s</div>

            <form onSubmit={handleSubmit} className="formulario">
                <input
                type="number"
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
                className="input"
                placeholder="Respuesta"
                required
                />
                <button type="submit" className="boton">Enviar</button>
            </form>
            </>
        )}

        {mensaje && <p className="mensaje">{mensaje}</p>}

        {finalizado && (
            <div className="resultado-final">
            <p>✅ Completado: {correctas} de 5 correctas</p>
            </div>
        )}
        </div>
    );
    };

    export default RazonamientoPrincipiante;
