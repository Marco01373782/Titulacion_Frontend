    import { useEffect, useState } from 'react';
    import { fetchAllSessions, getResultadosActividadPorSesionYUsuario } from '../../../../services/ApiService';
    import { useNavigate } from 'react-router-dom';
    import './TestSessionSelector.css';

    const TestSessionSelector = () => {
    const [loading, setLoading] = useState(true);
    const [testSession, setTestSession] = useState<any | null>(null);
    const navigate = useNavigate();

    const userId = Number(localStorage.getItem('userId'));
    console.log("📦 UserID cargado:", userId);

    useEffect(() => {
  const loadTestSession = async () => {
    try {
      console.log("🚀 Cargando todas las sesiones...");
      const res = await fetchAllSessions();
      const allSessions = res.data;

      const testSessions = allSessions.filter((s: any) => s.difficulty === 'TEST');
      console.log("🎯 Sesiones de TEST encontradas:", testSessions);

      let algunaCompletada = false;

      for (let testSession of testSessions) {
        const resultRes = await getResultadosActividadPorSesionYUsuario(testSession.id, userId);
        const resultados = resultRes.data;

        console.log(`📊 Resultados para sesión TEST ID ${testSession.id}:`, resultados);

        if (resultados.length > 0) {
          algunaCompletada = true;
          break;
        }
      }

      if (algunaCompletada) {
        console.log("✅ El usuario ya completó al menos un test.");
        setTestSession(null);
      } else {
        console.log("🟠 El usuario NO ha completado ningún test.");
        const randomTest = testSessions[Math.floor(Math.random() * testSessions.length)];
        console.log("🎲 Sesión de Test seleccionada al azar:", randomTest);
        setTestSession(randomTest);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (userId) {
    loadTestSession();
  }
}, [userId]);


    const handleStartTest = () => {
        if (!testSession) return;

        console.log("👉 Iniciando test:", testSession);

        localStorage.setItem('selectedSession', JSON.stringify({ sesion: testSession }));
        navigate(`/user/terapias-sesiones/${testSession.id}`, {
        state: { session: { sesion: testSession } }
        });
    };

    if (loading) return <div>Cargando...</div>;

    if (!testSession) return null;

    return (
        <div className="test-session-selector">
        <h2>🧪 Diagnóstico Inicial</h2>
        <h3>{testSession.title}</h3>
        <p>{testSession.description}</p>
        <button onClick={handleStartTest}>Iniciar Test</button>
        </div>
    );
    };

    export default TestSessionSelector;
