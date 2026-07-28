import React from "react";
import FormItemList from "../../../components/form/FormItemList";
import { AuthenticationRequest } from "../../../contexts/AuthContext";
import { useForm } from "../../../hooks/useForm";
import FormTextField from "../../../components/form/FormTextField";
import { FormButtonProps } from "../../../components/form/FormContainer";
import FormLink from "../../../components/form/FormLink";
import { useAuth } from "../../../hooks/useAuth";

const initialModel: AuthenticationRequest = {
  emailAddress: "",
  password: "",
  clientType: "web-app",
};

type LoginFormProps = {
  onAction: () => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ onAction }) => {
  const form = useForm<AuthenticationRequest>(initialModel);

  const { onLogin } = useAuth();

  const { emailAddress, password } = form.subScribeValues((state) => ({
    emailAddress: state.emailAddress,
    password: state.password,
  }));

  const isValidEmailAddress = React.useMemo(() => {
    if (!emailAddress) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailAddress);
  }, [emailAddress]);

  const isValidPassword = React.useMemo(() => {
    if (!password) return false;
    return (
      password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)
    );
  }, [password]);

  const formButtonProps = React.useMemo((): FormButtonProps[] => {
    return [
      {
        label: "Cancel",
        disabled: !form.isModified,
        action: async () => {
          form.resetForm();
        },
      },
      {
        label: "Login",
        disabled: !form.isModified || !isValidEmailAddress || !isValidPassword,
        action: async () => {
          if (
            !emailAddress ||
            !isValidEmailAddress ||
            !password ||
            !isValidPassword
          )
            return;
          await onLogin({ emailAddress, password, clientType: "web-app" });
        },
      },
    ];
  }, [
    form,
    isValidEmailAddress,
    isValidPassword,
    emailAddress,
    password,
    onLogin,
  ]);

  return (
    <FormItemList
      title="Login"
      subtitle="Access your account securely"
      minWidth="100%"
      formButtonProps={formButtonProps}
    >
      <FormTextField
        label="Email Address"
        propertyName="emailAddress"
        value={emailAddress}
        onChange={(key, value) => form.onChange(key, value)}
      />
      <FormTextField
        label="Password"
        propertyName="password"
        value={password}
        isPassword={true}
        onChange={(key, value) => form.onChange(key, value)}
      />
      <FormLink
        label="Create one now"
        description="Don't have an account?"
        onAction={onAction}
      />
    </FormItemList>
  );
};

export default LoginForm;
