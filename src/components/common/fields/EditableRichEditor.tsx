import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box, IconButton, Typography } from "@mui/material";
import {
  CancelRounded,
  CheckCircleOutlineRounded,
  EditRounded,
} from "@mui/icons-material";
import { ICustomError } from "@utils/CustomError";
import FormProviderWithForm from "@common/FormProviderWithForm";
import RichEditorField from "@common/fields/RichEditorField";
import { farsiFontFamily, primaryFontFamily, theme } from "@config/theme";
import { useTranslation } from "react-i18next";
import languageDetector from "@utils/languageDetector";
import toastError from "@/utils/toastError";

interface EditableRichEditorProps {
  defaultValue: string;
  editable?: boolean;
  fieldName: string;
  onSubmit: (data: any, event: any) => Promise<void>;
  infoQuery: () => Promise<void>;
  placeholder?: string;
}

export const EditableRichEditor = (props: EditableRichEditorProps) => {
  const {
    defaultValue,
    editable,
    fieldName,
    onSubmit,
    infoQuery,
    placeholder,
  } = props;
  const { t } = useTranslation();
  const [isHovering, setIsHovering] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
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
              required={true}
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
            }}
            dangerouslySetInnerHTML={{
              __html:
                tempData ||
                (editable ? placeholder || t("writeHere") : t("unavailable")),
            }}
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
      )}
    </Box>
  );
};
