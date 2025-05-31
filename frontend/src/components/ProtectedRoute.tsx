import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';

// Define the interface for the RoleProtectedRoute props
interface RoleProtectedRouteProps {
  allowedRoles: string[];
}

// ProtectedRoute for any authenticated user
export const ProtectedRoute: React.FC = () => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return user ? <Outlet /> : <Navigate to="/login" />;
};

// Role-specific protected routes
export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return <Outlet />;
};