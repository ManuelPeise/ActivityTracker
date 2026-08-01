import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

export type FormField<TModel> = {
  propertyName: keyof TModel;
  type:
    | "text"
    | "password"
    | "number"
    | "boolean"
    | "array"
    | "status"
    | "logMessage";
  label?: string;
  required?: boolean;
  disabled?: boolean;
  message?: string;
  avatarSrc?: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  };
  statusColor?: "green" | "red" | "yellow";
  validationCallback?: (value: TModel[keyof TModel]) => boolean;
};

export type FormFieldFactory<TModel extends Record<string, unknown>> = {
  createStringFormField: (
    propertyName: keyof TModel,
    label?: string,
    required?: boolean,
    disabled?: boolean,
    isPassword?: boolean,
    message?: string,
    validationCallback?: (value: TModel[keyof TModel]) => boolean,
  ) => FormField<TModel>;
  createNumberFormField: (
    propertyName: keyof TModel,
    label?: string,
    required?: boolean,
    disabled?: boolean,
    message?: string,
    validationCallback?: (value: TModel[keyof TModel]) => boolean,
  ) => FormField<TModel>;
  createBooleanFormField: (
    propertyName: keyof TModel,
    label?: string,
    required?: boolean,
    disabled?: boolean,
    message?: string,
    validationCallback?: (value: TModel[keyof TModel]) => boolean,
  ) => FormField<TModel>;
  createArraySettings: (
    propertyName: keyof TModel,
    label?: string,
    required?: boolean,
    disabled?: boolean,
    message?: string,
    validationCallback?: (value: TModel[keyof TModel]) => boolean,
  ) => FormField<TModel>;
  createStatusSettings: (
    propertyName: keyof TModel,
    label: string,
    message: string,
    avatarSrc: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
      muiName: string;
    },
    statusColor?: "green" | "red" | "yellow",
  ) => FormField<TModel>;
};

export const createFormFieldFactory = <
  TModel extends Record<string, unknown>,
>(): FormFieldFactory<TModel> => {
  return {
    createStringFormField: (
      propertyName,
      label,
      required,
      disabled,
      isPassword,
      message,
      validationCallback,
    ) =>
      createStringFormField<TModel, typeof propertyName>(
        propertyName,
        label,
        required,
        disabled,
        isPassword,
        message,
        validationCallback,
      ),
    createNumberFormField: (
      propertyName,
      label,
      required,
      disabled,
      message,
      validationCallback,
    ) =>
      createNumberFormField<TModel, typeof propertyName>(
        propertyName,
        label,
        required,
        disabled,
        message,
        validationCallback,
      ),
    createBooleanFormField: (
      propertyName,
      label,
      required,
      disabled,
      message,
      validationCallback,
    ) =>
      createBooleanFormField<TModel, typeof propertyName>(
        propertyName,
        label,
        required,
        disabled,
        message,
        validationCallback,
      ),
    createArraySettings: (
      propertyName,
      label,
      required,
      disabled,
      message,
      validationCallback,
    ) =>
      createArraySettings<TModel, typeof propertyName>(
        propertyName,
        label,
        required,
        disabled,
        message,
        validationCallback,
      ),
    createStatusSettings: (
      propertyName,
      label,
      message,
      avatarSrc,
      statusColor,
    ) =>
      createStatusSettings<TModel, typeof propertyName>(
        propertyName,
        label,
        message,
        avatarSrc,
        statusColor,
      ),
  };
};

const createStringFormField = <
  TModel extends Record<string, unknown>,
  TKey extends keyof TModel,
>(
  propertyName: TKey,
  label?: string,
  required?: boolean,
  disabled?: boolean,
  isPassword?: boolean,
  message?: string,
  validationCallback?: (value: TModel[keyof TModel]) => boolean,
): FormField<TModel> => ({
  propertyName: propertyName,
  type: isPassword ? "password" : "text",
  label: label,
  required: required,
  disabled: disabled,
  message: message,
  validationCallback: validationCallback,
});

const createNumberFormField = <
  TModel extends Record<string, unknown>,
  TKey extends keyof TModel,
>(
  propertyName: TKey,
  label?: string,
  required?: boolean,
  disabled?: boolean,
  message?: string,
  validationCallback?: (value: TModel[keyof TModel]) => boolean,
): FormField<TModel> => ({
  propertyName: propertyName,
  type: "number",
  label: label,
  required: required,
  disabled: disabled,
  message: message,
  validationCallback: validationCallback,
});

const createBooleanFormField = <
  TModel extends Record<string, unknown>,
  TKey extends keyof TModel,
>(
  propertyName: TKey,
  label?: string,
  required?: boolean,
  disabled?: boolean,
  message?: string,
  validationCallback?: (value: TModel[keyof TModel]) => boolean,
): FormField<TModel> => ({
  propertyName: propertyName,
  type: "boolean",
  label: label,
  required: required,
  disabled: disabled,
  message: message,
  validationCallback: validationCallback,
});

const createArraySettings = <
  TModel extends Record<string, unknown>,
  TKey extends keyof TModel,
>(
  propertyName: TKey,
  label?: string,
  required?: boolean,
  disabled?: boolean,
  message?: string,
  validationCallback?: (value: TModel[keyof TModel]) => boolean,
): FormField<TModel> => ({
  propertyName: propertyName,
  type: "array",
  label: label,
  required: required,
  disabled: disabled,
  message: message,
  validationCallback: validationCallback,
});

const createStatusSettings = <
  TModel extends Record<string, unknown>,
  TKey extends keyof TModel,
>(
  propertyName: TKey,
  label: string,
  message: string,
  avatarSrc: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  },
  statusColor?: "green" | "red" | "yellow",
): FormField<TModel> => ({
  propertyName: propertyName,
  avatarSrc: avatarSrc,
  type: "status",
  label: label,
  message: message,
  required: false,
  disabled: false,
  statusColor: statusColor,
});

export const formFieldFactory: FormFieldFactory<Record<string, unknown>> = {
  createStringFormField,
  createNumberFormField,
  createBooleanFormField,
  createArraySettings,
  createStatusSettings,
};
