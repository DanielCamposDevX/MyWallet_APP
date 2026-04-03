import { useActiveWorkspace } from "@/features/workspaces/hooks/use-active-workspace";
import { Navigate, Outlet } from "react-router-dom";

export default function RequireWorkspace() {
  const { workspace, loading } = useActiveWorkspace();

  if (loading) {
    return <p className="mt-6 text-sm text-muted-foreground">Carregando workspace...</p>;
  }

  if (!workspace) {
    return <Navigate to="/workspaces" replace />;
  }

  return <Outlet />;
}
