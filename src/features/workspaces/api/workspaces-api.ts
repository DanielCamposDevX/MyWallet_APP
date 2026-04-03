import { apiClient } from "@/shared/lib/api/client";

export type Workspace = {
  id: string;
  name: string;
  mode: "private" | "link";
  frequency: "daily" | "weekly" | "monthly";
  ownerId: string;
  shareToken: string | null;
  createdAt: string;
};

export type WorkspaceMode = Workspace["mode"];
export type WorkspaceFrequency = Workspace["frequency"];

export type CreateWorkspacePayload = {
  name: string;
  mode: WorkspaceMode;
  frequency: WorkspaceFrequency;
};

export type UpdateWorkspacePayload = Partial<CreateWorkspacePayload>;

export const workspacesApi = {
  async list(): Promise<Workspace[]> {
    const response = await apiClient.get("/workspaces");
    return response.data;
  },

  async create(payload: CreateWorkspacePayload): Promise<Workspace> {
    const response = await apiClient.post("/workspaces", {
      name: payload.name,
      frequency: payload.frequency,
    });
    return response.data;
  },

  async update(id: string, payload: UpdateWorkspacePayload): Promise<Workspace> {
    const response = await apiClient.patch(`/workspaces/${id}`, payload);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/workspaces/${id}`);
  },
};
