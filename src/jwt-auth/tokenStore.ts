export type TokenKeys = {
  access: string;
  refresh: string;
};

const DEFAULT_KEYS: TokenKeys = {
  access: "access_token",
  refresh: "refresh_token",
};

export function createTokenStore(storage: Storage = localStorage, keys?: Partial<TokenKeys>) {
  const k: TokenKeys = { ...DEFAULT_KEYS, ...(keys ?? {}) };

  return {
    setAccessToken(token: string) {
      storage.setItem(k.access, token);
    },
    getAccessToken(): string | null {
      return storage.getItem(k.access);
    },
    clearAccessToken() {
      storage.removeItem(k.access);
    },

    setRefreshToken(token: string) {
      storage.setItem(k.refresh, token);
    },
    getRefreshToken(): string | null {
      return storage.getItem(k.refresh);
    },
    clearRefreshToken() {
      storage.removeItem(k.refresh);
    },

    clearAll() {
      storage.removeItem(k.access);
      storage.removeItem(k.refresh);
    },

    keys: k,
  };
}
