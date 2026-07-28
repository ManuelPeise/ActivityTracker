import React from "react";

type FormModel<TModel> = {
  key: string;
  value: TModel[keyof TModel];
};

export const useForm = <TModel extends object>(initialValues: TModel) => {
  const [formState, setFormState] = React.useState<FormModel<TModel>[]>(
    Object.keys(initialValues).map((key) => {
      return { key, value: initialValues[key as keyof TModel] };
    }),
  );

  const onChange = React.useCallback((key: keyof TModel, value: any) => {
    setFormState((prevState) => {
      const newState = prevState.map((item) => {
        if (item.key === key) {
          return { ...item, value };
        }
        return item;
      });
      return newState;
    });
  }, []);

  const resetForm = React.useCallback(() => {
    setFormState(
      Object.keys(initialValues).map((key) => {
        return { key, value: initialValues[key as keyof TModel] };
      }),
    );
  }, [initialValues]);

  const updatedModel = React.useMemo((): TModel => {
    return formState.reduce((acc, item) => {
      acc[item.key as keyof TModel] = item.value;
      return acc;
    }, {} as TModel);
  }, [formState]);

  const subScribeValues = React.useCallback(
    (callback: (state: TModel) => Partial<TModel>) => {
      return callback(updatedModel);
    },
    [updatedModel],
  );

  const isModified = React.useMemo((): boolean => {
    return Object.keys(initialValues).some((key) => {
      return (
        initialValues[key as keyof TModel] !== updatedModel[key as keyof TModel]
      );
    });
  }, [initialValues, updatedModel]);

  return {
    updatedModel,
    isModified,
    onChange,
    resetForm,
    subScribeValues,
  };
};
