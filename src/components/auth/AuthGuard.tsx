
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: 'bank' | 'company' | 'vendor';
}

const AuthGuard = ({ children, requireAuth = true, requiredRole }: AuthGuardProps) => {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) return;

    // If authentication is required but user is not logged in
    if (requireAuth && !user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    // If specific role is required but user doesn't have it
    if (requiredRole && profile?.role !== requiredRole) {
      // Redirect to appropriate dashboard based on user's actual role
      if (profile?.role) {
        switch (profile.role) {
          case 'bank':
            navigate('/bank-dashboard');
            break;
          case 'company':
            navigate('/company-dashboard');
            break;
          case 'vendor':
            navigate('/vendor-dashboard');
            break;
          default:
            navigate('/login');
        }
      } else {
        // If no profile is loaded yet, wait a bit for it to load
        if (user) {
          setTimeout(() => {
            // Fallback navigation based on email for demo accounts
            const email = user.email || '';
            if (email.includes('bank@')) {
              navigate('/bank-dashboard');
            } else if (email.includes('finance@')) {
              navigate('/company-dashboard');
            } else if (email.includes('vendor@')) {
              navigate('/vendor-dashboard');
            } else {
              navigate('/login');
            }
          }, 1000);
        } else {
          navigate('/login');
        }
      }
      return;
    }
  }, [user, profile, isLoading, navigate, location, requireAuth, requiredRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
