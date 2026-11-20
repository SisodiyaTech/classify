import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';
import Button from '../components/common/Button';

export const RoleRoute = ({ children, allowedRoles = [] }) => {
  const { user, role, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(role)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 border border-amber-200">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-brand-900 mb-2">Access Restricted</h2>
        <p className="text-sm text-content-muted max-w-md mb-6">
          This area is designated for <strong className="text-brand-900">{allowedRoles.join(' or ')}</strong> accounts. Your current profile role is <strong className="text-brand-900 capitalize">{role}</strong>.
        </p>
        <p className="text-xs text-content-muted mb-4">
          Tip: You can use the Demo Role Switcher at the bottom-left to test this role.
        </p>
        <Button onClick={() => window.history.back()} variant="outline" size="sm">
          Go Back
        </Button>
      </div>
    );
  }

  return children;
};

export default RoleRoute;
