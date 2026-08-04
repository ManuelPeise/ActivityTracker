import React from "react";

interface UseSimpleFormOptions<TModel> {
  initialValues: TModel;
  onSubmit?: (values: TModel) => void;
}

interface UseSimpleFormResult<TModel> {
  formValues: TModel;
  isDirty: boolean;
  resetForm: () => void;
  handleChange: (key: keyof TModel, value: TModel[keyof TModel]) => void;
  handleArrayChange: <TItem>(
    key: keyof TModel,
    id: number,
    value: Partial<TItem>,
  ) => void;
  onSubmit: () => void;
}

export const useSimpleForm = <TModel>(
  options: UseSimpleFormOptions<TModel>,
  submitCallback?: (values: TModel) => void,
): UseSimpleFormResult<TModel> => {
  const { initialValues, onSubmit } = options;
  const [values, setValues] = React.useState<TModel>(initialValues);

  const isDirty = React.useMemo(() => {
    return JSON.stringify(values) !== JSON.stringify(initialValues);
  }, [values, initialValues]);

  const resetForm = React.useCallback(() => {
    setValues(initialValues);
  }, [initialValues]);

  const handleChange = React.useCallback(
    (key: keyof TModel, value: TModel[keyof TModel]) => {
      setValues((prevValues) => ({
        ...prevValues,
        [key]: value,
      }));
    },
    [],
  );

  const handleArrayChange = React.useCallback(
    <TItem>(key: keyof TModel, index: number, value: Partial<TItem>) => {
      setValues((prevValues) => {
        const array = prevValues[key] as unknown as TItem[];
        if (!Array.isArray(array) || array.length <= index) {
          throw new Error(`The value at key "${String(key)}" is not an array.`);
        }
        const newArray = [...array];
        newArray[index] = {
          ...newArray[index],
          ...value,
        } as TItem;

        return {
          ...prevValues,
          [key]: newArray as unknown as TModel[keyof TModel],
        };
      });
    },
    [],
  );

  return {
    formValues: values,
    isDirty,
    resetForm,
    handleChange,
    handleArrayChange,
    onSubmit: () => {
      if (submitCallback) {
        submitCallback(values);
      }
      if (onSubmit) {
        onSubmit(values);
      }
    },
  };
};
