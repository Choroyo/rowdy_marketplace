// src/components/ProtectedRoute.tsx
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "../ui/Loading";

interface ProtectedRouteProps {
  children: ReactNode;
  requireVerification?: boolean;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children,
  requireVerification = true,
  requireAdmin = false
}) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();
  
  // Show loading while checking auth
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Loading />
        <p className="text-white mt-4">Verifying your authentication...</p>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    console.log("No user found, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Email verification check removed as we're using custom auth
  
  // Check admin access if required
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  // All checks passed, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;