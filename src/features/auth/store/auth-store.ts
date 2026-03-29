export type AuthStore = {
  token: string | null;
  userName: string | null;
};

export function getAuthStore(): AuthStore {
  const raw = localStorage.getItem(import.meta.env.VITE_APP_STORAGE_KEY);

  if (!raw) {
    return { token: null, userName: null };
  }

  try {
    return JSON.parse(raw) as AuthStore;
  } catch {
    return { token: null, userName: null };
  }
}

export function setAuthStore(store: AuthStore) {
  localStorage.setItem(import.meta.env.VITE_APP_STORAGE_KEY, JSON.stringify(store));
}

export function clearAuthStore() {
  localStorage.removeItem(import.meta.env.VITE_APP_STORAGE_KEY);
}
