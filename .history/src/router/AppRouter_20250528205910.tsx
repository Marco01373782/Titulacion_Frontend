import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';

// Rutas públicas
import Login from '../pages/GENERALS/login/login';
import Home from '../pages/GENERALS/home/Home';
import Register from '../pages/GENERALS/register/register';

// Admin pages
import ActivityList from '../pages/ADMIN/actividades/list/ActivityList';
import ActivityEdit from '../pages/ADMIN/actividades/edit/ActivityEdit';
import CreateActivity from '../pages/ADMIN/actividades/create/CreateActivity';
import SessionList from '../pages/ADMIN/sesions/list/SesionList';
import SesionCreate from '../pages/ADMIN/sesions/create/SesionCreate';
import SesionEdit from '../pages/ADMIN/sesions/edit/SesionEdit';

// User pages
import Dashboard from '../pages/USER/dashboard/Dashboard';
import Prueba from '../pages/GENERALS/prueba/Prueba';
import PatientIntro from '../pages/USER/patient/PatientIntro';
import RegisterPatient from '../pages/USER/patient/patientRegister';
import SessionGrid from '../pages/USER/sesiones/SesionGrid';
import SesionRunner from '../pages/USER/sesiones/SesionRunner';
// Actividades
import MemoriaTest from '../actividades/memoria/MemoriaTest';
// Aquí puedes seguir agregando más actividades...

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas para ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="gestionar-actividades" element={<ActivityList />} />
          <Route path="editar-actividad/:id" element={<ActivityEdit />} />
          <Route path="crear-actividad" element={<CreateActivity />} />
          <Route path="gestionar-sesiones" element={<SessionList />} />
          <Route path="crear-sesiones" element={<SesionCreate />} />
          <Route path="editar-sesiones/:id" element={<SesionEdit />} />
          
        </Route>

        {/* Rutas protegidas para USER */}
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="prueba" element={<Prueba />} />
          <Route path="patient-intro" element={<PatientIntro />} />
          <Route path="patient-register" element={<RegisterPatient />} />
          <Route path="Sesiones" element={<SessionGrid />} />
          <Route path="terapias-sesiones/" element={<SesionRunner />} />
        </Route>

        {/* Rutas de actividades protegidas para ambos */}
        <Route
          path="/actividades"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="memoria-test" element={<MemoriaTest />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
