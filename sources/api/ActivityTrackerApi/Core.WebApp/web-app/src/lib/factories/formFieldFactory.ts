export type FormField<TModel> = {
  propertyName: keyof TModel;
  type: "text" | "password" | "number" | "boolean" | "array";
  label?: string;
  required?: boolean;
  disabled?: boolean;
  errorMessage?: string;
  validationCallback?: (value: TModel[keyof TModel]) => boolean;
};

export type FormFieldFactory<TModel extends Record<string, unknown>> = {
  createStringFormField: (
    propertyName: keyof TModel,
    label?: string,
    required?: boolean,
    disabled?: boolean,
    isPassword?: boolean,
    errorMessage?: string,
    validationCallback?: (value: TModel[keyof TModel]) => boolean,
  ) => FormField<TModel>;
  createNumberFormField: (
    propertyName: keyof TModel,
    label?: string,
    required?: boolean,
    disabled?: boolean,
    errorMessage?: string,
    validationCallback?: (value: TModel[keyof TModel]) => boolean,
  ) => FormField<TModel>;
  createBooleanFormField: (
    propertyName: keyof TModel,
    label?: string,
    required?: boolean,
    disabled?: boolean,
    errorMessage?: string,
    validationCallback?: (value: TModel[keyof TModel]) => boolean,
  ) => FormField<TModel>;
  createArraySettings: (
    propertyName: keyof TModel,
    label?: string,
    required?: boolean,
    disabled?: boolean,
    errorMessage?: string,
    validationCallback?: (value: TModel[keyof TModel]) => boolean,
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
      errorMessage,
      validationCallback,
    ) =>
      createStringFormField<TModel, typeof propertyName>(
        propertyName,
        label,
        required,
        disabled,
        isPassword,
        errorMessage,
        validationCallback,
      ),
    createNumberFormField: (
      propertyName,
      label,
      required,
      disabled,
      errorMessage,
      validationCallback,
    ) =>
      createNumberFormField<TModel, typeof propertyName>(
        propertyName,
        label,
        required,
        disabled,
        errorMessage,
        validationCallback,
      ),
    createBooleanFormField: (
      propertyName,
      label,
      required,
      disabled,
      errorMessage,
      validationCallback,
    ) =>
      createBooleanFormField<TModel, typeof propertyName>(
        propertyName,
        label,
        required,
        disabled,
        errorMessage,
        validationCallback,
      ),
    createArraySettings: (
      propertyName,
      label,
      required,
      disabled,
      errorMessage,
      validationCallback,
    ) =>
      createArraySettings<TModel, typeof propertyName>(
        propertyName,
        label,
        required,
        disabled,
        errorMessage,
        validationCallback,
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
  errorMessage?: string,
  validationCallback?: (value: TModel[keyof TModel]) => boolean,
): FormField<TModel> => ({
  propertyName: propertyName,
  type: isPassword ? "password" : "text",
  label: label,
  required: required,
  disabled: disabled,
  errorMessage: errorMessage,
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
  errorMessage?: string,
  validationCallback?: (value: TModel[keyof TModel]) => boolean,
): FormField<TModel> => ({
  propertyName: propertyName,
  type: "number",
  label: label,
  required: required,
  disabled: disabled,
  errorMessage: errorMessage,
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
  errorMessage?: string,
  validationCallback?: (value: TModel[keyof TModel]) => boolean,
): FormField<TModel> => ({
  propertyName: propertyName,
  type: "boolean",
  label: label,
  required: required,
  disabled: disabled,
  errorMessage: errorMessage,
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
  errorMessage?: string,
  validationCallback?: (value: TModel[keyof TModel]) => boolean,
): FormField<TModel> => ({
  propertyName: propertyName,
  type: "array",
  label: label,
  required: required,
  disabled: disabled,
  errorMessage: errorMessage,
  validationCallback: validationCallback,
});

export const formFieldFactory: FormFieldFactory<Record<string, unknown>> = {
  createStringFormField,
  createNumberFormField,
  createBooleanFormField,
  createArraySettings,
};
