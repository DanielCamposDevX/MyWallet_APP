import { Installment, installmentsApi } from "@/features/installments/api/installments-api";
import { useActiveWorkspace } from "@/features/workspaces/hooks/use-active-workspace";
import { Button } from "@/shared/components/ui/button";
import Input from "@/shared/components/ui/input";
import { formatCurrency } from "@/shared/lib/utils/currency";
import { formatDate } from "@/shared/lib/utils/date";
import { getCurrentMonth } from "@/shared/lib/utils/month";
import { Plus } from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type CreateInstallmentForm = {
  description: string;
  installmentCount: string;
  paidInstallments: string;
  installmentAmount: string;
};

const INITIAL_FORM: CreateInstallmentForm = {
  description: "",
  installmentCount: "1",
  paidInstallments: "0",
  installmentAmount: "",
};

export default function InstallmentsPage() {
  const { workspace, loading: workspaceLoading, error: workspaceError } = useActiveWorkspace();
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<CreateInstallmentForm>(INITIAL_FORM);

  const sortedInstallments = useMemo(() => {
    return [...installments].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [installments]);

  const loadInstallments = useCallback(async () => {
    if (!workspace?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await installmentsApi.list(workspace.id, { month: selectedMonth });
      setInstallments(data);
    } catch {
      setError("Não foi possível carregar os parcelamentos.");
    } finally {
      setLoading(false);
    }
  }, [workspace?.id, selectedMonth]);

  useEffect(() => {
    loadInstallments();
  }, [loadInstallments]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!workspace?.id) return;

    const installmentCount = Number(form.installmentCount);
    const paidInstallments = Number(form.paidInstallments);
    const installmentAmount = Number(form.installmentAmount);

    if (
      !form.description.trim() ||
      Number.isNaN(installmentCount) ||
      Number.isNaN(paidInstallments) ||
      Number.isNaN(installmentAmount) ||
      installmentCount < 1 ||
      paidInstallments < 0 ||
      paidInstallments > installmentCount ||
      installmentAmount <= 0
    ) {
      setError("Preencha os campos corretamente antes de criar o parcelamento.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await installmentsApi.create(workspace.id, {
        description: form.description.trim(),
        installmentCount,
        paidInstallments,
        installmentAmount,
      });

      setForm(INITIAL_FORM);
      setShowForm(false);
      await loadInstallments();
    } catch {
      setError("Não foi possível criar o parcelamento.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="w-full max-w-6xl px-4 py-8 md:py-10">
      <div className="rounded-3xl border border-border/70 bg-card/70 p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Módulo</p>
            <h1 className="text-3xl font-semibold">Parcelamentos</h1>
            <p className="text-sm text-muted-foreground">
              Parcelamentos filtrados por mês com valor por parcela.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Input
              type="month"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
              className="w-[180px]"
            />
            <Button type="button" onClick={() => setShowForm((current) => !current)}>
              <Plus className="size-4" />
              {showForm ? "Cancelar" : "Adicionar parcelamento"}
            </Button>
          </div>
        </div>

        {showForm ? (
          <form
            className="mt-6 grid gap-3 rounded-2xl border border-border bg-background p-4"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="description" className="text-sm font-medium">
                Descrição
              </label>
              <Input
                id="description"
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({ ...current, description: event.target.value }))
                }
                placeholder="Ex.: Notebook"
                required
              />
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="installmentCount" className="text-sm font-medium">
                  Total de parcelas
                </label>
                <Input
                  id="installmentCount"
                  type="number"
                  min="1"
                  value={form.installmentCount}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, installmentCount: event.target.value }))
                  }
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="paidInstallments" className="text-sm font-medium">
                  Parcelas pagas
                </label>
                <Input
                  id="paidInstallments"
                  type="number"
                  min="0"
                  value={form.paidInstallments}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, paidInstallments: event.target.value }))
                  }
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="installmentAmount" className="text-sm font-medium">
                  Valor por parcela
                </label>
                <Input
                  id="installmentAmount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.installmentAmount}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, installmentAmount: event.target.value }))
                  }
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={submitting || !workspace?.id}>
              {submitting ? "Salvando..." : "Salvar parcelamento"}
            </Button>
          </form>
        ) : null}

        {workspaceLoading || loading ? (
          <p className="mt-6 text-sm text-muted-foreground">Carregando dados...</p>
        ) : null}

        {workspaceError || error ? (
          <p className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {workspaceError ?? error}
          </p>
        ) : null}

        {!loading && !workspaceLoading && workspace && !sortedInstallments.length ? (
          <p className="mt-6 rounded-lg border border-border bg-background p-4 text-sm text-muted-foreground">
            Nenhum parcelamento cadastrado no mês selecionado.
          </p>
        ) : null}

        {sortedInstallments.length ? (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[760px] border-collapse">
              <thead className="bg-muted/60">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Descrição
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Progresso
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Valor por parcela
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Total previsto
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Criado em
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedInstallments.map((installment) => (
                  <tr key={installment.id} className="border-t border-border">
                    <td className="px-4 py-3 text-sm">{installment.description}</td>
                    <td className="px-4 py-3 text-sm">
                      {installment.paidInstallments}/{installment.installmentCount}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {formatCurrency(Number(installment.installmentAmount))}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {formatCurrency(
                        Number(installment.installmentAmount) * installment.installmentCount
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">{formatDate(installment.createdAt)}</td>
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
