import React, { PropsWithChildren } from "react";
import FormContainer, { FormButtonProps } from "./FormContainer";
import { List } from "@mui/material";

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
      <List
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          width: "100%",
        }}
      >
        {children}
      </List>
    </FormContainer>
  );
};

export default FormItemList;
