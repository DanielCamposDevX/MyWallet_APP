import { apiClient } from "@/shared/lib/api/client";

export type TransactionType = "income" | "expense";

export type TransactionTag = {
  id: string;
  workspaceId: string;
  name: string;
};

export type SubTransaction = {
  id: string;
  description: string;
  amount: string;
  transactionId: string;
  createdAt: string;
};

export type Transaction = {
  id: string;
  workspaceId: string;
  createdByUserId: string;
  type: TransactionType;
  format: "simple" | "advanced";
  description: string;
  amount: string;
  competenceDate: string;
  recurringGroupId: string | null;
  createdAt: string;
  updatedAt: string;
  tags: TransactionTag[];
  subTransactions: SubTransaction[];
};

export type CreateSimpleTransactionPayload = {
  type: TransactionType;
  description: string;
  amount: number;
  competenceDate: string;
  recurrenceMonths: number;
  tagIds?: string[];
};

export type CreateAdvancedTransactionPayload = {
  type: TransactionType;
  description: string;
  competenceDate: string;
  subTransactions: Array<{
    description: string;
    amount: number;
  }>;
  tagIds?: string[];
};

export type UpdateTransactionPayload = {
  type?: TransactionType;
  description?: string;
  amount?: number;
  competenceDate?: string;
  tagIds?: string[];
  subTransactions?: Array<{
    description: string;
    amount: number;
  }>;
};

export const transactionsApi = {
  async list(workspaceId: string, month: string): Promise<Transaction[]> {
    const response = await apiClient.get(`/workspaces/${workspaceId}/transactions`, {
      params: { month },
    });
    return response.data;
  },

  async createSimple(
    workspaceId: string,
    payload: CreateSimpleTransactionPayload
  ): Promise<Transaction[] | Transaction> {
    const response = await apiClient.post(
      `/workspaces/${workspaceId}/transactions/simple`,
      payload
    );

    return response.data;
  },

  async createAdvanced(
    workspaceId: string,
    payload: CreateAdvancedTransactionPayload
  ): Promise<Transaction> {
    const response = await apiClient.post(
      `/workspaces/${workspaceId}/transactions/advanced`,
      payload
    );

    return response.data;
  },

  async update(
    workspaceId: string,
    transactionId: string,
    payload: UpdateTransactionPayload
  ): Promise<Transaction> {
    const response = await apiClient.patch(
      `/workspaces/${workspaceId}/transactions/${transactionId}`,
      payload
    );
    return response.data;
  },

  async remove(workspaceId: string, transactionId: string): Promise<void> {
    await apiClient.delete(`/workspaces/${workspaceId}/transactions/${transactionId}`);
  },
};
