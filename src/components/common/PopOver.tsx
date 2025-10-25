import * as React from "react";
import Popover, { PopoverProps } from "@mui/material/Popover";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Text } from "./Text";

export type GenericPopoverTitleProps = {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  onClose?: () => void;
  direction?: "rtl" | "ltr";
  sx?: any;
};

export function GenericPopoverTitle({
  children,
  icon,
  onClose,
  direction = "rtl",
  sx,
}: GenericPopoverTitleProps) {
  const start = direction === "rtl" ? "row-reverse" : "row";
  return (
    <Box
      color="primary.contrastText"
      py={1}
      px={2}
      bgcolor="primary.main"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        ...sx,
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexDirection: start,
          }}
        >
          {icon ? <Box sx={{ display: "inline-flex" }}>{icon}</Box> : null}
          <Text variant="semiBoldLarge">{children}</Text>
        </Box>
      </Box>

      {onClose ? (
        <IconButton
          onClick={onClose}
          edge="end"
          aria-label="close"
          sx={{
            ml: direction === "rtl" ? 0 : 1,
            mr: direction === "rtl" ? 1 : 0,
          }}
          color="inherit"
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      ) : null}
    </Box>
  );
}

type GenericPopoverBase = {
  header?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  PaperProps?: PopoverProps["PaperProps"];
  anchorOrigin?: PopoverProps["anchorOrigin"];
  transformOrigin?: PopoverProps["transformOrigin"];
  hideBackdrop?: boolean;
  direction?: "rtl" | "ltr";
  dividerBelowHeader?: boolean;
  id?: string;
};

type GenericPopoverControlled = {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
};

export type GenericPopoverProps = GenericPopoverBase & GenericPopoverControlled;

export function GenericPopover({
  open,
  anchorEl,
  onClose,
  header,
  title,
  subtitle,
  children,
  actions,
  PaperProps,
  anchorOrigin = { vertical: "bottom", horizontal: "center" },
  transformOrigin = { vertical: "top", horizontal: "center" },
  direction,
  dividerBelowHeader = true,
  id,
  ...rest
}: GenericPopoverProps) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      PaperProps={{ sx: { borderRadius: 2 }, ...PaperProps }}
      sx={{ direction }}
      aria-labelledby={headingId}
      {...rest}
    >
      <ClickAwayListener onClickAway={onClose}>
        <Box sx={{ maxWidth: 360 }}>
          {/* Header / Title */}
          {header ? (
            <Box>{header}</Box>
          ) : title ? (
            <GenericPopoverTitle direction={direction} onClose={onClose}>
              {/* aria-labelledby */}
              <span id={headingId as string}>{title}</span>
            </GenericPopoverTitle>
          ) : null}
          {dividerBelowHeader && (header || title) ? <Divider /> : null}
          <Box sx={{ p: 2 }}>
            {/* Content */}
            {children ? <Box>{children}</Box> : null}

            {/* Actions */}
            {actions ? (
              <Box
                sx={{
                  mt: 1.5,
                  display: "flex",
                  gap: 1,
                  justifyContent: "flex-end",
                }}
              >
                {actions}
              </Box>
            ) : null}
          </Box>
        </Box>
      </ClickAwayListener>
    </Popover>
  );
}
