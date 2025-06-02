import { Outlet } from "react-router-dom";
import Header from "../components/header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import "./MainLayout.css";

export default function MainLayout() {
  return (
    <div className="layout-container">
      <Header />
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
