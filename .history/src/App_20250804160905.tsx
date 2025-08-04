// src/App.tsx
import AppRouter from './router/AppRouter';
import NavegadorSugeridoModal from './components/NavegadorSugeridoModal';

function App() {
  return (
    <>
      <NavegadorSugeridoModal />
      <AppRouter />
    </>
  );
}

export default App;
