import React from "react";
import { useApi } from "../hooks/useApi";
import useLocalStorage, { LocalStorageKeys } from "../hooks/useLocalStorage";

export type TokenModel = {
  jwtToken: string;
  refreshToken: string;
};

export type AuthContextProps = {
  isAuthenticated: boolean;
  onLogout: () => Promise<void>;
  onLogin: (request: AuthenticationRequest) => Promise<void>;
  onRegister: (request: UserRegistrationRequestModel) => Promise<boolean>;
  tokens: TokenModel;
};

export const AuthContext = React.createContext<AuthContextProps>({
  isAuthenticated: false,
  onLogout: async () => {},
  onLogin: async (request: AuthenticationRequest) => {},
  onRegister: async (request: UserRegistrationRequestModel): Promise<boolean> =>
    false,
  tokens: { jwtToken: "", refreshToken: "" },
});

export type UserRegistration = {
  firstName: string;
  lastName: string;
  emailAddress: string;
  dateOfBirth: string;
  password: string;
  passwordConfirmation: string;
};

export type UserRegistrationRequestModel = Omit<
  UserRegistration,
  "passwordConfirmation"
>;

export type AuthenticationRequest = {
  emailAddress: string;
  password: string;
  clientType: string;
};

export type TokenResponse = {
  jwt: string;
  refreshToken: string;
};

const AuthenticationContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const localStorage = useLocalStorage<string>();
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(() => {
    return Boolean(
      localStorage.getValue(LocalStorageKeys.JwtToken) &&
      localStorage.getValue(LocalStorageKeys.RefreshToken),
    );
  });

  const registerApi = useApi<UserRegistrationRequestModel, boolean>({
    serviceUrl: "Registration/RegisterUser",
    method: "POST",
  });

  const onRegister = React.useCallback(
    async (request: UserRegistrationRequestModel): Promise<boolean> => {
      return await registerApi.sendPostRequest<boolean>({
        model: request,
      });
    },
    [registerApi],
  );

  const authenticationApi = useApi<AuthenticationRequest, TokenResponse>({
    serviceUrl: "Authentication/AuthenticateUser",
    method: "POST",
  });

  const onLogin = React.useCallback(
    async (request: AuthenticationRequest) => {
      const response = await authenticationApi.sendPostRequest<TokenResponse>({
        model: request,
      });

      if (response && response.jwt && response.refreshToken) {
        localStorage.setValue(LocalStorageKeys.JwtToken, response.jwt);
        localStorage.setValue(
          LocalStorageKeys.RefreshToken,
          response.refreshToken,
        );
        setIsAuthenticated(true);
      }
    },
    [authenticationApi, localStorage],
  );

  const onLogout = React.useCallback(async () => {
    localStorage.removeValue(LocalStorageKeys.JwtToken);
    localStorage.removeValue(LocalStorageKeys.RefreshToken);
    setIsAuthenticated(false);
  }, [localStorage]);

  const tokens = React.useMemo((): TokenModel => {
    const jwtToken = localStorage.getValue(LocalStorageKeys.JwtToken);
    const refreshToken = localStorage.getValue(LocalStorageKeys.RefreshToken);

    return { jwtToken: jwtToken || "", refreshToken: refreshToken || "" };
  }, [localStorage]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        onLogout: onLogout,
        onLogin: onLogin,
        onRegister: onRegister,
        tokens: tokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthenticationContextProvider;
