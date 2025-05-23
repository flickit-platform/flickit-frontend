import React, { PropsWithChildren } from "react";
import { FormProvider } from "react-hook-form";

interface IFormProviderWithFormProps
  extends React.DetailedHTMLProps<
    React.FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  > {
  formMethods: any;
}

const FormProviderWithForm = (
  props: PropsWithChildren<IFormProviderWithFormProps>,
) => {
  const { formMethods, onSubmit, ...rest } = props;
  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={onSubmit}
        style={{ flex: 1, display: "flex", flexDirection: "column" }}
        {...rest}
      ></form>
    </FormProvider>
  );
};

export default FormProviderWithForm;
