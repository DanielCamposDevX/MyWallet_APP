import { apiClient } from "./client";

apiClient.interceptors.request.use((config) => {
  const rawAuthStore = localStorage.getItem(import.meta.env.VITE_APP_STORAGE_KEY);
  let token: string | null = null;

  if (rawAuthStore) {
    try {
      const authStore = JSON.parse(rawAuthStore) as { token?: string };
      token = authStore.token ?? null;
    } catch {
      token = null;
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
