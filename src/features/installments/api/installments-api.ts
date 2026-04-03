import { apiClient } from "@/shared/lib/api/client";

export type Installment = {
  id: string;
  workspaceId: string;
  createdByUserId: string;
  description: string;
  installmentCount: number;
  paidInstallments: number;
  installmentAmount: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateInstallmentPayload = {
  description: string;
  installmentCount: number;
  paidInstallments: number;
  installmentAmount: number;
};

export type UpdateInstallmentPayload = Partial<CreateInstallmentPayload>;

type ListInstallmentsParams = {
  month: string;
};

export const installmentsApi = {
  async list(workspaceId: string, params: ListInstallmentsParams): Promise<Installment[]> {
    const response = await apiClient.get(`/workspaces/${workspaceId}/installments`, { params });
    return response.data;
  },

  async create(workspaceId: string, payload: CreateInstallmentPayload): Promise<Installment> {
    const response = await apiClient.post(`/workspaces/${workspaceId}/installments`, payload);
    return response.data;
  },

  async update(
    workspaceId: string,
    installmentId: string,
    payload: UpdateInstallmentPayload
  ): Promise<Installment> {
    const response = await apiClient.patch(
      `/workspaces/${workspaceId}/installments/${installmentId}`,
      payload
    );
    return response.data;
  },

  async remove(workspaceId: string, installmentId: string): Promise<void> {
    await apiClient.delete(`/workspaces/${workspaceId}/installments/${installmentId}`);
  },
};
