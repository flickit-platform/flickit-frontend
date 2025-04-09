import { ToastOptions } from "react-toastify";

export type TToastConfig = ToastOptions & {
  message: string | JSX.Element;
};

