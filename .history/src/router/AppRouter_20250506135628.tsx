import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/login/login';
import Home from '../pages/home/Home'; // si tienes esta página
import Register from '../pages/register/register';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/dashboard/Dashboard';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        {/* Rutas privadas */}
        <Route path="/app" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          {/* Agrega más rutas protegidas aquí */}
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
