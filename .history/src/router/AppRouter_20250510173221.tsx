import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/GENERALS/login/login';
import Home from '../pages/GENERALS/home/Home';
import Register from '../pages/GENERALS/register/register';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/USER/dashboard/Dashboard';
import Activities from '../pages/ADMIN/actividades/gestionActivities';
import ProtectedRoute from './ProtectedRoute'; // Importamos ProtectedRoute

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas antes de entrar a la app */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas dentro de la app */}
        <Route path="/app" element={<MainLayout />}>
          {/* Rutas protegidas */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin', 'user']}> {/* Admin y User pueden ver esta ruta */}
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="gestion-activities"
            element={
              <ProtectedRoute allowedRoles={['admin']}> {/* Solo admin puede ver esta ruta */}
                <Activities />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
