import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner message="Verifying credentials..." />
    </div>
  );

  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />;

  return children;
}
