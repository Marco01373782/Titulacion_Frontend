import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const storedRole = localStorage.getItem('userRole'); // Usamos localStorage para obtener el rol del usuario

  // Si no hay rol o el rol no está permitido, redirigimos a login
  if (!storedRole || !allowedRoles.includes(storedRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
