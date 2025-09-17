import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import useDialog from "@/hooks/useDialog";
import { IDialogProps } from "@/types/index";

export interface IRichEditorMenuItem {
  icon?: JSX.Element;
  title: string;
  action?: (props: IDialogProps) => any;
  isActive?: () => boolean;
  type?: "divider";
  disable?: boolean;
  prompt?: {
    title: string;
    promptBody: (closeModal: () => void) => JSX.Element;
  };
}

interface IRichEditorMenuItemProps {
  menuItem: IRichEditorMenuItem;
}

const RichEditorMenuItem = (props: IRichEditorMenuItemProps) => {
  const {
    menuItem: { icon, title, action, isActive = false, prompt, disable },
  } = props;

  const dialogProps = useDialog();

  return (
    <>
      <Button
        id={`proseMirror-menu-btn`}
        sx={{
          minWidth: "34px",
          minHeight: "34px",
          m: 0.1,
          mx: 0,
          color: "GrayText",
          bgcolor: isActive && isActive() ? "#dddddd" : undefined,
          "&:hover": {
            bgcolor: isActive && isActive() ? "#cccccc" : undefined,
          },
        }}
        disabled={disable}
        size="small"
        type="button"
        onClick={(e) => {
          action?.(dialogProps);
        }}
        title={title}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {icon ?? title}
      </Button>
      {prompt && <PromptForm {...dialogProps} prompt={prompt} />}
    </>
  );
};

const PromptForm = (
  props: IDialogProps & {
    prompt: {
      title: string;
      promptBody: (closeModal: () => void) => JSX.Element;
    };
  },
) => {
  const { onClose, open, prompt } = props;
  const { promptBody, title } = prompt;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      {promptBody(onClose)}
    </Dialog>
  );
};

export default RichEditorMenuItem;
