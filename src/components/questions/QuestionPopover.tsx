import Popover, { PopoverProps } from "@mui/material/Popover";
import { PropsWithChildren } from "react";

interface IQuestionPopoverProps extends PopoverProps {}

const QuestionPopover = (props: PropsWithChildren<IQuestionPopoverProps>) => {
  const { children, ...rest } = props;

  return (
    <Popover
      {...rest}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      {children}
    </Popover>
  );
};

export { QuestionPopover };
