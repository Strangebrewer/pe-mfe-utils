import type { AxiosInstance } from "axios";

export type TokenExchangeResponse = {
  accessToken: string;
  refreshToken: string;
};

export async function exchangeRefreshToken(
  axios: AxiosInstance,
  refreshToken: string,
  endpoint = "/token/exchange"
): Promise<TokenExchangeResponse> {
  const response = await axios.post(
    endpoint,
    {},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    }
  );

  if (!response?.data?.accessToken || !response?.data?.refreshToken) {
    throw new Error("Token exchange did not return accessToken/refreshToken");
  }

  return response.data as TokenExchangeResponse;
}
