import React from "react";
import {
  createFormFieldFactory,
  FormField,
  FormFieldFactory,
} from "../lib/factories/formFieldFactory";
import { formFields } from "../lib/form/form";
import { Updater, useFormReducer } from "./useFormReducer";

type FormSetup<TModel extends Record<string, unknown>> =
  | FormField<TModel>[]
  | ((factory: FormFieldFactory<TModel>) => FormField<TModel>[]);

export type Form<TModel extends Record<string, unknown>> = {
  components: typeof formFields;
  fields: FormField<TModel>[];
  model: TModel;
  isModified: boolean;
  useModel: (initialModel: TModel) => void;
  updateModel: (nextPatch: Updater<TModel>) => void;
  getUpdatedModel: () => TModel;
  resetForm: () => void;
  createPartialForm: <TPartialModel extends Record<string, unknown>>(
    parentPropertyName: keyof TModel,
    setup: FormSetup<Partial<TPartialModel>>,
  ) => Form<Partial<TPartialModel>>;
};

const resolveFields = <TModel extends Record<string, unknown>>(
  setup: FormSetup<TModel>,
  factory: FormFieldFactory<TModel>,
): FormField<TModel>[] => {
  return setup instanceof Function ? setup(factory) : setup;
};

const useBuiltForm = <TModel extends Record<string, unknown>>(
  setup: FormSetup<TModel>,
): Form<TModel> => {
  const factory = createFormFieldFactory<TModel>();
  const fields = resolveFields(setup, factory);
  const formState = useFormReducer<TModel>();

  const usePartialForm = <TPartialModel extends Record<string, unknown>>(
    parentPropertyName: keyof TModel,
    partialSetup: FormSetup<Partial<TPartialModel>>,
  ): Form<Partial<TPartialModel>> => {
    const partialForm = useBuiltForm<Partial<TPartialModel>>(partialSetup);

    const updateModel = (nextPatch: Updater<Partial<TPartialModel>>) => {
      const patch =
        typeof nextPatch === "function"
          ? nextPatch(partialForm.model)
          : nextPatch;

      const nextModel = {
        ...partialForm.model,
        ...patch,
      } as Partial<TPartialModel>;

      partialForm.updateModel(patch);
      formState.updateModel({
        [parentPropertyName]: nextModel,
      } as Partial<TModel>);
    };

    const useModel = (initialModel: Partial<TPartialModel>) => {
      partialForm.useModel(initialModel);
      React.useEffect(() => {
        formState.updateModel({
          [parentPropertyName]: initialModel,
        } as Partial<TModel>);
      }, [initialModel]);
    };

    return {
      ...partialForm,
      useModel,
      updateModel,
    };
  };

  return {
    components: formFields,
    fields,
    model: formState.state,
    isModified: formState.isModified,
    useModel: formState.useModel,
    updateModel: formState.updateModel,
    getUpdatedModel: formState.getUpdatedModel,
    resetForm: formState.resetModel,
    createPartialForm: usePartialForm,
  };
};

const useForm = <TModel extends Record<string, unknown>>(
  setup: FormSetup<TModel>,
): Form<TModel> => {
  return useBuiltForm(setup);
};

const usePartialForm = <TModel extends Record<string, unknown>>(
  setup: FormSetup<Partial<TModel>>,
): Form<Partial<TModel>> => {
  return useBuiltForm<Partial<TModel>>(setup);
};

export const useCore = {
  createForm: useForm,
  createPartialForm: usePartialForm,
};
