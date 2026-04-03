import {
  clearActiveWorkspaceId,
  getActiveWorkspaceId,
  setActiveWorkspaceId as setStoredActiveWorkspaceId,
} from "@/features/workspaces/store/active-workspace-store";
import {
  CreateWorkspacePayload,
  Workspace,
  WorkspaceFrequency,
  WorkspaceMode,
  workspacesApi,
} from "@/features/workspaces/api/workspaces-api";
import { Button } from "@/shared/components/ui/button";
import Input from "@/shared/components/ui/input";
import { formatDate } from "@/shared/lib/utils/date";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type WorkspaceForm = {
  name: string;
  mode: WorkspaceMode;
  frequency: WorkspaceFrequency;
};

const INITIAL_FORM: WorkspaceForm = {
  name: "",
  mode: "private",
  frequency: "monthly",
};

const MODE_LABELS: Record<WorkspaceMode, string> = {
  private: "Privado",
  link: "Compartilhável por link",
};

const FREQUENCY_LABELS: Record<WorkspaceFrequency, string> = {
  daily: "Diária",
  weekly: "Semanal",
  monthly: "Mensal",
};

export default function WorkspacesPage() {
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(getActiveWorkspaceId());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null);
  const [form, setForm] = useState<WorkspaceForm>(INITIAL_FORM);

  const sortedWorkspaces = useMemo(() => {
    return [...workspaces].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [workspaces]);

  const loadWorkspaces = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await workspacesApi.list();
      setWorkspaces(data);

      const selectedWorkspaceId = getActiveWorkspaceId();
      const hasSelectedWorkspace =
        !!selectedWorkspaceId && data.some((workspace) => workspace.id === selectedWorkspaceId);

      if (hasSelectedWorkspace) {
        setActiveWorkspaceId(selectedWorkspaceId);
      } else {
        clearActiveWorkspaceId();
        setActiveWorkspaceId(null);
      }
    } catch {
      setError("Não foi possível carregar os workspaces.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorkspaces();
  }, [loadWorkspaces]);

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setEditingWorkspace(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: CreateWorkspacePayload = {
      name: form.name.trim(),
      mode: form.mode,
      frequency: form.frequency,
    };

    if (!payload.name) {
      setError("Informe o nome da workspace.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      if (editingWorkspace) {
        await workspacesApi.update(editingWorkspace.id, payload);
      } else {
        await workspacesApi.create(payload);
      }

      resetForm();
      await loadWorkspaces();
    } catch {
      setError(
        editingWorkspace
          ? "Não foi possível atualizar a workspace."
          : "Não foi possível criar a workspace."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (workspace: Workspace) => {
    setEditingWorkspace(workspace);
    setForm({
      name: workspace.name,
      mode: workspace.mode,
      frequency: workspace.frequency,
    });
  };

  const handleDelete = async (workspace: Workspace) => {
    const shouldDelete = window.confirm(
      `Tem certeza que deseja excluir a workspace "${workspace.name}"?`
    );

    if (!shouldDelete) return;

    setError(null);

    try {
      await workspacesApi.remove(workspace.id);

      if (activeWorkspaceId === workspace.id) {
        clearActiveWorkspaceId();
        setActiveWorkspaceId(null);
      }

      if (editingWorkspace?.id === workspace.id) {
        resetForm();
      }

      await loadWorkspaces();
    } catch {
      setError("Não foi possível excluir a workspace.");
    }
  };

  const handleSelectWorkspace = (workspace: Workspace) => {
    setStoredActiveWorkspaceId(workspace.id);
    setActiveWorkspaceId(workspace.id);
    navigate("/home");
  };

  return (
    <section className="w-full max-w-6xl px-4 py-8 md:py-10">
      <div className="rounded-3xl border border-border/70 bg-card/70 p-6 shadow-sm md:p-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Módulo</p>
          <h1 className="text-3xl font-semibold">Workspaces</h1>
          <p className="text-sm text-muted-foreground">
            Crie, edite e selecione sua workspace ativa antes de criar transações ou parcelamentos.
          </p>
        </div>

        <form
          className="mt-6 grid gap-3 rounded-2xl border border-border bg-background p-4 md:grid-cols-2"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-1 md:col-span-2">
            <label htmlFor="workspaceName" className="text-sm font-medium">
              Nome
            </label>
            <Input
              id="workspaceName"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Ex.: Finanças pessoais"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="workspaceMode" className="text-sm font-medium">
              Modo
            </label>
            <select
              id="workspaceMode"
              value={form.mode}
              onChange={(event) =>
                setForm((current) => ({ ...current, mode: event.target.value as WorkspaceMode }))
              }
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
            >
              <option value="private">Privado</option>
              <option value="link">Compartilhável por link</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="workspaceFrequency" className="text-sm font-medium">
              Frequência padrão
            </label>
            <select
              id="workspaceFrequency"
              value={form.frequency}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  frequency: event.target.value as WorkspaceFrequency,
                }))
              }
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
            >
              <option value="daily">Diária</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensal</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:col-span-2">
            <Button type="submit" disabled={submitting}>
              {submitting
                ? "Salvando..."
                : editingWorkspace
                  ? "Atualizar workspace"
                  : "Criar workspace"}
            </Button>

            {editingWorkspace ? (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancelar edição
              </Button>
            ) : null}
          </div>
        </form>

        {loading ? <p className="mt-6 text-sm text-muted-foreground">Carregando dados...</p> : null}

        {error ? (
          <p className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        {!loading && !sortedWorkspaces.length ? (
          <p className="mt-6 rounded-lg border border-border bg-background p-4 text-sm text-muted-foreground">
            Nenhuma workspace cadastrada ainda.
          </p>
        ) : null}

        {sortedWorkspaces.length ? (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[720px] border-collapse">
              <thead className="bg-muted/60">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Nome
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Modo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Frequência
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Criado em
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedWorkspaces.map((workspace) => {
                  const isActive = activeWorkspaceId === workspace.id;

                  return (
                    <tr key={workspace.id} className="border-t border-border">
                      <td className="px-4 py-3 text-sm">{workspace.name}</td>
                      <td className="px-4 py-3 text-sm">{MODE_LABELS[workspace.mode]}</td>
                      <td className="px-4 py-3 text-sm">{FREQUENCY_LABELS[workspace.frequency]}</td>
                      <td className="px-4 py-3 text-sm">{formatDate(workspace.createdAt)}</td>
                      <td className="px-4 py-3 text-sm">
                        {isActive ? (
                          <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                            Ativa
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Inativa</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-2">
                          <Button
                            type="button"
                            variant={isActive ? "secondary" : "outline"}
                            size="sm"
                            onClick={() => handleSelectWorkspace(workspace)}
                            disabled={isActive}
                          >
                            {isActive ? "Selecionada" : "Selecionar"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(workspace)}
                          >
                            Editar
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(workspace)}
                          >
                            Excluir
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </section>
  );
}
