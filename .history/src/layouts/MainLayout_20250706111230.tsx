import { useState } from 'react';
import Header from '../components/NeuroXUI/NeuroXHeader';
import Sidebar from '../components/NeuroXUI/NeuroXSidebar';
import { Outlet } from 'react-router-dom';
import './MainLayout.css';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
    if (!fullscreen) setSidebarOpen(false); // cerrar sidebar al entrar en fullscreen
  };

  return (
    <div className={`main-layout ${fullscreen ? 'fullscreen' : ''}`}>
      {/* Header solo visible si no está fullscreen */}
      {!fullscreen && <Header onToggleSidebar={toggleSidebar} />}

      <div className={`layout-body ${sidebarOpen ? 'sidebar-open' : ''} ${fullscreen ? 'fullscreen-body' : ''}`}>
        {/* Sidebar solo visible si no está fullscreen */}
        {!fullscreen && <Sidebar onClose={() => setSidebarOpen(false)} isOpen={sidebarOpen} />}

        <main className="layout-content" onClick={() => sidebarOpen && setSidebarOpen(false)}>
          {/* Botón para activar/desactivar fullscreen */}
          <button className="btn-fullscreen-toggle" onClick={toggleFullscreen}>
            {fullscreen ? '🗗 Minimizar' : '🗖 Pantalla Completa'}
          </button>

          {/* Aquí cargan las rutas hijas */}
          <Outlet />

          {/* Texto de prueba para asegurarnos que el contenido se vea */}
          <div style={{ color: 'black', marginTop: '1rem', fontWeight: 'bold' }}>
            Contenido cargado correctamente ✔️
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
