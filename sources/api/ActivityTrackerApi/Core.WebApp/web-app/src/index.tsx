import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import AuthenticationContextProvider from "./contexts/AuthContext";
import AppRouter from "./lib/AppRouter";
import { LoadingContextProvider } from "./contexts/LoadingContext";
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <LoadingContextProvider>
    <AuthenticationContextProvider>
      <AppRouter />
    </AuthenticationContextProvider>
  </LoadingContextProvider>,
);

reportWebVitals();
