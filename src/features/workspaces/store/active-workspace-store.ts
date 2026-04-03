const ACTIVE_WORKSPACE_STORAGE_KEY = "mywallet:active-workspace-id";

export function getActiveWorkspaceId(): string | null {
  return localStorage.getItem(ACTIVE_WORKSPACE_STORAGE_KEY);
}

export function setActiveWorkspaceId(workspaceId: string): void {
  localStorage.setItem(ACTIVE_WORKSPACE_STORAGE_KEY, workspaceId);
}

export function clearActiveWorkspaceId(): void {
  localStorage.removeItem(ACTIVE_WORKSPACE_STORAGE_KEY);
}
