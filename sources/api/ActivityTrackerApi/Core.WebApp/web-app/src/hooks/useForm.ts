import React from "react";

type FormModel<TModel> = {
  key: string;
  value: TModel[keyof TModel];
};

type ValueSelector<TModel> = <TSelected>(
  callback: (state: TModel) => TSelected,
) => TSelected;

type UseFormResult<TModel> = {
  updatedModel: TModel;
  isModified: boolean;
  onChange: <TKey extends keyof TModel>(key: TKey, value: TModel[TKey]) => void;
  resetForm: () => void;
  subscribeValues: ValueSelector<TModel>;
  subScribeValues: ValueSelector<TModel>;
};

const toFormState = <TModel extends object>(
  model: TModel,
): FormModel<TModel>[] => {
  return Object.keys(model).map((key) => {
    return { key, value: model[key as keyof TModel] };
  });
};

const areModelsEqual = <TModel extends object>(
  left: TModel,
  right: TModel,
): boolean => {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);

  if (leftKeys.length !== rightKeys.length) {
    return false;
  }

  return leftKeys.every((key) => {
    return left[key as keyof TModel] === right[key as keyof TModel];
  });
};

export const useForm = <TModel extends object>(
  initialValues: TModel,
): UseFormResult<TModel> => {
  const [formState, setFormState] = React.useState<FormModel<TModel>[]>(() => {
    return toFormState(initialValues);
  });

  const initialValuesRef = React.useRef(initialValues);

  React.useEffect(() => {
    if (!areModelsEqual(initialValuesRef.current, initialValues)) {
      initialValuesRef.current = initialValues;
      setFormState(toFormState(initialValues));
    }
  }, [initialValues]);

  const onChange = React.useCallback(
    <TKey extends keyof TModel>(key: TKey, value: TModel[TKey]) => {
      setFormState((prevState) => {
        const newState = prevState.map((item) => {
          if (item.key === key) {
            return { ...item, value };
          }
          return item;
        });
        return newState;
      });
    },
    [],
  );

  const resetForm = React.useCallback(() => {
    setFormState(toFormState(initialValuesRef.current));
  }, []);

  const updatedModel = React.useMemo((): TModel => {
    return formState.reduce((acc, item) => {
      acc[item.key as keyof TModel] = item.value;
      return acc;
    }, {} as TModel);
  }, [formState]);

  const subscribeValues = React.useCallback(
    <TSelected>(callback: (state: TModel) => TSelected): TSelected => {
      return callback(updatedModel);
    },
    [updatedModel],
  );

  const isModified = React.useMemo((): boolean => {
    return Object.keys(initialValuesRef.current).some((key) => {
      return (
        initialValuesRef.current[key as keyof TModel] !==
        updatedModel[key as keyof TModel]
      );
    });
  }, [updatedModel]);

  return {
    updatedModel,
    isModified,
    onChange,
    resetForm,
    subscribeValues,
    subScribeValues: subscribeValues,
  };
};
