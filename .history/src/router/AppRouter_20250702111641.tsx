  import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

  // Layout
  import MainLayout from '../layouts/MainLayout';
  import ProtectedRoute from './ProtectedRoute';

  // Rutas públicas
  import Login from '../pages/GENERALS/login/login';
  import Home from '../pages/GENERALS/home/Home';
  import Register from '../pages/GENERALS/register/register';
  import SplashScreen from '../pages/GENERALS/SplashScreen';

  // Admin 
  import ActivityList from '../pages/ADMIN/actividades/list/ActivityList';
  import ActivityEdit from '../pages/ADMIN/actividades/edit/ActivityEdit';
  import CreateActivity from '../pages/ADMIN/actividades/create/CreateActivity';
  import SessionList from '../pages/ADMIN/sesions/list/SesionList';
  import SesionCreate from '../pages/ADMIN/sesions/create/SesionCreate';
  import SesionEdit from '../pages/ADMIN/sesions/edit/SesionEdit';
  import UsersList from '../pages/ADMIN/user/list/userlist';
  import CreateUserForm from '../pages/ADMIN/user/create/CreateUserForm';

  // User 
  import Dashboard from '../pages/USER/dashboard/Dashboardindividual';
  import DashboardGrupal from '../pages/USER/dashboard/DashboardGrupal';
  import SesionRunner from '../pages/USER/sesiones/Individual/SesionRunner';
  import SesionRouter from '../pages/USER/sesiones/SesionRouter';
  import GroupSesionRunner from '../pages/USER/sesiones/Grupal/GroupSesionRunner';
  import Estadisticas from '../pages/USER/Estadisticas/Estadisticas';
  import PatientView from '../pages/USER/patient/PatientView';
  import PacienteFlow from '../components/context/PacienteFlow';
  import PatientEdit from '../pages/USER/patient/patientEdit';

  // Actividades
  // Memoria
  import MemoriaIntermedio from '../actividades/TEST/memoria/MemoriaIntermedio';
  import MemoriaPrincipiante from '../actividades/PRINCIPIANTE/memoria/MemoriaPrincipiante';
  import MemoriaAvanzada from '../actividades/AVANZADO/memoria/MemoriaAvanzado';

  // Razonamiento
  import RazonamientoIntermedio from '../actividades/TEST/razonamiento/RazonamientoIntermedio';
  import RazonamientoPrincipiante from '../actividades/PRINCIPIANTE/razonamiento/RazonamientoPrincipiante';
  import RazonamientoAvanzado from '../actividades/AVANZADO/razonamiento/RazonamientoAvanzado';

  // Atención y concentración
  import AtencionIntermedio from '../actividades/TEST/atencion y concentracion/AtencionIntermedio';
  import AtencionPrincipiante from '../actividades/PRINCIPIANTE/atencion y concentracion/AtencionPrincipiante';
  import AtencionAvanzado from '../actividades/AVANZADO/atencion y concentracion/AtencionAvanzado';

  const AppRouter = () => {
    return (
      <Router>
        <Routes>
          {/* Ruta inicial modificada */}
          <Route path="/" element={<SplashScreen />} />
          <Route path="/home" element={<Home />} />
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
            <Route path="gestionar-usuarios" element={<UsersList />} />
            <Route path="crear-usuarios" element={<CreateUserForm />} />
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
            <Route path="patient-flow" element={<PacienteFlow />} />
            <Route path="patient-view" element={<PatientView />} />
            <Route path="patient-edit" element={<PatientEdit />} />
            <Route path="Sesiones" element={<SesionRouter />} />
            <Route path="terapias-sesiones/:id" element={<SesionRunner />} />
            <Route path="Sesionesgrupales/:sesionId" element={<GroupSesionRunner />} />
            <Route path="estadisticas" element={<Estadisticas />} />
          </Route>

          {/* Actividades protegidas */}
          <Route
            path="/actividades"
            element={
              <ProtectedRoute allowedRoles={['user', 'admin']}>
                <MainLayout />
              </ProtectedRoute>
            }
          >
                                                                                                {/*Memoria */}
            <Route path="memoria-intermedio" element={<MemoriaIntermedio />} />
            <Route path="memoria-principiante" element={<MemoriaPrincipiante />} />
            <Route path="memoria-avanzada" element={<MemoriaAvanzada />} />
                                                                                                {/*Razonamiento logico*/}
            <Route path="razonamiento-principiante" element={<RazonamientoPrincipiante />} />
            <Route path="razonamiento-intermedio" element={<RazonamientoIntermedio />} />
            <Route path="razonamiento-avanzado" element={<RazonamientoAvanzado />} />
                                                                                                {/*Atencion y concentracion */}
            <Route path="atencion-test" element={<At />} />
            <Route path="atencion-principiante" element={<AtencionPrincipiante />} />
            <Route path="atencion-avanzado" element={<AtencionAvanzado />} />
          </Route>
        </Routes>
      </Router>
    );
  };

  export default AppRouter;
