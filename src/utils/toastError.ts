import { toast, ToastOptions } from "react-toastify";
import { AxiosError } from "axios";
import { ECustomErrorType } from "@/types/index";
import { ICustomError } from "./CustomError";
import { t } from "i18next";
import { ReactNode } from "react";

export interface IToastOptions {
  /**
   * Show toast of this type. Default: 'error'
   */
  variant?: "error" | "success" | "info" | "warning";
  /**
   * Don't show toast if status is one of
   */
  filterByStatus?: number[];
  /**
   * Don't show toast if its type is one of
   */
  filterByType?: ECustomErrorType[];
  /**
   * Don't show toast if it has any data
   */
  filterIfHasData?: boolean;
  /**
   * Toast options from react-toastify
   */
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

  // Simple success usage: showToast('عملیات موفق بود', { variant: 'success' })
  if (typeof err === "string" && variant !== "error") {
    toast[variant](err, toastOptions);
    return;
  }

  if (typeof err === "boolean" && err) {
    showToast(t("errors.someThingWentWrong"))
    return;
  }
  if (typeof err === "string") {
    showToast(err)
    return;
  }

  if (!err) {
    return;
  }

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
    if (filterByStatus.includes(status)) {
      return;
    }
  }

  if (filterByType.length > 0 && type) {
    if (filterByType.includes(type)) {
      return;
    }
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
