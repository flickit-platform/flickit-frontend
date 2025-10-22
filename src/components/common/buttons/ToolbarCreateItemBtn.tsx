import Button, { ButtonProps } from "@mui/material/Button";
import useScreenResize from "@/hooks/useScreenResize";
import { animations } from "@styles";
import { Trans } from "react-i18next";
import { ReactNode } from "react";

interface IToolbarCreateItemBtnProps extends ButtonProps {
  icon?: ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  shouldAnimate?: boolean;
  text: string | ReactNode;
  minWidth?: string;
  variantType?: "text" | "outlined" | "contained";
}

export const ToolbarCreateItemBtn = (props: IToolbarCreateItemBtnProps) => {
  const {
    icon,
    shouldAnimate,
    onClick,
    text,
    minWidth,
    variantType = "contained",
    ...rest
  } = props;
  const isSmallScreen = useScreenResize("sm");

  return (
    <Button
      {...rest}
      size="small"
      endIcon={icon}
      onClick={onClick}
      variant={variantType}
      sx={{
        mb: "1px",
        minWidth: isSmallScreen ? undefined : minWidth,
        animation: shouldAnimate
          ? `${animations.pomp} 1.6s infinite cubic-bezier(0.280, 0.840, 0.420, 1)`
          : undefined,
        "&:hover": {
          animation: `${animations.noPomp}`,
        },
        ...rest.sx,
      }}
    >
      {typeof text === "string" ? <Trans i18nKey={text} /> : text}
    </Button>
  );
};
