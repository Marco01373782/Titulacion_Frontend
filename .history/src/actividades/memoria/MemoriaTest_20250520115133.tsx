    import { useState, useEffect } from 'react';

    const palabras = ['gato', 'árbol', 'sol', 'libro', 'cielo'];

    const MemoriaTest = () => {
    const [mostrarPalabras, setMostrarPalabras] = useState(true);
    const [input, setInput] = useState('');
    const [resultado, setResultado] = useState<string | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
        setMostrarPalabras(false);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const respuestas = input.toLowerCase().split(',').map(p => p.trim());
        const correctas = palabras.filter(p => respuestas.includes(p));
        setResultado(`Recordaste ${correctas.length} de ${palabras.length} palabras`);
    };

    return (
        <div className="memoria-test p-4">
        <h2 className="text-xl font-bold mb-4">Actividad de Memoria - Test</h2>

        {mostrarPalabras ? (
            <div>
            <p>Recuerda estas palabras:</p>
            <ul className="list-disc pl-5">
                {palabras.map((palabra, i) => <li key={i}>{palabra}</li>)}
            </ul>
            </div>
        ) : (
            <form onSubmit={handleSubmit}>
            <p>Escribe las palabras que recuerdas, separadas por comas:</p>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="border p-2 w-full mt-2"
            />
            <button type="submit" className="btn-submit mt-3">Enviar</button>
            </form>
        )}

        {resultado && (
            <div className="mt-4 bg-green-100 p-3 rounded">{resultado}</div>
        )}
        </div>
    );
    };

    export default MemoriaTest;
