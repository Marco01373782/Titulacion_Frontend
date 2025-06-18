import { useEffect, useState } from 'react';
import { fetchAllSessions, getResultadosActividadPorSesionYUsuario } from '../../../../services/ApiService';
import { useNavigate } from 'react-router-dom';
import './TestSessionSelector.css';

const TestSessionSelector = () => {
  const [loading, setLoading] = useState(true);
  const [testSession, setTestSession] = useState<any | null>(null);
  const navigate = useNavigate();

  const userId = Number(localStorage.getItem('userId'));

  useEffect(() => {
    const loadTestSession = async () => {
      try {
        const res = await fetchAllSessions();
        const allSessions = res.data;

        // Filtramos solo las de dificultad TEST
        const testSessions = allSessions.filter((s: any) => s.difficulty === 'TEST');

        if (testSessions.length === 0) {
          console.warn("No hay sesiones de Test configuradas");
          setLoading(false);
          return;
        }

        // Tomamos una al azar
        const randomTest = testSessions[Math.floor(Math.random() * testSessions.length)];

        // Verificamos si el usuario ya tiene resultados
        const resultRes = await getResultadosActividadPorSesionYUsuario(randomTest.id, userId);
        const resultados = resultRes.data;

        if (resultados.length > 0) {
          // Ya hizo el test
          setTestSession(null);
        } else {
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

    localStorage.setItem('selectedSession', JSON.stringify({ sesion: testSession }));
    navigate(`/user/terapias-sesiones/${testSession.id}`, {
      state: { session: { sesion: testSession } }
    });
  };

  if (loading) return <div>Cargando...</div>;

  if (!testSession) return null; // Si ya hizo el test, no mostramos nada

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
