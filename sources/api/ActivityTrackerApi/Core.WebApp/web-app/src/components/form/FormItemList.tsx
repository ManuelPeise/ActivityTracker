import React, { PropsWithChildren } from "react";
import FormContainer, { FormButtonProps } from "./FormContainer";
import { Stack } from "@mui/material";

type FormItemListProps = PropsWithChildren & {
  title: string;
  subtitle?: string;
  minWidth?: string;
  formButtonProps: FormButtonProps[];
};
const FormItemList: React.FC<FormItemListProps> = (props) => {
  const { title, subtitle, minWidth, children, formButtonProps } = props;

  return (
    <FormContainer
      title={title}
      subtitle={subtitle}
      minWidth={minWidth}
      formButtonProps={formButtonProps}
    >
      <Stack
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
        }}
      >
        {children}
      </Stack>
    </FormContainer>
  );
};

export default FormItemList;
