import React from "react";
import useLocalStorage, { LocalStorageKeys } from "./useLocalStorage";

type JwtTokenModel = {
  name: string;
  emailaddress: string;
  expiration: string;
};

export const useTokens = () => {
  const [jwtToken, setJwtToken] = React.useState<{
    jwt: string;
    refresh: string;
  } | null>(null);

  const [tokenModel, setTokenModel] = React.useState<JwtTokenModel | null>(
    null,
  );

  const localStorage = useLocalStorage<string | null>();

  React.useEffect(() => {
    const storedJwtToken = localStorage.getValue(LocalStorageKeys.JwtToken);
    const storedRefreshToken = localStorage.getValue(
      LocalStorageKeys.RefreshToken,
    );

    if (!storedJwtToken || !storedRefreshToken) {
      return;
    }
    setJwtToken({ jwt: storedJwtToken, refresh: storedRefreshToken });

    try {
      const payload = storedJwtToken.split(".")[1];
      const tokenPayload = JSON.parse(atob(payload));

      setTokenModel({
        name: tokenPayload.name,
        emailaddress: tokenPayload.emailaddress,
        expiration: tokenPayload.exp,
      });
    } catch {
      setTokenModel(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { jwtToken, tokenModel };
};
