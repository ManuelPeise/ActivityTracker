import React from "react";

export const LocalStorageKeys = {
  JwtToken: "jwtToken",
  RefreshToken: "refreshToken",
};

const useLocalStorage = <TModel>() => {
  const getValue = React.useCallback((key: string): TModel | null => {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      return JSON.parse(storedValue) as TModel;
    }
    return null;
  }, []);

  const setValue = React.useCallback((key: string, value: TModel) => {
    localStorage.setItem(key, JSON.stringify(value));
  }, []);

  const removeValue = React.useCallback((key: string) => {
    localStorage.removeItem(key);
  }, []);

  return {
    getValue,
    setValue,
    removeValue,
  };
};

export default useLocalStorage;
