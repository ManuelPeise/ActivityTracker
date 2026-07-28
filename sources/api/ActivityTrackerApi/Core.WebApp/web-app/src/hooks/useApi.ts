import React from "react";
import useLocalStorage, { LocalStorageKeys } from "./useLocalStorage";
import { useLoading } from "../contexts/LoadingContext";

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
  const apiOptionsRef = React.useRef<ApiOptions<TRequest>>(apiOptions);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [data, setData] = React.useState<TResponse[] | null>(null);
  const [error, setError] = React.useState<Error | null>(null);

  const { getValue } = useLocalStorage();
  const { showLoading, hideLoading } = useLoading();

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

        const requestUrl = new URL(
          `${process.env.REACT_APP_API_BASE_URL}${apiOptionsRef.current.serviceUrl}`,
        );

        if (apiOptionsRef.current.parameters) {
          Object.entries(apiOptionsRef.current.parameters).forEach(
            ([key, value]) => {
              requestUrl.searchParams.append(key, value);
            },
          );
        }

        const response = await fetch(requestUrl.toString(), {
          method: apiOptionsRef.current.method,
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${getValue(LocalStorageKeys.JwtToken)}`,
          },
          body:
            apiOptionsRef.current.method === "POST" &&
            apiOptionsRef.current.model
              ? JSON.stringify(apiOptionsRef.current.model)
              : undefined,
        });
        const result = await response.json();

        if (Array.isArray(result)) {
          setData(result as TResponse[]);
        } else {
          setData([result] as TResponse[]);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        const elapsedMs = Date.now() - requestStartedAt;
        await waitFor(MIN_LOADING_DURATION_MS - elapsedMs);
        setIsLoading(false);
        hideLoading();
      }
    },
    [getValue, hideLoading, showLoading],
  );

  const sendPostRequest = async <TResult>(
    options?: Partial<ApiOptions<TRequest>>,
  ): Promise<TResult> => {
    const requestStartedAt = Date.now();
    setIsLoading(true);
    setError(null);
    showLoading();

    const apiOptions = { ...apiOptionsRef.current, ...options };
    let result: TResult;

    try {
      const requestUrl = new URL(
        `${process.env.REACT_APP_API_BASE_URL}${apiOptionsRef.current.serviceUrl}`,
      );

      if (apiOptions.parameters) {
        Object.entries(apiOptions.parameters).forEach(([key, value]) => {
          requestUrl.searchParams.append(key, value);
        });
      }

      await fetch(requestUrl.toString(), {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body:
          apiOptions.method === "POST" && apiOptions.model
            ? JSON.stringify(apiOptions.model)
            : undefined,
      }).then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Request failed with status ${response.status}: ${errorText}`,
          );
        }

        result = await response.json();
      });
    } catch (err) {
      setError(err as Error);
    } finally {
      const elapsedMs = Date.now() - requestStartedAt;
      await waitFor(MIN_LOADING_DURATION_MS - elapsedMs);
      setIsLoading(false);
      hideLoading();
    }

    return result!;
  };

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
