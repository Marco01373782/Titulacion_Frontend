import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/login/login';
import Home from '../pages/home/Home'; // si tienes esta página

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Agrega más rutas según tu app */}
      </Routes>
    </Router>
  );
};

export default AppRouter;
