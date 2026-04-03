import { tagsApi, Tag } from "@/features/tags/api/tags-api";
import { useActiveWorkspace } from "@/features/workspaces/hooks/use-active-workspace";
import { Button } from "@/shared/components/ui/button";
import Input from "@/shared/components/ui/input";
import { formatDate } from "@/shared/lib/utils/date";
import { FormEvent, useCallback, useEffect, useState } from "react";

export default function TagsPage() {
  const { workspace, loading: workspaceLoading, error: workspaceError } = useActiveWorkspace();
  const [tags, setTags] = useState<Tag[]>([]);
  const [name, setName] = useState("");
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTags = useCallback(async () => {
    if (!workspace?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await tagsApi.list(workspace.id);
      setTags(data);
    } catch {
      setError("Não foi possível carregar as tags.");
    } finally {
      setLoading(false);
    }
  }, [workspace?.id]);

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  const resetForm = () => {
    setName("");
    setEditingTag(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!workspace?.id || !name.trim()) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      if (editingTag) {
        await tagsApi.update(workspace.id, editingTag.id, { name: name.trim() });
      } else {
        await tagsApi.create(workspace.id, { name: name.trim() });
      }

      resetForm();
      await loadTags();
    } catch {
      setError("Não foi possível salvar a tag.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (tag: Tag) => {
    if (!workspace?.id) return;

    const shouldDelete = window.confirm(`Deseja excluir a tag \"${tag.name}\"?`);

    if (!shouldDelete) return;

    setError(null);

    try {
      await tagsApi.remove(workspace.id, tag.id);
      if (editingTag?.id === tag.id) {
        resetForm();
      }
      await loadTags();
    } catch {
      setError("Não foi possível excluir a tag.");
    }
  };

  return (
    <section className="w-full max-w-6xl px-4 py-8 md:py-10">
      <div className="rounded-3xl border border-border/70 bg-card/70 p-6 shadow-sm md:p-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Módulo</p>
          <h1 className="text-3xl font-semibold">Tags</h1>
          <p className="text-sm text-muted-foreground">
            Organize transações por categoria para melhorar filtros e análises.
          </p>
        </div>

        <form className="mt-6 flex flex-col gap-3 rounded-2xl border border-border bg-background p-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="tagName" className="text-sm font-medium">
              Nome da tag
            </label>
            <Input
              id="tagName"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex.: Mercado"
              required
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={submitting || !workspace?.id}>
              {submitting ? "Salvando..." : editingTag ? "Atualizar tag" : "Criar tag"}
            </Button>
            {editingTag ? (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancelar edição
              </Button>
            ) : null}
          </div>
        </form>

        {workspaceLoading || loading ? (
          <p className="mt-6 text-sm text-muted-foreground">Carregando dados...</p>
        ) : null}

        {workspaceError || error ? (
          <p className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {workspaceError ?? error}
          </p>
        ) : null}

        {!workspaceLoading && !loading && !tags.length ? (
          <p className="mt-6 rounded-lg border border-border bg-background p-4 text-sm text-muted-foreground">
            Nenhuma tag cadastrada ainda.
          </p>
        ) : null}

        {tags.length ? (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[560px] border-collapse">
              <thead className="bg-muted/60">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Nome
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Criado em
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {tags.map((tag) => (
                  <tr key={tag.id} className="border-t border-border">
                    <td className="px-4 py-3 text-sm">{tag.name}</td>
                    <td className="px-4 py-3 text-sm">{formatDate(tag.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-2">
                        <Button type="button" size="sm" variant="outline" onClick={() => {
                          setEditingTag(tag);
                          setName(tag.name);
                        }}>
                          Editar
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(tag)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </section>
  );
}
