import React from "react";
import { act, renderHook } from "@testing-library/react";
import { AuthContext } from "../contexts/AuthContext";
import { LoadingContextProvider } from "../contexts/LoadingContext";
import { useApi } from "./useApi";

describe("useApi", () => {
  it("logs out and surfaces an unauthorized error when the API returns 401", async () => {
    const onLogout = jest.fn().mockResolvedValue(undefined);
    const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 401,
      text: jest.fn().mockResolvedValue("Unauthorized"),
    } as unknown as Response);

    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <AuthContext.Provider
        value={{
          isAuthenticated: true,
          onLogout,
          onLogin: jest.fn(),
          onRegister: jest.fn(),
          tokens: { jwtToken: "", refreshToken: "" },
        }}
      >
        <LoadingContextProvider>{children}</LoadingContextProvider>
      </AuthContext.Provider>
    );

    const { result } = renderHook(
      () => useApi({ serviceUrl: "test", method: "GET" }),
      {
        wrapper,
      },
    );

    await act(async () => {
      await result.current.sendRequest();
    });

    expect(onLogout).toHaveBeenCalledTimes(1);
    expect(result.current.error?.message).toContain("Unauthorized");
    expect(result.current.isLoading).toBe(false);

    fetchSpy.mockRestore();
  });
});
