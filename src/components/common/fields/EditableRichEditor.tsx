import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CancelRounded from "@mui/icons-material/CancelRounded";
import CheckCircleOutlineRounded from "@mui/icons-material/CheckCircleOutlineRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { ICustomError } from "@/utils/custom-error";
import FormProviderWithForm from "@common/FormProviderWithForm";
import RichEditorField from "@common/fields/RichEditorField";
import { Trans, useTranslation } from "react-i18next";
import languageDetector from "@/utils/language-detector";
import { CEDialog, CEDialogActions } from "../dialogs/CEDialog";
import showToast from "@/utils/toast-error";
import { useTheme } from "@mui/material";
import { styles } from "@styles";
import { Text } from "../Text";

const MAX_HEIGHT = 210;

interface EditableRichEditorProps {
  defaultValue: string;
  editable?: boolean;
  fieldName: string;
  onSubmit: (data: any, event: any) => Promise<void>;
  infoQuery: any;
  placeholder?: string;
  required?: boolean;
  showEditorMenu?: boolean;
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
    showEditorMenu,
  } = props;

  const theme = useTheme();
  const { t } = useTranslation();

  const [isHovering, setIsHovering] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  const paragraphRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const formMethods = useForm({
    defaultValues: { [fieldName]: defaultValue ?? "" },
    shouldUnregister: true,
  });

  const [tempData, setTempData] = useState(defaultValue ?? "");

  // هر بار defaultValue تغییر کرد، هم state نمایشی و هم فرم را sync کن
  useEffect(() => {
    setTempData(defaultValue ?? "");
    formMethods.reset({ [fieldName]: defaultValue ?? "" });
  }, [defaultValue, fieldName, formMethods]);

  const openEditor = () => {
    if (!editable) return;
    formMethods.reset({ [fieldName]: tempData ?? "" });
    setShowEditor(true);
  };

  const handleCancel = () => {
    setShowEditor(false);
    formMethods.reset({ [fieldName]: defaultValue ?? "" });
  };

  const onSubmitInternal = async (data: any, event: any) => {
    try {
      await onSubmit(data, event);
      await infoQuery();
      const newVal = data?.[fieldName] ?? "";
      setTempData(newVal);
      setShowEditor(false);
      formMethods.reset({ [fieldName]: newVal });
    } catch (e) {
      const err = e as ICustomError;
      showToast(err);
    }
  };

  useEffect(() => {
    if (paragraphRef.current && containerRef.current) {
      const isOverflowing =
        paragraphRef.current.scrollHeight > paragraphRef.current.clientHeight ||
        containerRef.current.scrollHeight > containerRef.current.clientHeight;
      setShowBtn(isOverflowing);
    }
  }, [tempData, showMore]);

  const toggleShowMore = () => setShowMore((prev) => !prev);

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
    if (showEditor) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEditor]);

  const cancelLeaveEditor = () => setShowUnsavedDialog(false);

  return (
    <Box
      height="100%"
      width="100%"
      sx={{
        ...styles.centerV,
        direction: languageDetector(tempData) ? "rtl" : "ltr",
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
              label={<Box />}
              disable_label
              required={required}
              defaultValue={defaultValue ?? ""}
              textAlign="justify"
              showEditorMenu={showEditorMenu}
            />
            <Box
              sx={{
                ...styles.centerCVH,
                height: tempData ? "initial" : "100%",
              }}
            >
              <IconButton
                sx={{
                  bgcolor: "primary.main",
                  "&:hover": { bgcolor: "primary.dark" },
                  borderRadius: languageDetector(tempData)
                    ? "8px 0 0 0"
                    : "0 8px 0 0",
                  height: "49%",
                }}
                onClick={formMethods.handleSubmit(onSubmitInternal)}
              >
                <CheckCircleOutlineRounded
                  sx={{ color: "primary.contrastText" }}
                />
              </IconButton>
              <IconButton
                sx={{
                  bgcolor: "primary.main",
                  "&:hover": { bgcolor: "primary.dark" },
                  borderRadius: languageDetector(tempData)
                    ? "0 0 0 8px"
                    : "0 0 8px 0",
                  height: "49%",
                }}
                onClick={handleCancel}
              >
                <CancelRounded sx={{ color: "primary.contrastText" }} />
              </IconButton>
            </Box>
          </Box>
        </FormProviderWithForm>
      ) : (
        <Box width="100%">
          <Box
            minHeight="38px"
            borderRadius="8px"
            width="100%"
            justifyContent="space-between"
            border={`1px solid ${theme.palette.primary.contrastText}`}
            position="relative"
            sx={{
              ...styles.centerV,
              wordBreak: "break-word",
              pr: languageDetector(tempData) ? 1 : 5,
              pl: languageDetector(tempData) ? 5 : 1,
              "&:hover": {
                border: editable ? "1px solid #1976d299" : "unset",
                borderColor: editable ? "primary.main" : "unset",
              },
            }}
            onClick={openEditor}
            onMouseOver={() => editable && setIsHovering(true)}
            onMouseOut={() => setIsHovering(false)}
          >
            <Box
              ref={containerRef}
              width="100%"
              overflow="hidden"
              position="relative"
              maxHeight={!showMore ? `${MAX_HEIGHT}px` : "none"}
              sx={{
                transition: "max-height 0.4s ease",
                "&::after":
                  !showMore && tempData
                    ? {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "40px",
                        background: showBtn
                          ? `linear-gradient(to bottom, rgba(255,255,255,0) 0%, white 100%)`
                          : "none",
                        pointerEvents: "none",
                      }
                    : undefined,
              }}
            >
              <Text
                component="div"
                textAlign="justify"
                sx={{
                  width: "100%",
                  color: !tempData ? "rgba(61, 77, 92, 0.5)" : "initial",
                  display: "-webkit-box",
                  WebkitLineClamp: showMore ? "unset" : 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  "& table": {
                    direction: theme.direction,
                    width: "100%",
                    borderCollapse: "collapse",
                    tableLayout: "auto",
                    maxWidth: "100%",
                  },
                  "& th, & td": {
                    direction: "inherit",
                    unicodeBidi: "plaintext",
                    verticalAlign: "top",
                    border: "1px solid rgba(0,0,0,0.12)",
                    padding: "6px 8px",
                  },
                  "& td p, & th p": {
                    direction: "inherit",
                    textAlign: "inherit",
                    unicodeBidi: "plaintext",
                    margin: 0,
                  },
                }}
                variant="bodyMedium"
                dangerouslySetInnerHTML={{
                  __html:
                    tempData ||
                    (editable
                      ? (placeholder ?? t("common.writeHere"))
                      : t("common.unavailable")),
                }}
                ref={paragraphRef}
              />
            </Box>

            {isHovering && editable && (
              <IconButton
                title="Edit"
                sx={{
                  bgcolor: "primary.main",
                  "&:hover": { bgcolor: "primary.dark" },
                  borderRadius: languageDetector(tempData)
                    ? "8px 0 0 8px"
                    : "0 8px 8px 0",
                  height: "100%",
                  position: "absolute",
                  right: languageDetector(tempData) ? "unset" : 0,
                  left: languageDetector(tempData) ? 0 : "unset",
                  top: 0,
                }}
                onClick={openEditor}
              >
                <EditOutlinedIcon sx={{ color: "primary.contrastText" }} />
              </IconButton>
            )}
          </Box>

          {showBtn && (
            <Button
              variant="text"
              onClick={toggleShowMore}
              sx={{ textTransform: "none" }}
            >
              {showMore ? t("common.showLess") : t("common.showMore")}
            </Button>
          )}
        </Box>
      )}

      <CEDialog
        open={showUnsavedDialog}
        closeDialog={cancelLeaveEditor}
        title={<Trans i18nKey="common.warning" />}
        maxWidth="sm"
      >
        <Text color="#0A2342">
          <Trans
            i18nKey="notification.editorActionRestriction"
            components={{
              title: <span style={{ fontWeight: "bold", color: "#B86A77" }} />,
            }}
          />
        </Text>

        <CEDialogActions
          type="delete"
          loading={false}
          submitButtonLabel={t("common.okGotIt")}
          onSubmit={cancelLeaveEditor}
          closeDialog={cancelLeaveEditor}
          hideCancelButton
        />
      </CEDialog>
    </Box>
  );
};
