import { useState } from 'react';
import Header from '../components/header/Header';
import Sidebar from '../components/sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import './MainLayout.css';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="main-layout">
      <Header toggleSidebar={toggleSidebar} />
      <div className={`layout-body ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Sidebar toggleSidebar={toggleSidebar} />
        <main className="layout-content" onClick={() => sidebarOpen && setSidebarOpen(false)}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
