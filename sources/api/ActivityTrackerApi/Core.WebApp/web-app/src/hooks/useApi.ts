import React from "react";
import { useLoading } from "../contexts/LoadingContext";
import useLocalStorage, { LocalStorageKeys } from "./useLocalStorage";
import { useAuth } from "./useAuth";

const MIN_LOADING_DURATION_MS = 300;

const waitFor = async (durationMs: number): Promise<void> => {
  if (durationMs <= 0) {
    return;
  }

  await new Promise<void>((resolve) => {
    setTimeout(resolve, durationMs);
  });
};

export type ApiOptions<TModel> = {
  serviceUrl: string;
  method: "GET" | "POST";
  parameters?: Record<string, string>;
  model?: TModel;
};

type ApiResult<TRequest, TResponse> = {
  data: TResponse[] | null;
  error: Error | null;
  isLoading: boolean;
  isDataBound: boolean;
  sendRequest: (options?: Partial<ApiOptions<TRequest>>) => Promise<void>;
  sendPostRequest: <TResult>(
    options?: Partial<ApiOptions<TRequest>>,
  ) => Promise<TResult>;
};

export const useApi = <TRequest, TResponse>(
  apiOptions: ApiOptions<TRequest>,
  fetchDataOnMount: boolean = false,
): ApiResult<TRequest, TResponse> => {
  const { getValue, setValue } = useLocalStorage();

  const { onLogout } = useAuth();
  const apiOptionsRef = React.useRef<ApiOptions<TRequest>>(apiOptions);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [data, setData] = React.useState<TResponse[] | null>(null);
  const [error, setError] = React.useState<Error | null>(null);

  const { showLoading, hideLoading } = useLoading();

  const handleUnauthorizedResponse = React.useCallback(
    async <TReturn>(
      options: ApiOptions<TRequest>,
      callback: (options: ApiOptions<TRequest>) => Promise<TReturn>,
    ): Promise<TReturn> => {
      const refreshToken = getValue(LocalStorageKeys.RefreshToken) as
        | string
        | null;

      if (!refreshToken) {
        onLogout();
      }

      const tokenRequestModel = {
        jwt: getValue(LocalStorageKeys.JwtToken) as string,
        refreshToken: refreshToken as string,
        clientType: "web-app",
      };
      const refreshResponse = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}Token/RefreshToken?refreshToken=${refreshToken}`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${getValue(LocalStorageKeys.JwtToken)}`,
          },
          body: JSON.stringify(tokenRequestModel),
        },
      );

      if (!refreshResponse.ok) {
        onLogout();
      }

      const refreshedTokens = (await refreshResponse.json()) as {
        jwtToken?: string;
        jwt?: string;
        refreshToken?: string;
      };

      const nextJwtToken = refreshedTokens.jwtToken ?? refreshedTokens.jwt;
      const nextRefreshToken = refreshedTokens.refreshToken;

      if (!nextJwtToken || !nextRefreshToken) {
        onLogout();
      }

      setValue(LocalStorageKeys.JwtToken, nextJwtToken);
      setValue(LocalStorageKeys.RefreshToken, nextRefreshToken);

      return callback(options);
    },
    [getValue, setValue, onLogout],
  );

  const executeRequest = React.useCallback(
    async (options: ApiOptions<TRequest>): Promise<void> => {
      const requestUrl = new URL(
        `${process.env.REACT_APP_API_BASE_URL}${options.serviceUrl}`,
      );

      if (options.parameters) {
        Object.entries(options.parameters).forEach(([key, value]) => {
          requestUrl.searchParams.append(key, value);
        });
      }

      const response = await fetch(requestUrl.toString(), {
        method: options.method,
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${getValue(LocalStorageKeys.JwtToken) ?? ""}`,
        },
        body:
          options.method === "POST" && options.model
            ? JSON.stringify(options.model)
            : undefined,
      });

      if (response.status === 401) {
        await handleUnauthorizedResponse(options, executeRequest);
        return;
      }

      const result = await response.json();

      if (Array.isArray(result)) {
        setData(result as TResponse[]);
      } else {
        setData([result] as TResponse[]);
      }
    },
    [getValue, handleUnauthorizedResponse],
  );

  const sendRequest = React.useCallback(
    async (options?: Partial<ApiOptions<TRequest>>) => {
      const requestStartedAt = Date.now();
      setIsLoading(true);
      setError(null);
      showLoading();

      try {
        if (options) {
          apiOptionsRef.current = {
            ...apiOptionsRef.current,
            ...options,
          };
        }

        await executeRequest(apiOptionsRef.current);
      } catch (err) {
        setError(err as Error);
      } finally {
        const elapsedMs = Date.now() - requestStartedAt;
        await waitFor(MIN_LOADING_DURATION_MS - elapsedMs);
        setIsLoading(false);
        hideLoading();
      }
    },
    [executeRequest, hideLoading, showLoading],
  );

  const executePostRequest = React.useCallback(
    async <TResult>(options: ApiOptions<TRequest>): Promise<TResult> => {
      const requestUrl = new URL(
        `${process.env.REACT_APP_API_BASE_URL}${options.serviceUrl}`,
      );

      if (options.parameters) {
        Object.entries(options.parameters).forEach(([key, value]) => {
          requestUrl.searchParams.append(key, value);
        });
      }

      const response = await fetch(requestUrl.toString(), {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${getValue(LocalStorageKeys.JwtToken) ?? ""}`,
        },
        body:
          options.method === "POST" && options.model
            ? JSON.stringify(options.model)
            : undefined,
      });

      if (!response.ok) {
        if (response.status === 401) {
          return handleUnauthorizedResponse<TResult>(
            options,
            executePostRequest,
          );
        }

        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`,
        );
      }

      return response.json() as Promise<TResult>;
    },
    [getValue, handleUnauthorizedResponse],
  );

  const sendPostRequest = React.useCallback(
    async <TResult>(
      options?: Partial<ApiOptions<TRequest>>,
    ): Promise<TResult> => {
      const requestStartedAt = Date.now();
      setIsLoading(true);
      setError(null);
      showLoading();

      const apiOptions = { ...apiOptionsRef.current, ...options };
      let result: TResult;

      try {
        result = await executePostRequest(apiOptions);
      } catch (err) {
        setError(err as Error);
      } finally {
        const elapsedMs = Date.now() - requestStartedAt;
        await waitFor(MIN_LOADING_DURATION_MS - elapsedMs);
        setIsLoading(false);
        hideLoading();
      }

      return result!;
    },
    [executePostRequest, hideLoading, showLoading],
  );

  React.useEffect(() => {
    if (fetchDataOnMount) {
      sendRequest();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchDataOnMount]);

  return {
    data,
    error,
    isLoading,
    isDataBound: data !== null,
    sendRequest,
    sendPostRequest,
  };
};
