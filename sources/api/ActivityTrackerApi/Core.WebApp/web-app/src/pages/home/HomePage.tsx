import React from "react";
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
      {section === "login" ? (
        <LoginForm onAction={handleToggleSectionCallback} />
      ) : (
        <RegisterForm onAction={handleToggleSectionCallback} />
      )}
    </PageContainer>
  );
};

export default HomePage;
