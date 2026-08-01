import React from "react";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useCore } from "../../hooks/useCore";

type Address = {
  street: string;
  houseNumber: number | null;
};

type Person = {
  firstName: string;
  lastName: string;
  age: number | null;
  isAdmin: boolean;
  address: Address;
};

const initialModel: Person = {
  firstName: "Manuel",
  lastName: "Peise",
  age: 46,
  isAdmin: false,
  address: {
    street: "Zossener Straße",
    houseNumber: 165,
  },
};

const SandBox: React.FC = () => {
  const personForm = useCore.createForm<Person>((factory) => [
    factory.createStringFormField("firstName", "First Name", true),
    factory.createStringFormField(
      "lastName",
      "Last Name",
      true,
      false,
      false,
      "Last name is required",
      (value) => typeof value === "string" && value.length > 0,
    ),
    factory.createNumberFormField(
      "age",
      "Age",
      true,
      false,
      "Age must be a number",
      (value) => typeof value === "number" && value > 0,
    ),
    factory.createBooleanFormField(
      "isAdmin",
      "Is Admin",
      true,
      false,
      "Is Admin must be a boolean",
      (value) => typeof value === "boolean" && value === true,
    ),
  ]);

  const addressForm = personForm.createPartialForm<Address>(
    "address",
    (factory) => [
      factory.createStringFormField("street", "Street", true),
      factory.createNumberFormField(
        "houseNumber",
        "House Number",
        true,
        false,
        "House number must be a number",
        (value) => typeof value === "number" && value >= 0,
      ),
    ],
  );

  personForm.useModel(initialModel);
  addressForm.useModel(initialModel.address);

  const handleReset = React.useCallback(() => {
    personForm.resetForm();
    addressForm.resetForm();
  }, [addressForm, personForm]);

  const PersonTextField = personForm.components.ListItemTextField;
  const PersonNumberField = personForm.components.ListItemNumberField;
  const PersonSwitchField = personForm.components.ListItemSwitchField;
  const AddressTextField = addressForm.components.ListItemTextField;
  const AddressNumberField = addressForm.components.ListItemNumberField;

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3} sx={{ maxWidth: 760 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Sandbox Form
          </Typography>
          <Typography color="text.secondary">
            Main form with a nested partial address form.
          </Typography>
        </Box>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h6">Person</Typography>
            {personForm.fields.map((field) => {
              const onChange = (
                key: keyof Person,
                value: Person[keyof Person],
              ) => {
                personForm.updateModel({ [key]: value } as Partial<Person>);
              };

              if (field.type === "number") {
                return (
                  <PersonNumberField
                    key={field.propertyName as string}
                    {...field}
                    value={personForm.model[field.propertyName]}
                    onChange={onChange}
                  />
                );
              }
              if (field.type === "boolean") {
                return (
                  <PersonSwitchField
                    key={field.propertyName as string}
                    {...field}
                    value={personForm.model[field.propertyName]}
                    onChange={onChange}
                  />
                );
              }

              return (
                <PersonTextField
                  key={field.propertyName as string}
                  {...field}
                  value={personForm.model[field.propertyName]}
                  isPassword={field.type === "password"}
                  onChange={onChange}
                />
              );
            })}
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h6">Address</Typography>
            {addressForm.fields.map((field) => {
              const onChange = (
                key: keyof Partial<Address>,
                value: Partial<Address>[keyof Partial<Address>],
              ) => {
                addressForm.updateModel({ [key]: value } as Partial<Address>);
              };

              if (field.type === "number") {
                return (
                  <AddressNumberField
                    key={field.propertyName as string}
                    {...field}
                    value={addressForm.model[field.propertyName]}
                    onChange={onChange}
                  />
                );
              }

              return (
                <AddressTextField
                  key={field.propertyName as string}
                  {...field}
                  value={addressForm.model[field.propertyName]}
                  isPassword={field.type === "password"}
                  onChange={onChange}
                />
              );
            })}
          </Stack>
        </Paper>

        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleReset}>
            Reset
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              const updatedModel = personForm.getUpdatedModel();
              // eslint-disable-next-line no-console
              console.log(updatedModel);
            }}
          >
            Log Model
          </Button>
        </Stack>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="subtitle1">State</Typography>
          <Typography variant="body2">
            Person modified: {personForm.isModified ? "true" : "false"}
          </Typography>
          <Typography variant="body2">
            Address modified: {addressForm.isModified ? "true" : "false"}
          </Typography>
        </Paper>
      </Stack>
    </Box>
  );
};

export default SandBox;
