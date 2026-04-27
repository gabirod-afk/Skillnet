import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function RoleProtectedRoute({ children, allowedRoles }: RoleProtectedRouteProps) {
  const { user, userData, loading } = useAuth();

  // 1. Si está cargando, mostramos pantalla vacía para no generar saltos visuales
  if (loading) return null; 

  // 2. Si no hay usuario en Firebase Auth, lo mandamos a loguearse
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Si ya cargó, pero su rol NO coincide con los permitidos, lo mandamos al marketplace
  if (userData && !allowedRoles.includes(userData.role)) {
    return <Navigate to="/marketplace" replace />;
  }

  // 4. Si todo está en orden, le mostramos la página de creación de cursos
  return <>{children}</>;
}