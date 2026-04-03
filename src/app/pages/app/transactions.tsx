import { Transaction, transactionsApi, TransactionType } from "@/features/transactions/api/transactions-api";
import { tagsApi, Tag } from "@/features/tags/api/tags-api";
import { useActiveWorkspace } from "@/features/workspaces/hooks/use-active-workspace";
import { Button } from "@/shared/components/ui/button";
import Input from "@/shared/components/ui/input";
import { formatCurrency } from "@/shared/lib/utils/currency";
import { formatDate } from "@/shared/lib/utils/date";
import { getCurrentMonth } from "@/shared/lib/utils/month";
import { Plus, Trash2 } from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type SubTransactionForm = {
  description: string;
  amount: string;
};

type CreateTransactionForm = {
  mode: "simple" | "advanced";
  type: TransactionType;
  description: string;
  amount: string;
  competenceDate: string;
  recurrenceMonths: string;
  tagIds: string[];
  subTransactions: SubTransactionForm[];
};

const EMPTY_SUB_TRANSACTION: SubTransactionForm = {
  description: "",
  amount: "",
};

const INITIAL_FORM: CreateTransactionForm = {
  mode: "simple",
  type: "expense",
  description: "",
  amount: "",
  competenceDate: new Date().toISOString().slice(0, 10),
  recurrenceMonths: "1",
  tagIds: [],
  subTransactions: [{ ...EMPTY_SUB_TRANSACTION }],
};

