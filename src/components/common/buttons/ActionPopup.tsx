import { useState, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Popper,
  Paper,
  ClickAwayListener,
  Tooltip,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { ExpandLessOutlined, ExpandMoreOutlined } from "@mui/icons-material";
import { theme } from "@/config/theme";

interface ActionPopupProps {
  status: "default" | "pending" | "approved" | "expired";
  hidePrimaryButton?: boolean;
  disablePrimaryButton?: boolean;
  disablePrimaryButtonText?: string;
  onPrimaryAction: (event: any) => void;
  loadingPrimary: boolean;
  onSecondaryAction: (event: any) => void;
  loadingSecondary?: boolean;
  colorScheme: {
    main: string;
    light: string;
    muiColor: "primary" | "success" | "error";
  };
  texts: {
    buttonLabel: string | JSX.Element;
    description: string;
    primaryAction: string;
    secondaryAction: string;
    confirmMessage: string;
    cancelMessage: string;
  };
}

const ActionPopup = ({
  status,
  hidePrimaryButton,
  disablePrimaryButton,
  disablePrimaryButtonText,
  onPrimaryAction,
  loadingPrimary,
  onSecondaryAction,
  loadingSecondary = false,
  colorScheme,
  texts,
}: ActionPopupProps) => {
  const [open, setOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const anchorRef = useRef<HTMLButtonElement | null>(null);

  const handleToggle = () => setOpen((prev) => !prev);
  const handleClose = (event: any) => {
    if (anchorRef.current?.contains(event.target)) return;
    setOpen(false);
  };
  const handleConfirmClose = () => setConfirmDialog(false);

  const handlePrimaryAction = (event: any) => {
    if (status !== "default") {
      setConfirmDialog(true);
    } else {
      onPrimaryAction(event);
      handleConfirmClose();
    }
  };
  return (
    <Box>
      <Button
        ref={anchorRef}
        variant="outlined"
        color={colorScheme.muiColor}
        onClick={handleToggle}
        sx={{
          width: "345px",
          justifyContent: "space-between",
          backgroundColor: colorScheme.light,
          borderRadius: open ? "0px" : "16px",
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          borderColor: colorScheme.main,
          color: colorScheme.main,
          "&:hover": {
            backgroundColor: colorScheme.light,
            borderColor: colorScheme.main,
          },
        }}
        endIcon={open ? <ExpandLessOutlined /> : <ExpandMoreOutlined />}
      >
        {texts.buttonLabel}
      </Button>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom"
        sx={{ zIndex: 1, width: "345px" }}
      >
        <ClickAwayListener onClickAway={handleClose}>
          {confirmDialog ? (
            <Paper
              sx={{
                padding: 2,
                backgroundColor: colorScheme.light,
                border: `1px solid ${colorScheme.main}`,
                borderRadius: "0px",
                borderBottomLeftRadius: "16px",
                borderBottomRightRadius: "16px",
                boxShadow: "none",
              }}
            >
              <Typography
                color={colorScheme.muiColor}
                textAlign="justify"
                sx={{ ...theme.typography.bodySmall, color: colorScheme.main }}
                mb={1}
              >
                {" "}
                {texts.confirmMessage}
              </Typography>
              <Box sx={{ display: "flex", gap: "10px", marginTop: 2 }}>
                <LoadingButton
                  variant="contained"
                  color={colorScheme.muiColor}
                  onClick={(event) => {
                    onPrimaryAction(event);
                    handleConfirmClose();
                  }}
                  loading={loadingPrimary}
                  fullWidth
                  size="small"
                >
                  {texts.primaryAction}
                </LoadingButton>
                <Button
                  variant="outlined"
                  color={colorScheme.muiColor}
                  onClick={handleConfirmClose}
                  fullWidth
                  sx={{ backgroundColor: "white" }}
                  size="small"
                >
                  {texts.cancelMessage}
                </Button>
              </Box>
            </Paper>
          ) : (
            <Paper
              sx={{
                padding: 2,
                backgroundColor: colorScheme.light,
                border: `1px solid ${colorScheme.main}`,
                borderRadius: "0px",
                borderTop: "0px",
                borderBottomLeftRadius: "16px",
                borderBottomRightRadius: "16px",
                boxShadow: "none",
              }}
            >
              <Typography
                color={colorScheme.muiColor}
                textAlign="justify"
                sx={{ ...theme.typography.bodySmall, color: colorScheme.main }}
                mb={1}
              >
                {texts.description}
              </Typography>

              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
              >
                {(status === "pending" || status === "expired") && (
                  <LoadingButton
                    loading={loadingSecondary}
                    variant="outlined"
                    color={colorScheme.muiColor}
                    onClick={(event) => onSecondaryAction(event)}
                    fullWidth
                    sx={{ backgroundColor: "white" }}
                    size="small"
                  >
                    {texts.secondaryAction}
                  </LoadingButton>
                )}
                {!hidePrimaryButton && (
                  <Tooltip
                    disableHoverListener={!disablePrimaryButton}
                    title={disablePrimaryButtonText}
                  >
                    <div>
                      <LoadingButton
                        variant="outlined"
                        color={colorScheme.muiColor}
                        onClick={(event) => {
                          handlePrimaryAction(event);
                        }}
                        loading={loadingPrimary}
                        fullWidth
                        sx={{ backgroundColor: "white" }}
                        size="small"
                        disabled={disablePrimaryButton}
                      >
                        {texts.primaryAction}
                      </LoadingButton>
                    </div>
                  </Tooltip>
                )}
              </Box>
            </Paper>
          )}
        </ClickAwayListener>
      </Popper>
    </Box>
  );
};

export default ActionPopup;
