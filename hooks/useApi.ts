import { useState, useCallback } from "react";
import axios, { AxiosRequestConfig } from "axios";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type ApiState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export default function useApi<T>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const request = useCallback(
    async (baseURL: string, apiKey: string, endpoint: string, method: HttpMethod = "GET", body?: any) => {
      setState((prev) => ({ ...prev, loading: true }));

      try {
        const config: AxiosRequestConfig = {
          method,
          url: `${baseURL}${endpoint}`,
          data: body,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        };

        const response = await axios(config);
        setState({ data: response.data, loading: false, error: null });

        return response.data;
      } catch (error) {
        setState({ data: null, loading: false, error: "Request failed" });
        console.error(error);
      }
    },
    []
  );

  return {
    ...state,
    get: (baseURL: string, apiKey: string, endpoint: string) => request(baseURL, apiKey, endpoint, "GET"),
    post: (baseURL: string, apiKey: string, endpoint: string, body: any) =>
      request(baseURL, apiKey, endpoint, "POST", body),
    put: (baseURL: string, apiKey: string, endpoint: string, body: any) =>
      request(baseURL, apiKey, endpoint, "PUT", body),
    del: (baseURL: string, apiKey: string, endpoint: string) => request(baseURL, apiKey, endpoint, "DELETE"),
  };
}
