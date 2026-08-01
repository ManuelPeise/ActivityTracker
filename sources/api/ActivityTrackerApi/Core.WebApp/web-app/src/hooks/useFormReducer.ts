import React from "react";

export type Updater<TModel extends Record<string, unknown>> =
  | Partial<TModel>
  | ((state: TModel) => Partial<TModel>);

type FormState<TModel extends Record<string, unknown>> = {
  current: TModel;
  original: TModel;
};

export type UseFormReducerResult<TModel extends Record<string, unknown>> = {
  state: TModel;
  originalState: TModel;
  isModified: boolean;
  useModel: (initialModel: TModel) => void;
  updateModel: (nextPatch: Updater<TModel>) => void;
  getUpdatedModel: () => TModel;
  resetModel: () => void;
};

const areArraysEqual = (left: unknown[], right: unknown[]): boolean => {
  if (left.length !== right.length) {
    return false;
  }

  for (let index = 0; index < left.length; index += 1) {
    if (!Object.is(left[index], right[index])) {
      return false;
    }
  }

  return true;
};

const areModelsEqual = <TModel extends Record<string, unknown>>(
  left: TModel,
  right: TModel,
): boolean => {
  const leftKeys = Object.keys(left) as (keyof TModel)[];
  const rightKeys = Object.keys(right) as (keyof TModel)[];

  if (leftKeys.length !== rightKeys.length) {
    return false;
  }

  for (const key of leftKeys) {
    const leftValue = left[key];
    const rightValue = right[key];

    if (Array.isArray(leftValue) && Array.isArray(rightValue)) {
      if (!areArraysEqual(leftValue, rightValue)) {
        return false;
      }
      continue;
    }

    if (!Object.is(leftValue, rightValue)) {
      return false;
    }
  }

  return true;
};

const resolvePatch = <TModel extends Record<string, unknown>>(
  state: TModel,
  nextPatch: Updater<TModel>,
): Partial<TModel> => {
  return typeof nextPatch === "function" ? nextPatch(state) : nextPatch;
};

const reducer = <TModel extends Record<string, unknown>>(
  state: FormState<TModel>,
  action:
    | { type: "initialize"; model: TModel }
    | { type: "update"; patch: Updater<TModel> }
    | { type: "reset" },
): FormState<TModel> => {
  switch (action.type) {
    case "initialize": {
      return {
        current: action.model,
        original: action.model,
      };
    }
    case "update": {
      const patch = resolvePatch(state.current, action.patch);
      const nextCurrent = { ...state.current, ...patch };

      if (areModelsEqual(state.current, nextCurrent)) {
        return state;
      }

      return {
        current: nextCurrent,
        original: state.original,
      };
    }
    case "reset": {
      return {
        current: state.original,
        original: state.original,
      };
    }
    default:
      return state;
  }
};

export const useFormReducer = <TModel extends Record<string, unknown>>() => {
  const [state, dispatch] = React.useReducer(reducer<TModel>, {
    current: {} as TModel,
    original: {} as TModel,
  });

  const initializedModelRef = React.useRef<TModel | null>(null);

  const useModel = (initialModel: TModel) => {
    React.useEffect(() => {
      const previousModel = initializedModelRef.current;

      if (previousModel && areModelsEqual(previousModel, initialModel)) {
        return;
      }

      initializedModelRef.current = initialModel;
      dispatch({ type: "initialize", model: initialModel });
    }, [initialModel]);
  };

  const updateModel = React.useCallback((nextPatch: Updater<TModel>) => {
    dispatch({ type: "update", patch: nextPatch });
  }, []);

  const getUpdatedModel = React.useCallback((): TModel => {
    return state.current;
  }, [state]);

  const resetModel = React.useCallback(() => {
    dispatch({ type: "reset" });
  }, []);

  const isModified = React.useMemo((): boolean => {
    return !areModelsEqual(state.current, state.original);
  }, [state]);

  return {
    state: state.current,
    originalState: state.original,
    isModified,
    useModel,
    updateModel,
    getUpdatedModel,
    resetModel,
  } satisfies UseFormReducerResult<TModel>;
};

export const useReducer = <TModel extends Record<string, unknown>>() => {
  const formState = useFormReducer<TModel>();

  return [
    formState.state,
    formState.updateModel,
    formState.isModified,
  ] as const;
};
