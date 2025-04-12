import { DialogProps } from "@mui/material/Dialog";

export interface IDialogProps extends DialogProps {
  onClose: () => void;
  onSubmitForm?: (args?: any) => void;
  openDialog?: any;
  context?: IDialogContext;
}

export interface IDialogContext {
  type: string;
  data?: any;
  staticData?: any;
  onSubmit?: (...args: any) => any;
  getViewLink?: (data: any) => string;
}

export type TDialogContextType = "update" | "create" | "convert";

