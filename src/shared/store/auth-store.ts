export type AuthStore = {
  token: string | null
  userName: string | null
}

const AUTH_STORAGE_KEY = 'mywallet:auth'

export function getAuthStore(): AuthStore {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY)

  if (!raw) {
    return { token: null, userName: null }
  }

  try {
    return JSON.parse(raw) as AuthStore
  } catch {
    return { token: null, userName: null }
  }
}

export function setAuthStore(store: AuthStore) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(store))
}

export function clearAuthStore() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}
