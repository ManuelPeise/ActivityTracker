import React from "react";
import { Box } from "@mui/material";
import PageContainer from "../../components/wrappers/PageContainer";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

const HomePage: React.FC = () => {
  const [section, setSection] = React.useState<"login" | "register">("login");

  const handleToggleSectionCallback = React.useCallback(() => {
    setSection((prevSection) =>
      prevSection === "login" ? "register" : "login",
    );
  }, []);

  return (
    <PageContainer>
      <Box sx={{ width: "100%", maxWidth: "460px", mx: "auto" }}>
        {section === "login" ? (
          <LoginForm onAction={handleToggleSectionCallback} />
        ) : (
          <RegisterForm onAction={handleToggleSectionCallback} />
        )}
      </Box>
    </PageContainer>
  );
};

export default HomePage;
