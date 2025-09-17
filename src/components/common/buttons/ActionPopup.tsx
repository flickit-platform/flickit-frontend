import { useState, useRef, useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import LoadingButton from "@mui/lab/LoadingButton";
import ExpandMoreOutlined from "@mui/icons-material/ExpandMoreOutlined";
import ExpandLessOutlined from "@mui/icons-material/ExpandLessOutlined";

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
    confirmButtonLabel: string;
    cancelButtonLabel: string;
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
  const [popperPosition, setPopperPosition] = useState({ top: 0, left: 0 });
  const anchorRef = useRef<HTMLButtonElement | null>(null);

  const togglePopup = () => setOpen((prev) => !prev);
  const closePopup = (event: any) => {
    if (!anchorRef.current?.contains(event.target)) setOpen(false);
  };
  const closeConfirmDialog = () => setConfirmDialog(false);

  const handlePrimaryAction = (event: any) => {
    if (status !== "default") {
      setConfirmDialog(true);
    } else {
      onPrimaryAction(event);
      setOpen(false);
    }
  };

  const updatePopperPosition = () => {
    if (!open || !anchorRef.current) return;

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
  };

  useEffect(updatePopperPosition, [open]);
  useEffect(() => {
    window.addEventListener("scroll", updatePopperPosition);
    window.addEventListener("resize", updatePopperPosition);
    return () => {
      window.removeEventListener("scroll", updatePopperPosition);
      window.removeEventListener("resize", updatePopperPosition);
    };
  }, [open]);

  const borderRadiusValue = useMemo(() => {
    if (!open) return "16px";
    return placement === "bottom" ? "16px 16px 0px 0px" : "0px 0px 16px 16px";
  }, [open, placement]);

  return (
    <Box>
      <Button
        ref={anchorRef}
        variant="outlined"
        color={colorScheme.muiColor}
        onClick={togglePopup}
        sx={{
          display: "flex",
          minWidth: "260px",
          justifyContent: "space-between",
          backgroundColor: colorScheme.light,
          borderRadius: borderRadiusValue,
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
          minWidth: "210px",
          position: "fixed",
          top: popperPosition.top,
          left: popperPosition.left,
        }}
      >
        <ClickAwayListener onClickAway={closePopup}>
          <Paper
            sx={{
              padding: "10px 16px 16px",
              backgroundColor: colorScheme.light,
              border: `1px solid ${colorScheme.main}`,
              borderRadius:
                placement === "bottom" ? "0 0 16px 16px" : "16px 16px 0 0",
              boxShadow: "none",
            }}
          >
            {confirmDialog ? (
              <ConfirmDialog
                texts={texts}
                colorScheme={colorScheme}
                loadingPrimary={loadingPrimary}
                onPrimaryAction={onPrimaryAction}
                closeConfirmDialog={closeConfirmDialog}
                setOpen={setOpen}
              />
            ) : (
              <ActionContent
                status={status}
                hidePrimaryButton={hidePrimaryButton}
                disablePrimaryButton={disablePrimaryButton}
                disablePrimaryButtonText={disablePrimaryButtonText}
                loadingPrimary={loadingPrimary}
                loadingSecondary={loadingSecondary}
                texts={texts}
                colorScheme={colorScheme}
                onPrimaryAction={handlePrimaryAction}
                onSecondaryAction={onSecondaryAction}
                setOpen={setOpen}
              />
            )}
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
};

const ConfirmDialog = ({
  texts,
  colorScheme,
  loadingPrimary,
  onPrimaryAction,
  closeConfirmDialog,
  setOpen,
}: any) => (
  <>
    <Typography
      color={colorScheme.main}
      textAlign="justify"
      mb={1}
      sx={(theme) => ({ ...theme.typography.bodySmall })}
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
            closeConfirmDialog();
            setOpen(false);
          }}
          loading={loadingPrimary}
          fullWidth
          size="small"
        >
          {texts.confirmButtonLabel}
        </LoadingButton>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Button
          variant="outlined"
          color={colorScheme.muiColor}
          onClick={closeConfirmDialog}
          fullWidth
          sx={{ backgroundColor: "white" }}
          size="small"
        >
          {texts.cancelButtonLabel}
        </Button>
      </Grid>
    </Grid>
  </>
);

const ActionContent = ({
  status,
  hidePrimaryButton,
  disablePrimaryButton,
  disablePrimaryButtonText,
  loadingPrimary,
  loadingSecondary,
  texts,
  colorScheme,
  onPrimaryAction,
  onSecondaryAction,
  setOpen,
}: any) => (
  <>
    <Typography
      color={colorScheme.main}
      textAlign="justify"
      mb={1}
      sx={(theme) => ({
        ...theme.typography.bodySmall,
      })}
    >
      {texts.description}
    </Typography>
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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
              onClick={onPrimaryAction}
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
  </>
);

export default ActionPopup;
