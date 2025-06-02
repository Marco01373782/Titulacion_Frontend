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
        <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        {/* Rutas privadas */}
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
