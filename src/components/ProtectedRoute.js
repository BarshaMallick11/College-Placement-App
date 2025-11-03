import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../index';
import { observer } from 'mobx-react';

// This component will protect routes based on user role
const ProtectedRoute = observer(({ children, role }) => {
  const { isAuthenticated, userRole } = useStore();

  if (!isAuthenticated) {
    // If not logged in, redirect to login
    return <Navigate to="/login" />;
  }

  if (role && userRole !== role) {
    // If logged in but wrong role, redirect to appropriate dashboard
    const homePath = userRole === 'admin' ? '/admin' : '/student';
    return <Navigate to={homePath} />;
  }

  return children;
});

export default ProtectedRoute;