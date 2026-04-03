import { apiClient } from "@/shared/lib/api/client";

export type DashboardExpenseByTag = {
  tagId: string;
  tagName: string;
  totalAmount: string;
};

export type DashboardSubTransaction = {
  id: string;
  description: string;
  amount: string;
  transactionId: string;
  transactionDescription: string;
  transactionType: "income" | "expense";
  competenceDate: string;
  tags: Array<{ id: string; name: string }>;
};

export type DashboardData = {
  month: string;
  remainingInMonth: string;
  installmentsTotalInMonth: string;
  expensesByTag: DashboardExpenseByTag[];
  subTransactions: DashboardSubTransaction[];
};

type DashboardParams = {
  month: string;
  tagId?: string;
};

export const dashboardApi = {
  async get(workspaceId: string, params: DashboardParams): Promise<DashboardData> {
    const response = await apiClient.get(`/workspaces/${workspaceId}/dashboard`, { params });
    return response.data;
  },
};
