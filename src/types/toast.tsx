import { ReactElement } from "react";
import { ToastOptions } from "react-toastify";

export type TToastConfig = ToastOptions & {
  message: string | ReactElement;
};

