import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/home/Home';
import Login from '../pages/login/login';
import Register from '../pages/register/register';
import Dashboard from '../pages/dashboard/Dashboard'; // La página principal dentro de la app
import MainLayout from '../layouts/MainLayout';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas (Home, Login, Register) sin el MainLayout */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas privadas con el layout y el menú lateral */}
        <Route path="/dashboard" element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        } />
      </Routes>
    </Router>
  );
};

export default AppRouter;
