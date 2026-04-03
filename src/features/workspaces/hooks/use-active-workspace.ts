import { useCallback, useEffect, useState } from "react";
import { Workspace, workspacesApi } from "../api/workspaces-api";
import { clearActiveWorkspaceId, getActiveWorkspaceId } from "../store/active-workspace-store";

type UseActiveWorkspaceResult = {
  workspace: Workspace | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
};

export function useActiveWorkspace(): UseActiveWorkspaceResult {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const workspaces = await workspacesApi.list();

      if (!workspaces.length) {
        clearActiveWorkspaceId();
        setWorkspace(null);
        setError("Nenhum workspace encontrado. Crie um workspace primeiro.");
        return;
      }

      const activeWorkspaceId = getActiveWorkspaceId();

      if (!activeWorkspaceId) {
        setWorkspace(null);
        setError("Selecione uma workspace antes de criar transações ou parcelamentos.");
        return;
      }

      const activeWorkspace = workspaces.find((item) => item.id === activeWorkspaceId);

      if (!activeWorkspace) {
        clearActiveWorkspaceId();
        setWorkspace(null);
        setError("A workspace selecionada não existe mais. Selecione outra em Workspaces.");
        return;
      }

      setWorkspace(activeWorkspace);
    } catch {
      setWorkspace(null);
      setError("Não foi possível carregar os workspaces.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    workspace,
    loading,
    error,
    reload: load,
  };
}
