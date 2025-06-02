import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: string[]; // Roles permitidos
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const storedRole = localStorage.getItem('userRole'); // Obtenemos el rol del usuario desde localStorage

  // Si no hay rol o el rol no está permitido, redirigimos al login
  if (!storedRole || !allowedRoles.includes(storedRole)) {
    return <Navigate to="/login" replace />;
  }

  return children; // Si el rol es permitido, mostramos el contenido
};

export default ProtectedRoute;
