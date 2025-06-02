// AppRouter.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/GENERALS/login/login';
import Home from '../pages/GENERALS/home/Home';
import Register from '../pages/GENERALS/register/register';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/USER/dashboard/Dashboard';
import Prueba from '../pages/GENERALS/prueba/Prueba';
import PatientIntro from '../pages/USER/patient/PatientIntro';
import RegisterPatient from '../pages/USER/patient/patientRegister';
import Activities from '../pages/ADMIN/actividades/gestionActivities';
import ProtectedRoute from './ProtectedRoute'; // Importamos el componente ProtectedRoute

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas dentro de la app */}
        <Route path="/app" element={<MainLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="prueba" element={<Prueba />} />
          <Route path="patient-intro" element={<PatientIntro />} />
          <Route path="patient-register" element={<RegisterPatient />} />

          {/* Ruta protegida para administradores */}
          <Route
            path="gestionar-actividades"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
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
