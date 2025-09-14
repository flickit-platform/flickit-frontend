import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import { Trans } from "react-i18next";

type OutlinedProgressButtonProps = {
  to?: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  progressPercent?: number;
  fillColor?: string;
  state?: any;
  fullWidth?: boolean;
  variant?: "outlined" | "contained";
  startIcon?: React.ReactNode;
  sx?: any;
  onClick?: (
    event:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => void;
  [key: string]: any;
};

const OutlinedProgressButton: React.FC<OutlinedProgressButtonProps> = ({
  to,
  label,
  icon,
  progressPercent = 0,
  fillColor,
  state,
  onClick,
  fullWidth = true,
  variant = "outlined",
  startIcon,
  sx,
  ...props
}) => {
  const percent = Math.max(0, Math.min(progressPercent, 100));
  const progressFill = fillColor ?? "rgba(102, 128, 153, 0.3)";

  return (
    <Button
      component={to ? Link : "span"}
      to={to}
      state={state}
      fullWidth={fullWidth}
      startIcon={icon ?? startIcon}
      data-cy="assessment-card-btn"
      variant={variant}
      sx={{
        position: "relative",
        zIndex: 1,
        ...sx,
      }}
      onClick={onClick}
      {...props}
    >
      {variant === "outlined" && percent > 0 && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            bgcolor: progressFill,
            zIndex: -1,
            width: `${percent}%`,
            transition: "all 1s ease-in-out",
          }}
        />
      )}
      <Trans i18nKey={String(label)} />
    </Button>
  );
};

export default OutlinedProgressButton;
