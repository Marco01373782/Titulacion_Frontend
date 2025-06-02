import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Dashboard from '../pages/USER/dashboard/Dashboard';
import Profil

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/app/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin', 'user']}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/profile"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Profile />
          </ProtectedRoute>
        }
      />
      {/* Puedes añadir más rutas protegidas aquí */}
    </Routes>
  );
};

export default AppRouter;
