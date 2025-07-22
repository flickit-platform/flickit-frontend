import { toast, ToastOptions } from "react-toastify";
import { AxiosError } from "axios";
import { ECustomErrorType } from "@/types/index";
import { ICustomError } from "./CustomError";
import { t } from "i18next";
import React, { ReactNode } from "react";

export interface IToastOptions {
  variant?: "error" | "success" | "info" | "warning";
  filterByStatus?: number[];
  filterByType?: ECustomErrorType[];
  filterIfHasData?: boolean;
  toastOptions?: ToastOptions;
}

type ToastInput = ICustomError | AxiosError | string | true | ReactNode;

const showToast = (
  err: ToastInput,
  options?: IToastOptions,
) => {
  const {
    variant = "error",
    filterByStatus = [],
    filterByType = [],
    filterIfHasData = true,
    toastOptions = {},
  } = options ?? {};

  if (typeof err === "string" || React.isValidElement(err)) {
    toast[variant](err, toastOptions);
    return;
  }
  if (typeof err === "boolean" && err) {
    toast.error(t("errors.someThingWentWrong") as string, toastOptions);
    return;
  }
  if (!err) return;

  let status: number | undefined;
  let data: any;
  let type: ECustomErrorType | undefined;
  let message: string | undefined;

  if ((err as AxiosError).isAxiosError) {
    const axiosError = err as AxiosError;
    status = axiosError.response?.status;
    data = axiosError.response?.data;
    type = axiosError.code as ECustomErrorType;
    message = axiosError.message;
  } else {
    const customError = err as ICustomError;
    status = customError.response?.status;
    data = customError.response?.data;
    type = customError.code as ECustomErrorType;
    message = customError.message;
  }

  if (filterByStatus.length > 0 && status) {
    if (filterByStatus.includes(status)) return;
  }

  if (filterByType.length > 0 && type) {
    if (filterByType.includes(type)) return;
  }

  if (filterIfHasData) {
    if (
      typeof data === "object" &&
      data !== null &&
      Object.keys(data).length > 0 &&
      !data?.message &&
      !data?.error &&
      !data?.detail &&
      data?.non_field_errors?.length >= 0
    ) {
      return;
    }
  }

  if (
    status === 401 ||
    type === ECustomErrorType.INVALID_TOKEN ||
    type === ECustomErrorType.CANCELED ||
    type === undefined
  ) {
    return;
  }

  const toastMessage =
    data?.error ??
    data?.message ??
    data?.detail ??
    data?.non_field_errors?.[0] ??
    message ??
    t("errors.someThingWentWrong");

  toast[variant](toastMessage, toastOptions);
};

export default showToast;
