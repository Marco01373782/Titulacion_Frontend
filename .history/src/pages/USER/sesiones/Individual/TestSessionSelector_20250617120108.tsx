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
        console.log("✅ Todas las sesiones:", allSessions);

        const testSessions = allSessions.filter((s: any) => s.difficulty === 'TEST');
        console.log("🎯 Sesiones de TEST encontradas:", testSessions);

        if (testSessions.length === 0) {
          console.warn("⚠️ No hay sesiones de Test configuradas");
          setLoading(false);
          return;
        }

        const randomTest = testSessions[Math.floor(Math.random() * testSessions.length)];
        console.log("🎲 Sesión de Test seleccionada al azar:", randomTest);

        const resultRes = await getResultadosActividadPorSesionYUsuario(randomTest.id, userId);
        const resultados = resultRes.data;
        console.log("📊 Resultados existentes de este Test:", resultados);

        if (resultados.length > 0) {
          console.log("✅ El usuario ya hizo este test. No se mostrará nuevamente.");
          setTestSession(null);
        } else {
          console.log("🟠 El usuario aún NO ha hecho este test.");
          setTestSession(randomTest);
        }
      } catch (err) {
        console.error("❌ Error al cargar test:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadTestSession();
    } else {
      console.error("❌ No se encontró userId en localStorage.");
      setLoading(false);
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
