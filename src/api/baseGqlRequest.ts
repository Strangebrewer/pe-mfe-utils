import { AxiosInstance } from "axios";

function buildGqlRequest(GQL_URL: string, axiosAuth: AxiosInstance) {
  return async function <T = any>(
    query: string,
    variables?: Record<string, any>,
    traceId?: string,
  ): Promise<T> {
    const headers: Record<string, any> = {};
    if (traceId) headers["X-Trace-ID"] = traceId;
    const response = await axiosAuth.post(
      GQL_URL,
      { query, variables },
      { headers },
    );
    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }
    return response.data.data;
  };
}

export default buildGqlRequest;
