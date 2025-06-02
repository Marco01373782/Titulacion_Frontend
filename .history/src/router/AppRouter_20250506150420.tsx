import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/login/login';
import Home from '../pages/home/Home';
import Register from '../pages/register/register';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/USER/dashboard/Dashboard';
import Prueba from '../pages/prueba/Prueba'; // IMPORTAMOS LA NUEVA PÁGINA

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas privadas */}
        <Route path="/app" element={<MainLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="prueba" element={<Prueba />} /> {/* RUTA DE PRUEBA */}
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
