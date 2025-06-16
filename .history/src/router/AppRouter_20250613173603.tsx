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
import Dashboard from '../pages/USER/dashboard/Dashboardindividual';
import DashboardGrupal from '../pages/USER/dashboard/DashboardGrupal';
import PatientIntro from '../pages/USER/patient/PatientIntro';
import RegisterPatient from '../pages/USER/patient/patientRegister';
import SesionRunner from '../pages/USER/sesiones/Individual/SesionRunner';
import SesionRouter from '../pages/USER/sesiones/SesionRouter';
import GroupSesionRunner from '../pages/USER/sesiones/Grupal/GroupSesionRunner';
imp

// Actividades
//Memoria
import MemoriaTest from '../actividades/TEST/memoria/MemoriaTest';
import MemoriaPrincipiante from '../actividades/PRINCIPIANTE/memoria/MemoriaPrincipiante';
import MemoriaAvanzada from '../actividades/AVANZADO/memoria/MemoriaAvanzado';

//Razonamiento
import RazonamientoTest from '../actividades/TEST/razonamiento/RazonamientoTest';
import RazonamientoPrincipiante from '../actividades/PRINCIPIANTE/razonamiento/RazonamientoPrincipiante';
import RazonamientoAvanzado from '../actividades/AVANZADO/razonamiento/RazonamientoAvanzado';

//Atencion y concentracion
import AtencionTest from '../actividades/TEST/atencion y concentracion/AtencionTest';
import AtencionPrincipiante from '../actividades/PRINCIPIANTE/atencion y concentracion/AtencionPrincipiante';
import AtencionAvanzado from '../actividades/AVANZADO/atencion y concentracion/AtencionAvanzado';

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
          <Route path="dashboard-grupal" element={<DashboardGrupal />} />
          <Route path="patient-intro" element={<PatientIntro />} />
          <Route path="patient-register" element={<RegisterPatient />} />
          <Route path="Sesiones" element={<SesionRouter />} />
          <Route path="terapias-sesiones/:id" element={<SesionRunner />} />
          <Route path="terapias-sesiones/:id" element={<SesionRunner />} />
          <Route path="Sesionesgrupales/:sesionId" element={<GroupSesionRunner/>} />


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
          {/* Memoria*/}
          <Route path="memoria-test" element={<MemoriaTest />} />
          <Route path="memoria-principiante" element={<MemoriaPrincipiante />} />
          <Route path="memoria-avanzada" element={<MemoriaAvanzada />} />

          {/*Razonamineto*/}
          <Route path="razonamiento-test" element={<RazonamientoTest />} />
          <Route path="razonamiento-principiante" element={<RazonamientoPrincipiante />} />
          <Route path="razonamiento-avanzado" element={<RazonamientoAvanzado />} />

          {/*Atencion y Concentracion*/}
          <Route path="atencion-test" element={<AtencionTest />} />
          <Route path="atencion-principiante" element={<AtencionPrincipiante />} />
          <Route path="atencion-avanzado" element={<AtencionAvanzado />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
