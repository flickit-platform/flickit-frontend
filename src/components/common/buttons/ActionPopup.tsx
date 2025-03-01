import { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Popper,
  Paper,
  ClickAwayListener,
  Tooltip,
  Grid,
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
  const [placement, setPlacement] = useState<"top" | "bottom">("bottom");
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [popperPosition, setPopperPosition] = useState({ top: 0, left: 0 });

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
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open && anchorRef.current) {
      const anchorRect = anchorRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - anchorRect.bottom;
      const spaceAbove = anchorRect.top;

      if (spaceBelow < 200 && spaceAbove > 200) {
        setPlacement("top");
        setPopperPosition({
          top: anchorRect.top + window.scrollY - 200,
          left: anchorRect.left + window.scrollX,
        });
      } else {
        setPlacement("bottom");
        setPopperPosition({
          top: anchorRect.bottom + window.scrollY,
          left: anchorRect.left + window.scrollX,
        });
      }
    }
  }, [open]);

  useEffect(() => {
    const handleScroll = () => {
      if (open && anchorRef.current) {
        const anchorRect = anchorRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - anchorRect.bottom;
        const spaceAbove = anchorRect.top;

        if (spaceBelow < 200 && spaceAbove > 200) {
          setPlacement("top");
          setPopperPosition({
            top: anchorRect.top + window.scrollY - 200,
            left: anchorRect.left + window.scrollX,
          });
        } else {
          setPlacement("bottom");
          setPopperPosition({
            top: anchorRect.bottom + window.scrollY,
            left: anchorRect.left + window.scrollX,
          });
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [open]);

  return (
    <Box>
      <Button
        ref={anchorRef}
        variant="outlined"
        color={colorScheme.muiColor}
        onClick={handleToggle}
        sx={{
          display: "flex",
          minWidth: "220px",
          justifyContent: "space-between",
          backgroundColor: colorScheme.light,
          borderRadius:
            placement === "bottom" && open
              ? "16px 16px 0px 0px"
              : placement === "top" && open
              ? "0px 0px 16px 16px"
              : "16px",
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
        placement={placement}
        sx={{
          zIndex: 1,
          width: anchorRef.current?.offsetWidth,
          minWidth: "220px",
          position: "fixed",
          top: popperPosition.top,
          left: popperPosition.left,
        }}
      >
        <ClickAwayListener onClickAway={handleClose}>
          {confirmDialog ? (
            <Paper
              sx={{
                padding: "10px 16px 16px 16px",
                backgroundColor: colorScheme.light,
                border: `1px solid ${colorScheme.main}`,
                borderRadius:
                  placement === "bottom" ? "0px 0px 16px 16px" : "16px 16px 0px 0px",
                boxShadow: "none",
              }}
            >
              <Typography
                color={colorScheme.muiColor}
                textAlign="justify"
                sx={{ ...theme.typography.bodySmall, color: colorScheme.main }}
                mb={1}
              >
                {texts.confirmMessage}
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={7.5}>
                  <LoadingButton
                    variant="contained"
                    color={colorScheme.muiColor}
                    onClick={(event) => {
                      onPrimaryAction(event);
                      handleConfirmClose();
                      setOpen(false);
                    }}
                    loading={loadingPrimary}
                    fullWidth
                    size="small"
                  >
                    {texts.primaryAction}
                  </LoadingButton>
                </Grid>
                <Grid item xs={12} sm={4}>
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
                </Grid>
              </Grid>
            </Paper>
          ) : (
            <Paper
              sx={{
                padding: "10px 16px 16px 16px",
                backgroundColor: colorScheme.light,
                border: `1px solid ${colorScheme.main}`,
                borderRadius:
                  placement === "bottom" ? "0px 0px 16px 16px" : "16px 16px 0px 0px",
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
                    onClick={(event) => {
                      onSecondaryAction(event);
                      setOpen(false);
                    }}
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