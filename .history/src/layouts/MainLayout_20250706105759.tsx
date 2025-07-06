import { useState } from 'react';
import Header from '../components/NeuroXUI/NeuroXHeader';
import Sidebar from '../components/NeuroXUI/NeuroXSidebar';
import { Outlet } from 'react-router-dom';
import './MainLayout.css';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Toggle sidebar para móvil
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Toggle pantalla completa
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`main-layout ${isFullscreen ? 'fullscreen' : ''}`}>
      {!isFullscreen && <Header onToggleSidebar={toggleSidebar} />}
      <div className={`layout-body ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {!isFullscreen && <Sidebar onClose={() => setSidebarOpen(false)} isOpen={sidebarOpen} />}
        <main
          className="layout-content"
          onClick={() => sidebarOpen && setSidebarOpen(false)}
        >
          <button
            className="fullscreen-toggle-btn"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          >
            {isFullscreen ? '✕' : '⤢'}
          </button>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
