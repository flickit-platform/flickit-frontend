import { t } from "i18next";
import { FieldErrorsImpl } from "react-hook-form";
import { Trans } from "react-i18next";

export type TFieldKind = "email" | "url" | "phone";

export const FIELD_PATTERNS: Record<TFieldKind, RegExp> = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  url: /^(https?:\/\/)?([\w.-]+\.[a-zA-Z]{2,})(\/\S*)?$/,
  phone: /^\+?[\d\s\-()]{7,}$/,
};

type TErrorTypes =
  | "disabled"
  | "required"
  | "pattern"
  | "onBlur"
  | "onChange"
  | "value"
  | "min"
  | "max"
  | "maxLength"
  | "minLength"
  | "validate"
  | "valueAsNumber"
  | "valueAsDate"
  | "setValueAs"
  | "shouldUnregister"
  | "deps";

type TErrorMessagesBaseOnErrorTypes = Partial<Record<TErrorTypes, JSX.Element>>;

const getFieldError = (
  errors: FieldErrorsImpl<{ [x: string]: any }>,
  name: string,
  minLength?: number,
  maxLength?: number,
  lng?: string,
) => {
  const error = errors?.[name];
  const hasError = !!error?.type;

  const errorMessagesBaseOnErrorTypes: TErrorMessagesBaseOnErrorTypes = {
    required: t("errors.requiredFieldError", { lng }) as any,
    minLength: (
      <Trans
        i18nKey="errors.minLengthFieldError"
        values={{ length: minLength ?? "8" }}
      />
    ),
    maxLength: (
      <Trans
        i18nKey="errors.maxLengthFieldError"
        values={{ length: maxLength ?? "8" }}
      />
    ),
  };

  if (error?.type === "pattern") {
    switch (name) {
      case "email":
        errorMessagesBaseOnErrorTypes.pattern = t("errors.invalidEmail", {
          lng,
        }) as any;
        break;
      case "url":
        errorMessagesBaseOnErrorTypes.pattern = t("errors.invalidUrl", {
          lng,
        }) as any;
        break;
      case "phone":
        errorMessagesBaseOnErrorTypes.pattern = t("errors.invalidPhone", {
          lng,
        }) as any;
        break;
      default:
        if (error?.message) {
          errorMessagesBaseOnErrorTypes.pattern = error.message as any;
        }
    }
  }

  const errorMessage =
    errorMessagesBaseOnErrorTypes[error?.type as TErrorTypes] ?? error?.message;

  return { hasError, errorMessage };
};

export default getFieldError;
