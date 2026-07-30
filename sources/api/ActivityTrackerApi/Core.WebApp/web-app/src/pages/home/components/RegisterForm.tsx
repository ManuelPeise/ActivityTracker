import React from "react";
import { useForm } from "../../../hooks/useForm";
import { UserRegistration } from "../../../contexts/AuthContext";
import FormItemList from "../../../components/form/FormItemList";
import { FormButtonProps } from "../../../components/form/FormContainer";
import FormTextField from "../../../components/form/FormTextField";
import FormLink from "../../../components/form/FormLink";
import { useAuth } from "../../../hooks/useAuth";
import FormDateField from "../../../components/form/FormDateField";

const initialModel: UserRegistration = {
  firstName: "",
  lastName: "",
  emailAddress: "",
  dateOfBirth: "",
  password: "",
  passwordConfirmation: "",
};

type RegisterFormProps = {
  onAction: () => void;
};
const RegisterForm: React.FC<RegisterFormProps> = ({ onAction }) => {
  const form = useForm<UserRegistration>(initialModel);

  const { onRegister } = useAuth();

  const {
    firstName,
    lastName,
    emailAddress,
    dateOfBirth,
    password,
    passwordConfirmation,
  } = form.subScribeValues((state) => ({
    firstName: state.firstName,
    lastName: state.lastName,
    emailAddress: state.emailAddress,
    dateOfBirth: state.dateOfBirth,
    password: state.password,
    passwordConfirmation: state.passwordConfirmation,
  }));

  const isValidEmailAddress = React.useMemo(() => {
    if (!emailAddress) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailAddress);
  }, [emailAddress]);

  const isValidPassword = React.useMemo(() => {
    if (!password || !passwordConfirmation) return false;
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      password === passwordConfirmation
    );
  }, [password, passwordConfirmation]);

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
        label: "Register",
        disabled: !form.isModified || !isValidEmailAddress || !isValidPassword,
        action: async () => {
          if (
            !firstName ||
            !lastName ||
            !emailAddress ||
            !dateOfBirth ||
            !password ||
            !isValidEmailAddress ||
            !password ||
            !isValidPassword ||
            !passwordConfirmation
          )
            return;
          await onRegister({
            firstName,
            lastName,
            dateOfBirth,
            emailAddress,
            password,
          }).then((success) => {
            if (success) {
              form.resetForm();
              onAction();
            }
          });
        },
      },
    ];
  }, [
    form,
    isValidEmailAddress,
    isValidPassword,
    emailAddress,
    password,
    passwordConfirmation,
    firstName,
    lastName,
    dateOfBirth,
    onRegister,
    onAction,
  ]);

  return (
    <FormItemList
      title="Register"
      subtitle="Create a new account"
      minWidth="100%"
      formButtonProps={formButtonProps}
    >
      <FormTextField
        label="First Name"
        propertyName="firstName"
        value={firstName}
        onChange={(key, value) => form.onChange(key, value)}
      />
      <FormTextField
        label="Last Name"
        propertyName="lastName"
        value={lastName}
        onChange={(key, value) => form.onChange(key, value)}
      />
      <FormTextField
        label="Email Address"
        propertyName="emailAddress"
        value={emailAddress}
        onChange={(key, value) => form.onChange(key, value)}
      />
      <FormDateField
        label="Date of Birth"
        propertyName="dateOfBirth"
        placeholder="DD-MM-YYYY"
        value={dateOfBirth}
        onChange={(key, value) => form.onChange(key, value)}
      />
      <FormTextField
        label="Password"
        propertyName="password"
        value={password}
        isPassword={true}
        onChange={(key, value) => form.onChange(key, value)}
      />
      <FormTextField
        label="Password Confirmation"
        propertyName="passwordConfirmation"
        value={passwordConfirmation}
        isPassword={true}
        onChange={(key, value) => form.onChange(key, value)}
      />
      <FormLink
        label="Sign in"
        description="Already have an account?"
        onAction={onAction}
      />
    </FormItemList>
  );
};

export default RegisterForm;
