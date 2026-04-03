import { apiClient } from "@/shared/lib/api/client";

export type Tag = {
  id: string;
  workspaceId: string;
  name: string;
  createdAt: string;
};

export type CreateTagPayload = {
  name: string;
};

export const tagsApi = {
  async list(workspaceId: string): Promise<Tag[]> {
    const response = await apiClient.get(`/workspaces/${workspaceId}/tags`);
    return response.data;
  },

  async create(workspaceId: string, payload: CreateTagPayload): Promise<Tag> {
    const response = await apiClient.post(`/workspaces/${workspaceId}/tags`, payload);
    return response.data;
  },

  async update(workspaceId: string, tagId: string, payload: CreateTagPayload): Promise<Tag> {
    const response = await apiClient.patch(`/workspaces/${workspaceId}/tags/${tagId}`, payload);
    return response.data;
  },

  async remove(workspaceId: string, tagId: string): Promise<void> {
    await apiClient.delete(`/workspaces/${workspaceId}/tags/${tagId}`);
  },
};
