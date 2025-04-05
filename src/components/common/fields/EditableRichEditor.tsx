import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CancelRounded from "@mui/icons-material/CancelRounded";
import CheckCircleOutlineRounded from "@mui/icons-material/CheckCircleOutlineRounded";
import EditRounded from "@mui/icons-material/EditRounded";
import { ICustomError } from "@utils/CustomError";
import FormProviderWithForm from "@common/FormProviderWithForm";
import RichEditorField from "@common/fields/RichEditorField";
import { farsiFontFamily, primaryFontFamily, theme } from "@config/theme";
import { Trans, useTranslation } from "react-i18next";
import languageDetector from "@utils/languageDetector";
import toastError from "@/utils/toastError";
import { CEDialog, CEDialogActions } from "../dialogs/CEDialog";

interface EditableRichEditorProps {
  defaultValue: string;
  editable?: boolean;
  fieldName: string;
  onSubmit: (data: any, event: any) => Promise<void>;
  infoQuery: any;
  placeholder?: string;
  required?: boolean;
}

export const EditableRichEditor = (props: EditableRichEditorProps) => {
  const {
    defaultValue,
    editable,
    fieldName,
    onSubmit,
    infoQuery,
    placeholder,
    required = true,
  } = props;

  const { t } = useTranslation();
  const [isHovering, setIsHovering] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const paragraphRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const formMethods = useForm({
    defaultValues: { [fieldName]: defaultValue || "" },
  });
  const [tempData, setTempData] = useState(defaultValue || "");

  useEffect(() => {
    setTempData(defaultValue);
  }, [defaultValue]);

  const handleMouseOver = () => editable && setIsHovering(true);
  const handleMouseOut = () => setIsHovering(false);

  const handleCancel = () => {
    setShowEditor(false);
    formMethods.reset({ [fieldName]: defaultValue || "" });
  };

  const handleSubmit = async (data: any, event: any) => {
    try {
      await onSubmit(data, event);
      await infoQuery();
      setShowEditor(false);
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  useEffect(() => {
    setTempData(formMethods.getValues()[fieldName]);
  }, [formMethods.watch(fieldName)]);

  useEffect(() => {
    if (paragraphRef.current) {
      const isOverflowing =
        paragraphRef.current.scrollHeight > paragraphRef.current.clientHeight;
      setShowBtn(isOverflowing);
    }
  }, [tempData]);

  const toggleShowMore = () => {
    setShowMore((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showEditor &&
        editorRef.current &&
        !editorRef.current.contains(event.target as Node)
      ) {
        setShowUnsavedDialog(true);
      }
    };

    if (showEditor) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEditor]);

  const cancelLeaveEditor = () => {
    setShowUnsavedDialog(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        direction: languageDetector(tempData) ? "rtl" : "ltr",
        height: "100%",
        width: "100%",
      }}
    >
      {editable && showEditor ? (
        <FormProviderWithForm
          formMethods={formMethods}
          style={{ height: "100%", width: "100%" }}
        >
          <Box
            ref={editorRef}
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "stretch",
            }}
          >
            <RichEditorField
              name={fieldName}
              label={<Box></Box>}
              disable_label={true}
              required={required}
              defaultValue={defaultValue || ""}
              textAlign="justify"
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: !tempData ? "100%" : "initial",
              }}
            >
              <IconButton
                sx={{
                  background: theme.palette.primary.main,
                  "&:hover": { background: theme.palette.primary.dark },
                  borderRadius: languageDetector(tempData)
                    ? "8px 0 0 0"
                    : "0 8px 0 0",
                  height: "49%",
                }}
                onClick={formMethods.handleSubmit(handleSubmit)}
              >
                <CheckCircleOutlineRounded sx={{ color: "#fff" }} />
              </IconButton>
              <IconButton
                sx={{
                  background: theme.palette.primary.main,
                  "&:hover": { background: theme.palette.primary.dark },
                  borderRadius: languageDetector(tempData)
                    ? "0 0 0 8px"
                    : "0 0 8px 0",
                  height: "49%",
                }}
                onClick={handleCancel}
              >
                <CancelRounded sx={{ color: "#fff" }} />
              </IconButton>
            </Box>
          </Box>
        </FormProviderWithForm>
      ) : (
        <Box sx={{ width: "100%" }}>
          <Box
            sx={{
              minHeight: "38px",
              borderRadius: "8px",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              wordBreak: "break-word",
              pr: languageDetector(tempData) ? 1 : 5,
              pl: languageDetector(tempData) ? 5 : 1,
              border: "1px solid #fff",
              "&:hover": {
                border: editable ? "1px solid #1976d299" : "unset",
                borderColor: editable ? theme.palette.primary.main : "unset",
              },
              position: "relative",
            }}
            onClick={() => editable && setShowEditor(true)}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            <Typography
              textAlign="justify"
              sx={{
                fontFamily: languageDetector(tempData)
                  ? farsiFontFamily
                  : primaryFontFamily,
                width: "100%",
                color: !tempData ? "rgba(61, 77, 92, 0.5)" : "initial",
                display: "-webkit-box",
                WebkitLineClamp: showMore ? "unset" : 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              variant="bodyMedium"
              dangerouslySetInnerHTML={{
                __html:
                  tempData ||
                  (editable
                    ? (placeholder ?? t("writeHere"))
                    : t("unavailable")),
              }}
              ref={paragraphRef}
            />
            {isHovering && editable && (
              <IconButton
                title="Edit"
                sx={{
                  background: theme.palette.primary.main,
                  "&:hover": { background: theme.palette.primary.dark },
                  borderRadius: languageDetector(tempData)
                    ? "8px 0 0 8px"
                    : "0 8px 8px 0",
                  height: "100%",
                  position: "absolute",
                  right: languageDetector(tempData) ? "unset" : 0,
                  left: languageDetector(tempData) ? 0 : "unset",
                  top: 0,
                }}
                onClick={() => setShowEditor(true)}
              >
                <EditRounded sx={{ color: "#fff" }} />
              </IconButton>
            )}
          </Box>
          {showBtn && (
            <Button
              variant="text"
              onClick={toggleShowMore}
              sx={{ textTransform: "none" }}
            >
              {showMore ? t("showLess") : t("showMore")}
            </Button>
          )}
        </Box>
      )}

      <CEDialog
        open={showUnsavedDialog}
        onClose={cancelLeaveEditor}
        title={<Trans i18nKey="warning" />}
        maxWidth="sm"
      >
        <Typography sx={{ color: "#0A2342" }}>
          <Trans
            i18nKey="editorActionRestriction"
            components={{
              title: <span style={{ fontWeight: "bold", color: "#B86A77" }} />,
            }}
          />
        </Typography>

        <CEDialogActions
          type="delete"
          loading={false}
          submitButtonLabel={t("okGotIt")}
          onSubmit={cancelLeaveEditor}
          closeDialog={cancelLeaveEditor}
          hideCancelButton={true}
        />
      </CEDialog>
    </Box>
  );
};
