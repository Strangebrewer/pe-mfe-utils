import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { createTokenStore, type TokenKeys } from "./tokenStore";
import { isTokenExpired } from "./jwt";
import { exchangeRefreshToken } from "./refresh";

type CreateAuthClientOptions = {
  /** Used ONLY for refresh calls (must NOT have auth interceptor attached) */
  axiosPublic: AxiosInstance;

  /** Used for normal API calls that should carry Authorization */
  axiosAuth: AxiosInstance;

  onLogout: () => void;

  storage?: Storage;
  keys?: Partial<TokenKeys>;
  refreshEndpoint?: string;
};

export function createAuthClient(options: CreateAuthClientOptions) {
  const {
    axiosPublic,
    axiosAuth,
    onLogout,
    storage = localStorage,
    keys,
    refreshEndpoint = "/token/exchange",
  } = options;

  const store = createTokenStore(storage, keys);

  // single-flight refresh: everyone awaits the same promise
  let refreshInFlight: Promise<string> | null = null;

  async function getOrRefreshAccessToken(): Promise<string | null> {
    let access = store.getAccessToken();

    if (access && !isTokenExpired(access)) {
      return access;
    }

    const refresh = store.getRefreshToken();
    if (!refresh) return null;

    if (!refreshInFlight) {
      refreshInFlight = (async () => {
        const data = await exchangeRefreshToken(axiosPublic, refresh, refreshEndpoint);
        store.setAccessToken(data.accessToken);
        store.setRefreshToken(data.refreshToken);
        return data.accessToken;
      })().finally(() => {
        refreshInFlight = null;
      });
    }

    try {
      return await refreshInFlight;
    } catch {
      return null;
    }
  }

  function logout(): void {
    store.clearAll();
    onLogout();
  }

  async function authRequestInterceptor(config: InternalAxiosRequestConfig) {
    const token = await getOrRefreshAccessToken();

    config.headers = config.headers ?? {};

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    }

    // No valid token -> remove header and trigger logout UI
    delete (config.headers as any).Authorization;
    logout();
    return config;
  }

  let interceptorId: number | null = null;

  function attach(): void {
    if (interceptorId != null) return; // prevent double attach
    interceptorId = axiosAuth.interceptors.request.use(authRequestInterceptor);
  }

  function detach(): void {
    if (interceptorId == null) return;
    axiosAuth.interceptors.request.eject(interceptorId);
    interceptorId = null;
  }

  return {
    attach,
    detach,
    logout,

    // helpers for shell login flow
    setTokens(accessToken: string, refreshToken: string) {
      store.setAccessToken(accessToken);
      store.setRefreshToken(refreshToken);
    },
    clearTokens() {
      store.clearAll();
    },
    getAccessToken() {
      return store.getAccessToken();
    },
    getRefreshToken() {
      return store.getRefreshToken();
    },
  };
}
