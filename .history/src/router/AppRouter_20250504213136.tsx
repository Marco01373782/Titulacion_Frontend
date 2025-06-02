import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/login/login';
import Hom // si tienes esta página

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        {/* Agrega más rutas según tu app */}
      </Routes>
    </Router>
  );
};

export default AppRouter;
