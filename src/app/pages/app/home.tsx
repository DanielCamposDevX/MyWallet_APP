import { dashboardApi, DashboardData } from "@/features/dashboard/api/dashboard-api";
import { tagsApi, Tag } from "@/features/tags/api/tags-api";
import { useActiveWorkspace } from "@/features/workspaces/hooks/use-active-workspace";
import { Button } from "@/shared/components/ui/button";
import Input from "@/shared/components/ui/input";
import { formatCurrency } from "@/shared/lib/utils/currency";
import { formatDate } from "@/shared/lib/utils/date";
import { getCurrentMonth } from "@/shared/lib/utils/month";
import { ArrowDownUp, Tags, WalletCards } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const { workspace, loading: workspaceLoading, error: workspaceError } = useActiveWorkspace();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedTagId, setSelectedTagId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    if (!workspace?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [dashboardData, tagsData] = await Promise.all([
        dashboardApi.get(workspace.id, {
          month: selectedMonth,
          tagId: selectedTagId || undefined,
        }),
        tagsApi.list(workspace.id),
      ]);

      setDashboard(dashboardData);
      setTags(tagsData);
    } catch {
      setError("Não foi possível carregar o dashboard.");
    } finally {
      setLoading(false);
    }
  }, [workspace?.id, selectedMonth, selectedTagId]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const expensesTotal = useMemo(() => {
    if (!dashboard) return 0;
    return dashboard.expensesByTag.reduce((total, item) => total + Number(item.totalAmount), 0);
  }, [dashboard]);

  return (
    <section className="w-full max-w-6xl px-4 py-8 md:py-10">
      <div className="rounded-3xl border border-border/70 bg-card/70 p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Dashboard</p>
            <h1 className="text-3xl font-semibold">Visão do mês</h1>
            <p className="text-sm text-muted-foreground">
              Saldo, parcelas previstas, gastos por tag e sub-transações do mês.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Input
              type="month"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
              className="w-[180px]"
            />
            <select
              value={selectedTagId}
              onChange={(event) => setSelectedTagId(event.target.value)}
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
            >
              <option value="">Todas as tags</option>
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {workspaceLoading || loading ? (
          <p className="mt-6 text-sm text-muted-foreground">Carregando dados...</p>
        ) : null}

        {workspaceError || error ? (
          <p className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {workspaceError ?? error}
          </p>
        ) : null}

        {dashboard ? (
          <>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-border bg-background p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ArrowDownUp className="size-4" />
                  <span className="text-sm">Sobrando no mês</span>
                </div>
                <p className="mt-2 text-2xl font-semibold">
                  {formatCurrency(Number(dashboard.remainingInMonth))}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-background p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <WalletCards className="size-4" />
                  <span className="text-sm">Parcelas no mês</span>
                </div>
                <p className="mt-2 text-2xl font-semibold">
                  {formatCurrency(Number(dashboard.installmentsTotalInMonth))}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-background p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Tags className="size-4" />
                  <span className="text-sm">Gastos por tags</span>
                </div>
                <p className="mt-2 text-2xl font-semibold">{formatCurrency(expensesTotal)}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-border bg-background p-4">
                <h2 className="text-lg font-semibold">Gastos por tag</h2>
                {!dashboard.expensesByTag.length ? (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Sem despesas categorizadas no mês.
                  </p>
                ) : (
                  <div className="mt-3 space-y-2">
                    {dashboard.expensesByTag.map((item) => (
                      <div
                        key={item.tagId}
                        className="flex items-center justify-between rounded-lg border border-border p-2"
                      >
                        <span className="text-sm">{item.tagName}</span>
                        <strong className="text-sm">{formatCurrency(Number(item.totalAmount))}</strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-border bg-background p-4">
                <h2 className="text-lg font-semibold">Ações rápidas</h2>
                <div className="mt-3 grid gap-2">
                  <Button type="button" variant="outline" onClick={() => navigate("/transactions")}>
                    Ir para Transações
                  </Button>
                  <Button type="button" variant="outline" onClick={() => navigate("/installments")}>
                    Ir para Parcelamentos
                  </Button>
                  <Button type="button" variant="outline" onClick={() => navigate("/tags")}>
                    Gerenciar Tags
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-background p-4">
              <h2 className="text-lg font-semibold">Sub-transações</h2>

              {!dashboard.subTransactions.length ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  Nenhuma sub-transação encontrada no filtro atual.
                </p>
              ) : (
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full min-w-[720px] border-collapse">
                    <thead className="bg-muted/60">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Sub-transação
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Transação
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Tipo
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Valor
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Competência
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboard.subTransactions.map((subTransaction) => (
                        <tr key={subTransaction.id} className="border-t border-border">
                          <td className="px-3 py-2 text-sm">{subTransaction.description}</td>
                          <td className="px-3 py-2 text-sm">{subTransaction.transactionDescription}</td>
                          <td className="px-3 py-2 text-sm">
                            {subTransaction.transactionType === "income" ? "Receita" : "Despesa"}
                          </td>
                          <td className="px-3 py-2 text-sm">{formatCurrency(Number(subTransaction.amount))}</td>
                          <td className="px-3 py-2 text-sm">{formatDate(subTransaction.competenceDate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