export default function TransactionsPage() {
  const { workspace, loading: workspaceLoading, error: workspaceError } = useActiveWorkspace();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<CreateTransactionForm>(INITIAL_FORM);

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort(
      (a, b) => new Date(b.competenceDate).getTime() - new Date(a.competenceDate).getTime()
    );
  }, [transactions]);

  const loadTransactions = useCallback(async () => {
    if (!workspace?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [transactionsData, tagsData] = await Promise.all([
        transactionsApi.list(workspace.id, selectedMonth),
        tagsApi.list(workspace.id),
      ]);
      setTransactions(transactionsData);
      setTags(tagsData);
    } catch {
      setError("Não foi possível carregar as transações.");
    } finally {
      setLoading(false);
    }
  }, [workspace?.id, selectedMonth]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleToggleForm = () => {
    setShowForm((current) => !current);
  };

  const handleToggleTag = (tagId: string) => {
    setForm((current) => {
      const hasTag = current.tagIds.includes(tagId);
      return {
        ...current,
        tagIds: hasTag ? current.tagIds.filter((id) => id !== tagId) : [...current.tagIds, tagId],
      };
    });
  };

  const updateSubTransaction = (index: number, patch: Partial<SubTransactionForm>) => {
    setForm((current) => ({
      ...current,
      subTransactions: current.subTransactions.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      ),
    }));
  };

  const addSubTransaction = () => {
    setForm((current) => ({
      ...current,
      subTransactions: [...current.subTransactions, { ...EMPTY_SUB_TRANSACTION }],
    }));
  };

  const removeSubTransaction = (index: number) => {
    setForm((current) => {
      if (current.subTransactions.length === 1) {
        return current;
      }

      return {
        ...current,
        subTransactions: current.subTransactions.filter((_, itemIndex) => itemIndex !== index),
      };
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!workspace?.id) return;

    if (!form.description.trim()) {
      setError("Preencha a descrição antes de salvar.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      if (form.mode === "simple") {
        const amount = Number(form.amount);
        const recurrenceMonths = Number(form.recurrenceMonths);

        if (Number.isNaN(amount) || amount <= 0 || recurrenceMonths < 1) {
          setError("Preencha os campos do lançamento simples corretamente.");
          setSubmitting(false);
          return;
        }

        await transactionsApi.createSimple(workspace.id, {
          type: form.type,
          description: form.description.trim(),
          amount,
          competenceDate: form.competenceDate,
          recurrenceMonths,
          tagIds: form.tagIds,
        });
      } else {
        const parsedSubTransactions = form.subTransactions
          .map((subTransaction) => ({
            description: subTransaction.description.trim(),
            amount: Number(subTransaction.amount),
          }))
          .filter((subTransaction) => subTransaction.description && subTransaction.amount > 0);

        if (!parsedSubTransactions.length) {
          setError("Informe ao menos uma sub-transação válida.");
          setSubmitting(false);
          return;
        }

        await transactionsApi.createAdvanced(workspace.id, {
          type: form.type,
          description: form.description.trim(),
          competenceDate: form.competenceDate,
          subTransactions: parsedSubTransactions,
          tagIds: form.tagIds,
        });
      }

      setForm(INITIAL_FORM);
      setShowForm(false);
      await loadTransactions();
    } catch {
      setError("Não foi possível criar a transação.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (transaction: Transaction) => {
    if (!workspace?.id) return;

    const shouldDelete = window.confirm(`Deseja excluir a transação \"${transaction.description}\"?`);

    if (!shouldDelete) return;

    setError(null);

    try {
      await transactionsApi.remove(workspace.id, transaction.id);
      await loadTransactions();
    } catch {
      setError("Não foi possível excluir a transação.");
    }
  };

  const getTransactionTotal = (transaction: Transaction) => {
    if (transaction.format === "simple") {
      return Number(transaction.amount);
    }

    return transaction.subTransactions.reduce(
      (total, subTransaction) => total + Number(subTransaction.amount),
      0
    );
  };

  const advancedTotal = form.subTransactions.reduce((total, subTransaction) => {
    const amount = Number(subTransaction.amount);
    return Number.isNaN(amount) ? total : total + amount;
  }, 0);

  return (
    <section className="w-full max-w-6xl px-4 py-8 md:py-10">
      <div className="rounded-3xl border border-border/70 bg-card/70 p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Módulo</p>
            <h1 className="text-3xl font-semibold">Transações</h1>
            <p className="text-sm text-muted-foreground">Filtro mensal ativo no backend.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Input
              type="month"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
              className="w-[180px]"
            />
            <Button type="button" onClick={handleToggleForm}>
              <Plus className="size-4" />
              {showForm ? "Cancelar" : "Adicionar transação"}
            </Button>
          </div>
        </div>

        {showForm ? (
          <form
            className="mt-6 grid gap-3 rounded-2xl border border-border bg-background p-4"
            onSubmit={handleSubmit}
          >
            <div className="grid gap-3 md:grid-cols-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="mode" className="text-sm font-medium">
                  Formato
                </label>
                <select
                  id="mode"
                  value={form.mode}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      mode: event.target.value as "simple" | "advanced",
                    }))
                  }
                  className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
                >
                  <option value="simple">Simples</option>
                  <option value="advanced">Avançada</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="type" className="text-sm font-medium">
                  Tipo
                </label>
                <select
                  id="type"
                  value={form.type}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      type: event.target.value as TransactionType,
                    }))
                  }
                  className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
                >
                  <option value="expense">Despesa</option>
                  <option value="income">Receita</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="competenceDate" className="text-sm font-medium">
                  Data de competência
                </label>
                <Input
                  id="competenceDate"
                  type="date"
                  value={form.competenceDate}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, competenceDate: event.target.value }))
                  }
                  required
                />
              </div>
            </div>

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
                placeholder="Ex.: Conta de luz"
                required
              />
            </div>

            {form.mode === "simple" ? (
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label htmlFor="amount" className="text-sm font-medium">
                    Valor
                  </label>
                  <Input
                    id="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.amount}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, amount: event.target.value }))
                    }
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="recurrenceMonths" className="text-sm font-medium">
                    Meses de recorrência
                  </label>
                  <Input
                    id="recurrenceMonths"
                    type="number"
                    min="1"
                    max="120"
                    value={form.recurrenceMonths}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, recurrenceMonths: event.target.value }))
                    }
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium">Sub-transações</p>
                  <Button type="button" variant="outline" size="sm" onClick={addSubTransaction}>
                    <Plus className="size-4" />
                    Adicionar linha
                  </Button>
                </div>

                <div className="space-y-2">
                  {form.subTransactions.map((subTransaction, index) => (
                    <div key={index} className="grid gap-2 md:grid-cols-[1fr_140px_auto]">
                      <Input
                        value={subTransaction.description}
                        onChange={(event) =>
                          updateSubTransaction(index, { description: event.target.value })
                        }
                        placeholder="Descrição da sub-transação"
                      />
                      <Input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={subTransaction.amount}
                        onChange={(event) => updateSubTransaction(index, { amount: event.target.value })}
                        placeholder="Valor"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeSubTransaction(index)}
                        disabled={form.subTransactions.length === 1}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <p className="mt-3 text-sm text-muted-foreground">
                  Total da transação avançada: <strong>{formatCurrency(advancedTotal)}</strong>
                </p>
              </div>
            )}

            <div className="rounded-xl border border-border p-4">
              <p className="mb-2 text-sm font-medium">Tags</p>
              {!tags.length ? (
                <p className="text-sm text-muted-foreground">Nenhuma tag criada ainda.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => {
                    const checked = form.tagIds.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleToggleTag(tag.id)}
                        className={`rounded-full border px-3 py-1 text-sm transition ${
                          checked
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background"
                        }`}
                      >
                        {tag.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <Button type="submit" disabled={submitting || !workspace?.id}>
              {submitting ? "Salvando..." : "Salvar transação"}
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

        {!loading && !workspaceLoading && workspace && !sortedTransactions.length ? (
          <p className="mt-6 rounded-lg border border-border bg-background p-4 text-sm text-muted-foreground">
            Nenhuma transação cadastrada no mês selecionado.
          </p>
        ) : null}

        {sortedTransactions.length ? (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[860px] border-collapse">
              <thead className="bg-muted/60">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Descrição
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Formato
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Valor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Competência
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Tags
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-t border-border">
                    <td className="px-4 py-3 text-sm">
                      <p>{transaction.description}</p>
                      {transaction.format === "advanced" && transaction.subTransactions.length ? (
                        <p className="text-xs text-muted-foreground">
                          {transaction.subTransactions.length} sub-transação(ões)
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {transaction.type === "income" ? "Receita" : "Despesa"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {transaction.format === "simple" ? "Simples" : "Avançada"}
                    </td>
                    <td className="px-4 py-3 text-sm">{formatCurrency(getTransactionTotal(transaction))}</td>
                    <td className="px-4 py-3 text-sm">{formatDate(transaction.competenceDate)}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex flex-wrap gap-1">
                        {transaction.tags.length ? (
                          transaction.tags.map((tag) => (
                            <span key={tag.id} className="rounded-full border border-border px-2 py-0.5 text-xs">
                              {tag.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">Sem tags</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button type="button" variant="destructive" size="sm" onClick={() => handleDelete(transaction)}>
                        Excluir
                      </Button>
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
