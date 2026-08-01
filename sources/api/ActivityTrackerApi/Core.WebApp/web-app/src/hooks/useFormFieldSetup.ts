import React from "react";

type FormSetupProps<TModel> = {
  propertyName: keyof TModel;
  data: TModel[keyof TModel];
  isRequired: boolean;
};

export const useFormFieldSetup = <TModel>(
  model: TModel,
  properties?: (keyof TModel)[],
  requiredProperties?: (keyof TModel)[],
): FormSetupProps<TModel>[] => {
  const formSetup: FormSetupProps<TModel>[] = [];

  if (properties) {
    properties.forEach((property) => {
      formSetup.push({
        propertyName: property,
        data: model[property],
        isRequired: requiredProperties?.includes(property) ?? true,
      });
    });
  } else {
    for (const property in model) {
      if (Object.prototype.hasOwnProperty.call(model, property)) {
        formSetup.push({
          propertyName: property as keyof TModel,
          data: model[property as keyof TModel],
          isRequired:
            requiredProperties?.includes(property as keyof TModel) ?? true,
        });
      }
    }
  }

  return formSetup;
};
