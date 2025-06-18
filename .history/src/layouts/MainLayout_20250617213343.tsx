import { useState } from 'react';
import Header from '../components/NeuroXUI/NeuroXHeader'
import Sidebar from '../components'
import { Outlet } from 'react-router-dom';
import './MainLayout.css';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Función para toggle sidebar en móvil
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="main-layout">
      <Header onToggleSidebar={toggleSidebar} />
      <div className={`layout-body ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Sidebar onClose={() => setSidebarOpen(false)} isOpen={sidebarOpen} />
        <main className="layout-content" onClick={() => sidebarOpen && setSidebarOpen(false)}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
