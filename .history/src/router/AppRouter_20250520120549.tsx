import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/GENERALS/login/login';
import Home from '../pages/GENERALS/home/Home';
import Register from '../pages/GENERALS/register/register';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/USER/dashboard/Dashboard';
import Prueba from '../pages/GENERALS/prueba/Prueba';
import PatientIntro from '../pages/USER/patient/PatientIntro';
import RegisterPatient from '../pages/USER/patient/patientRegister';
import ActivityList from '../pages/ADMIN/actividades/list/ActivityList';
import ActivityEdit from '../pages/ADMIN/actividades/edit/ActivityEdit';
import CreateActivity from '../pages/ADMIN/actividades/create/CreateActivity';

/*rutas para las actividades*/
import MemoriaTest from '../actividades/memoria/MemoriaTest';
/*rutas para las actividades*/




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

          {/*rutas para las actividades creadas*/}
          <Route path="memoria-test" element={
            
            <ProtectedRoute allowedRoles={['user']}>
                <ActivityList />
              </ProtectedRoute>
            
        
          } />
          
          {/* Ruta protegida para admin */}
          <Route
            path="gestionar-actividades"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ActivityList />
              </ProtectedRoute>
            }
          />
          <Route
            path="editar-actividad/:id"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
              <ActivityEdit />
              </ProtectedRoute>
            }
          />
            <Route
            path="crear-actividad"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
              <CreateActivity />
              </ProtectedRoute>
            }
          />


          {/* Ruta protegida para user */}
          <Route
            path="user-dashboard"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
