import { useState } from 'react';
import Header from '../components/NeuroXUI/NeuroXHeader';
import Sidebar from '../components/NeuroXUI/NeuroXSidebar';
import { Outlet } from 'react-router-dom';
import './MainLayout.css';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  // Toggle sidebar en móvil
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
    // Si estás en fullscreen, también cerramos el sidebar para que no haya conflictos
    if (!fullscreen) setSidebarOpen(false);
  };

  return (
    <div className={`main-layout ${fullscreen ? 'fullscreen' : ''}`}>
      {/* Header solo si no está en fullscreen */}
      {!fullscreen && <Header onToggleSidebar={toggleSidebar} />}

      <div className={`layout-body ${sidebarOpen ? 'sidebar-open' : ''} ${fullscreen ? 'fullscreen-body' : ''}`}>
        {/* Sidebar solo si no está fullscreen */}
        {!fullscreen && <Sidebar onClose={() => setSidebarOpen(false)} isOpen={sidebarOpen} />}

        <main className="layout-content" onClick={() => sidebarOpen && setSidebarOpen(false)}>
          {/* Botón para toggle fullscreen en la esquina */}
          <button className="btn-fullscreen-toggle" onClick={toggleFullscreen}>
            {fullscreen ? '🗗 Minimizar' : '🗖 Pantalla Completa'}
          </button>

          {/* Aquí carga la ruta */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
