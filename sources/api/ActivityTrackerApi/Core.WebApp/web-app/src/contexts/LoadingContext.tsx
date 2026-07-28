import React from "react";
import LoadingIndicator from "../components/LoadingIndicator";

type LoadingContextProps = {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
};

const LoadingContext = React.createContext<LoadingContextProps>({
  isLoading: false,
  showLoading: () => {},
  hideLoading: () => {},
});

type LoadingContextProviderProps = {
  children: React.ReactNode;
};

export const LoadingContextProvider: React.FC<LoadingContextProviderProps> = ({
  children,
}) => {
  const [pendingRequests, setPendingRequests] = React.useState<number>(0);

  const showLoading = React.useCallback(() => {
    setPendingRequests((currentValue) => currentValue + 1);
  }, []);

  const hideLoading = React.useCallback(() => {
    setPendingRequests((currentValue) => Math.max(0, currentValue - 1));
  }, []);

  const contextValue = React.useMemo((): LoadingContextProps => {
    return {
      isLoading: pendingRequests > 0,
      showLoading,
      hideLoading,
    };
  }, [pendingRequests, showLoading, hideLoading]);

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
      <LoadingIndicator message="Loading..." isLoading={pendingRequests > 0} />
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextProps => {
  return React.useContext(LoadingContext);
};
