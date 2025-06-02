import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/login/login';
import Home from '../pages/home/Home'; // si tienes esta página
import Register from '../pages/register/register';
Import

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
         {/* Rutas protegidas con layout */}
         <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Agrega más rutas internas aquí */}
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
