    import { useEffect, useState } from 'react';
    import { fetchAllSessions, getResultadosActividadPorSesionYUsuario } from '../../../../services/ApiService';
    import SessionGrid from './SesionGrid';

    const SesionesConTest = () => {
    const [loading, setLoading] = useState(true);
    const [showTest, setShowTest] = useState(false);
    const [testSession, setTestSession] = useState<any | null>(null);
    const userId = Number(localStorage.getItem('userId'));

    useEffect(() => {
        const loadTest = async () => {
        try {
            const res = await fetchAllSessions();
            const testSessions = res.data.filter((s: any) => s.difficulty === 'TEST');

            if (testSessions.length === 0) {
            console.warn("No hay tests configurados");
            setLoading(false);
            setShowTest(false);
            return;
            }

            const randomTest = testSessions[Math.floor(Math.random() * testSessions.length)];

            const resultRes = await getResultadosActividadPorSesionYUsuario(randomTest.id, userId);
            const resultados = resultRes.data;

            if (resultados.length > 0) {
            setShowTest(false); // Ya hizo el test
            } else {
            setTestSession(randomTest);
            setShowTest(true); // Falta hacer el test
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
        };

        if (userId) {
        loadTest();
        } else {
        console.error("No hay userId");
        setLoading(false);
        }
    }, [userId]);

    const handleStartTest = () => {
        if (!testSession) return;

        localStorage.setItem('selectedSession', JSON.stringify({ sesion: testSession }));
        window.location.href = `/user/terapias-sesiones/${testSession.id}`;
    };

    if (loading) return <div>Cargando...</div>;

    if (showTest) {
        return (
        <div className="test-session-selector">
            <h2>🧪 Diagnóstico Inicial</h2>
            <h3>{testSession.title}</h3>
            <p>{testSession.description}</p>
            <button onClick={handleStartTest}>Iniciar Test</button>
        </div>
        );
    }

    // Si ya hizo el test → mostramos el SessionGrid normal
    return <SessionGrid />;
    };

    export default SesionesConTest;
