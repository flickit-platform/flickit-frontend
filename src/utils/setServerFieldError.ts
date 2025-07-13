import { FieldErrorData } from "@/types";
import { ICustomError } from "./CustomError";
import { UseFormReturn } from "react-hook-form";

const setServerFieldErrors = (e: unknown, formMethods: UseFormReturn<any>) => {
  const { response, status } = e as ICustomError;
  if (status !== 400 || !response?.data) {
    return;
  }

  const responseData = response.data as FieldErrorData;

  Object.keys(responseData).forEach((key, index) => {
    if (key === "non_field_errors") {
      return;
    }
    formMethods.setError(
      key,
      { message: responseData[key][0], type: "server" },
      index === 0 ? { shouldFocus: true } : undefined,
    );
  });
};

export default setServerFieldErrors;
