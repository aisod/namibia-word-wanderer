import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface AdminGuardProps {
  children: React.ReactNode;
}

/**
 * Protects admin routes. Redirects to login if not authenticated,
 * or shows access denied if user lacks canManageLanguages permission.
 */
export function AdminGuard({ children }: AdminGuardProps) {
  const navigate = useNavigate();
  const { loading, isAuthenticated, canManageLanguages } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      navigate("/admin/login", { replace: true });
      return;
    }
    if (!canManageLanguages) {
      navigate("/admin/access-denied", { replace: true });
    }
  }, [loading, isAuthenticated, canManageLanguages, navigate]);

  if (loading || !isAuthenticated || !canManageLanguages) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
