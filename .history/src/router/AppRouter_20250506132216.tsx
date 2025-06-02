import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/login/login';
import Register from '../pages/register/register';
import Home from '../pages/home/Home';
import MainLayout from '../layouts/MainLayout';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas dentro del layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          {/* Aquí puedes añadir más rutas protegidas */}
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
