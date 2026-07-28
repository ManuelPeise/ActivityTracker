import React from "react";
import { useApi } from "../hooks/useApi";
import useLocalStorage, { LocalStorageKeys } from "../hooks/useLocalStorage";

export type AuthContextProps = {
  isAuthenticated: boolean;
  onLogout: () => Promise<void>;
  onLogin: (request: AuthenticationRequest) => Promise<void>;
  onRegister: (request: UserRegistrationRequestModel) => Promise<boolean>;
};

export const AuthContext = React.createContext<AuthContextProps>({
  isAuthenticated: false,
  onLogout: async () => {},
  onLogin: async (request: AuthenticationRequest) => {},
  onRegister: async (request: UserRegistrationRequestModel): Promise<boolean> =>
    false,
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
};

export type TokenResponse = {
  jwt: string;
  refreshToken: string;
};

const AuthenticationContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);

  const localStorage = useLocalStorage<string>();

  const registerApi = useApi<UserRegistrationRequestModel, boolean>({
    serviceUrl: "/api/Registration/RegisterUser",
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
    serviceUrl: "/api/Authentication/AuthenticateUser",
    method: "POST",
  });

  const onLogin = React.useCallback(
    async (request: AuthenticationRequest) => {
      await authenticationApi
        .sendPostRequest<TokenResponse>({
          model: request,
        })
        .then((response) => {
          if (response && response.jwt) {
            localStorage.setValue(LocalStorageKeys.JwtToken, response.jwt);
            localStorage.setValue(
              LocalStorageKeys.RefreshToken,
              response.refreshToken,
            );
            setIsAuthenticated(true);
          }
        });
    },
    [authenticationApi, localStorage],
  );

  const onLogout = React.useCallback(async () => {
    localStorage.removeValue(LocalStorageKeys.JwtToken);
    localStorage.removeValue(LocalStorageKeys.RefreshToken);
    setIsAuthenticated(false);
  }, [localStorage]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        onLogout: onLogout,
        onLogin: onLogin,
        onRegister: onRegister,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthenticationContextProvider;
