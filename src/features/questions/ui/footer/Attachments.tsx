import React, { Fragment, useState, useRef, useEffect } from "react";
import {
  Box,
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { t } from "i18next";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import AttachementPlus from "../../assets/attachment-plus.svg";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import { FileDownloadOutlined } from "@mui/icons-material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Text } from "@/components/common/Text";
import { styles } from "@styles";
import uniqueId from "@/utils/unique-id";
import { ICustomError } from "@utils/custom-error";
import toastError from "@utils/toast-error";
import { downloadFile } from "@utils/download-file";
import languageDetector from "@utils/language-detector";
import useDialog from "@/hooks/useDialog";
import { DeleteConfirmationDialog } from "@common/dialogs/DeleteConfirmationDialog";
import useFetchData from "../../model/footer/useFetchData";
import showToast from "@utils/toast-error";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";

interface Attachment {
  link: string;
  id: string;
  creationTime: string;
  description: string | null;
  createdBy: {
    displayName: string;
    email: string | null;
    id: string;
  };
}

const ACCORDION_BASE_STYLE = {
  background: "#66809914",
  boxShadow: "none",
  borderRadius: "4px !important",
  border: "1px solid #C7CCD1",
  "&:before": {
    display: "none",
  },
};

const ACCORDION_SUMMARY_STYLE = {
  flexDirection: "row",
  px: 1,
  py: "6px",
  minHeight: "unset",
  borderRadius: 1,
  background: "#66809914",
  "&.Mui-expanded": {
    margin: 0,
    minHeight: "unset",
    borderBottom: "1px solid #C7CCD1",
  },
  "& .MuiAccordionSummary-content": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    m: 0,
  },
  "& .MuiAccordionSummary-content.Mui-expanded": { margin: 0 },
};

const CHIP_STYLE = {
  color: "background.secondaryDark",
  height: 16,
  fontSize: "10px",
  borderRadius: 1,
  "& .MuiChip-label": {
    p: "0px 4px",
  },
};

const MAX_FILENAME_LENGTH = 20;
const DESCRIPTION_LIMIT = 100;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_FILE_TYPES = [
  "pdf",
  "doc",
  "docx",
  "ppt",
  "pptx",
  "xls",
  "xlsx",
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "webp",
  "rar",
  "zip",
  "7z",
  "tar",
  "gz",
  "avi",
  "mp4",
  "mkv",
  "mov",
  "wmv",
  "flv",
  "webm",
  "txt",
  "csv",
];

const ACCEPT_FILE_TYPES = ALLOWED_FILE_TYPES.map((ext) => `.${ext}`).join(",");

const getFileNameParts = (file: File | null) => {
  if (!file) {
    return { baseName: "", extension: "" };
  }

  const fullName = file.name;
  const dotIndex = fullName.lastIndexOf(".");
  const hasExtension = dotIndex !== -1;

  const baseName = hasExtension ? fullName.substring(0, dotIndex) : fullName;
  const extension = hasExtension
    ? fullName.substring(dotIndex + 1).toLowerCase()
    : "";

  return { baseName, extension };
};

const formatFileName = (baseName: string, extension: string) => {
  if (!baseName || !extension) return "";

  if (baseName.length < MAX_FILENAME_LENGTH) {
    return `${baseName}.${extension}`;
  }

  return `${baseName.substring(0, MAX_FILENAME_LENGTH)}....${extension}`;
};

const validateFile = (file: File): string | null => {
  if (file.size > MAX_FILE_SIZE) {
    return "حجم هر فایل پیوست حداکثر ۵ مگابایت می‌تواند باشد.";
  }

  const fileExtension = file.name.split(".").pop()?.toLowerCase();
  if (!fileExtension || !ALLOWED_FILE_TYPES.includes(fileExtension)) {
    return "پیوست‌ها باید فقط از نوع فایل‌های مجاز باشند.";
  }

  return null;
};

const extractFileNameFromLink = (link: string) => {
  const regex = /\/([^/?]+)\?/;
  const match = regex.exec(link);
  if (!match) return { name: null, extension: null, fullName: null };

  const fullName = decodeURIComponent(match[1]);
  const dotIndex = fullName.lastIndexOf(".");
  const hasExtension = dotIndex !== -1;

  const name = hasExtension ? fullName.substring(0, dotIndex) : fullName;
  const extension = hasExtension
    ? fullName.substring(dotIndex + 1).toLowerCase()
    : "";

  return { name, extension, fullName };
};

export const Attachments: React.FC<{
  id: string;
  attachmentsCount: number;
  startAddMode?: boolean;
  onCloseAddMode?: (noAttachments: boolean) => void;
}> = ({ id, attachmentsCount, startAddMode, onCloseAddMode }) => {
  const [expanded, setExpanded] = useState<boolean>(!!startAddMode);
  const [counter, setCounter] = useState<number>(attachmentsCount);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const [isAdding, setIsAdding] = useState<boolean>(!!startAddMode);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    fetchEvidenceAttachments,
    removeEvidenceAttachments,
    addEvidenceAttachments,
  } = useFetchData();

  useEffect(() => {
    if (startAddMode) {
      setExpanded(true);
      setIsAdding(true);
    }
  }, [startAddMode]);

  const handleAccordionChange = async (
    _event: React.SyntheticEvent,
    isExpanded: boolean,
  ) => {
    setExpanded(isExpanded);

    if (isExpanded) {
      const result = await fetchEvidenceAttachments.query({
        evidence_id: id,
      });
      setAttachments(result.attachments ?? []);
      setCounter(result.attachments.length);
    }
  };

  const resetAddForm = (shouldHideWhenEmpty: boolean) => {
    setIsAdding(false);
    // setSelectedFile(null);
    setDescription("");
    setFileError(null);
    if (shouldHideWhenEmpty && counter === 0) {
      onCloseAddMode?.(true);
    } else {
      onCloseAddMode?.(false);
    }
  };

  const handleInvalidFile = (message: string) => {
    showToast(message);
    setFileError(message);
    toastError({ message } as ICustomError);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    setSelectedFile(file);

    if (!file) {
      input.value = "";
      return;
    }

    const error = validateFile(file);
    if (error) {
      handleInvalidFile(error);
      input.value = "";
      return;
    }

    setFileError(null);
    input.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] || null;

    if (!file) return;

    const error = validateFile(file);
    if (error) {
      handleInvalidFile(error);
      return;
    }

    setSelectedFile(file);
    setFileError(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleConfirmAdd = async () => {
    if (!selectedFile) return;

    const error = validateFile(selectedFile);
    if (error) {
      handleInvalidFile(error);
      return;
    }

    try {
      setIsUploading(true);

      const data = {
        id,
        attachment: selectedFile,
        description,
      };

      await addEvidenceAttachments.query({ evidenceId: id, data });

      const result = await fetchEvidenceAttachments.query({
        evidence_id: id,
      });
      setAttachments(result.attachments ?? []);
      setCounter(result.attachments.length);

      resetAddForm(false);
    } catch (e: any) {
      const err = e as ICustomError;
      toastError(err);
    } finally {
      setIsUploading(false);
    }
  };

  const dialogProps = useDialog();
  const handleDeleteAttachment = async () => {
    const attachmentId: string = dialogProps?.context?.data.id;
    try {
      await removeEvidenceAttachments
        .query({
          evidenceId: id,
          attachmentId,
        })
        .then(async () => {
          const result = await fetchEvidenceAttachments.query({
            evidence_id: id,
          });
          setAttachments(result.attachments ?? []);
          setCounter(result.attachments.length);
        });

      dialogProps.onClose();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setDescription(e.target.value);
  };

  const attachmentsLimitReached = attachments.length >= 5;
  const isDescriptionTooLong = description.length > DESCRIPTION_LIMIT;
  const isConfirmDisabled =
    !selectedFile || isUploading || isDescriptionTooLong || !!fileError;

  const { baseName: selectedBaseName, extension: selectedExtension } =
    getFileNameParts(selectedFile);
  const selectedDisplayName =
    selectedBaseName && selectedExtension
      ? formatFileName(selectedBaseName, selectedExtension)
      : selectedFile?.name || "";

  return (
    <Box sx={{ pt: 3 }}>
      <Accordion
        sx={ACCORDION_BASE_STYLE}
        expanded={expanded}
        onChange={handleAccordionChange}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "#627384" }} />}
          sx={ACCORDION_SUMMARY_STYLE}
        >
          <Box sx={{ ...styles.centerVH, gap: 1 }}>
            <AttachFileIcon sx={{ color: "#627384", width: 16, height: 16 }} />
            <Text
              variant="bodySmall"
              color="background.secondaryDark"
              sx={{ fontWeight: 600 }}
            >
              {t("questions.attachments")} ({counter})
            </Text>
          </Box>
        </AccordionSummary>

        <AccordionDetails
          sx={{ background: "#fff", p: "8px", borderRadius: 1 }}
        >
          {attachments.map((attachment, index) => {
            const { id: attachmentId } = attachment;
            const { name, extension } = extractFileNameFromLink(
              attachment.link,
            );
            const isLast = index === attachments.length - 1;
            const handleDownloadAttachment = () => {
              downloadFile(attachment);
            };
            const isRTL = languageDetector(name);

            const formattedName =
              name && extension
                ? formatFileName(name, extension)
                : attachment.link;

            return (
              <Fragment key={uniqueId()}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: "32px",
                  }}
                >
                  <Box sx={{ ...styles.centerV, gap: 1 }}>
                    {extension && <Chip sx={CHIP_STYLE} label={extension} />}
                    <Text
                      variant="bodySmall"
                      color="background.secondaryDark"
                      sx={{ ...styles.rtlStyle(isRTL) }}
                    >
                      {formattedName}
                    </Text>
                    {attachment.description && (
                      <Text
                        sx={{
                          paddingInlineStart: 1,
                          display: { xs: "none", sm: "flex" },
                        }}
                        variant="bodySmall"
                        color="#627384"
                      >
                        {attachment.description}
                      </Text>
                    )}
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton
                      sx={{ p: 0.4 }}
                      onClick={handleDownloadAttachment}
                    >
                      <FileDownloadOutlined
                        sx={{ color: "info.main", fontSize: "24px" }}
                      />
                    </IconButton>
                    <IconButton
                      sx={{ p: 0.4 }}
                      onClick={() =>
                        dialogProps.openDialog({
                          type: "delete",
                          data: { id: attachmentId },
                        })
                      }
                    >
                      <DeleteOutlineOutlinedIcon
                        sx={{ color: "info.main", fontSize: "24px" }}
                      />
                    </IconButton>
                  </Box>
                </Box>
                {!isLast && (
                  <Divider
                    sx={{
                      borderBottomWidth: "0.5px",
                      borderColor: "#C7CCD1",
                    }}
                    orientation="horizontal"
                    flexItem
                  />
                )}
              </Fragment>
            );
          })}

          {attachments.length > 0 && !isAdding && !attachmentsLimitReached && (
            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                variant="text"
                size="small"
                sx={{
                  px: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                }}
                onClick={() => {
                  setIsAdding(true);
                }}
                startIcon={
                  <Box
                    component="img"
                    src={AttachementPlus}
                    alt="empty state"
                    sx={{ width: "100%", maxWidth: 80 }}
                  />
                }
              >
                {t("questions_temp.addAttachment")}
              </Button>
            </Box>
          )}

          {isAdding && !attachmentsLimitReached && (
            <Box
              sx={{
                mt: attachments.length ? 1.5 : 0,
                borderRadius: 1,
                border: "0.5px solid",
                borderColor: fileError ? "error.main" : "outline.variant",
                bgcolor: "background.containerHighest",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 1.5,
                alignItems: { xs: "stretch", sm: "center" },
                p: 1,
              }}
            >
              <Box
                sx={{
                  flexBasis: { xs: "100%", sm: "40%" },
                  minHeight: 32,
                  border: selectedFile ? "none" : "1px dashed #C7CCD1",
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  bgcolor: selectedFile
                    ? "transparent"
                    : "primary.states.selected",
                  borderColor: fileError ? "error.main" : "primary.main",
                }}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  accept={ACCEPT_FILE_TYPES}
                  onChange={handleFileChange}
                />
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 1,
                  }}
                >
                  <FileUploadOutlinedIcon
                    sx={{
                      fontSize: 18,
                      color: fileError ? "error.main" : "info.main",
                    }}
                  />
                  {selectedFile && selectedExtension && (
                    <Chip sx={CHIP_STYLE} label={selectedExtension} />
                  )}
                  <Text
                    variant="bodySmall"
                    color={fileError ? "error.main" : "primary.main"}
                    sx={{
                      textAlign: "center",
                      flex: 1,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      pl: 0.5,
                    }}
                  >
                    {selectedFile
                      ? selectedDisplayName
                      : t("questions_temp.dropOrSelectFile")}
                  </Text>
                  {selectedFile && (
                    <IconButton
                      sx={{ p: 0.4 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      <RestartAltOutlinedIcon
                        sx={{ fontSize: 20, color: "info.main" }}
                      />
                    </IconButton>
                  )}
                </Box>
              </Box>

              <Box
                sx={{
                  flexBasis: { xs: "100%", sm: "50%" },
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={description}
                  onChange={handleDescriptionChange}
                  placeholder={t("questions_temp.attachmentDescription")}
                  sx={(theme) => ({
                    bgcolor: "background.containerLowest",
                    "& .MuiInputBase-root": {
                      ...theme.typography.bodySmall,
                      height: 32,
                    },
                    "& .MuiInputBase-input": {
                      ...theme.typography.bodySmall,
                      "&::placeholder": {
                        ...theme.typography.bodySmall,
                      },
                    },
                  })}
                  error={isDescriptionTooLong}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Text
                          paddingInlineEnd={1}
                          variant="bodySmall"
                          color={
                            isDescriptionTooLong
                              ? "error.main"
                              : "text.secondary"
                          }
                        >
                          {description.length ?? 0} / {DESCRIPTION_LIMIT}
                        </Text>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  ml: { xs: 0, sm: "auto" },
                }}
              >
                <IconButton
                  sx={{ p: 0.4 }}
                  onClick={handleConfirmAdd}
                  disabled={isConfirmDisabled}
                >
                  {isUploading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <CheckIcon
                      sx={{
                        color: isConfirmDisabled
                          ? "text.disabled"
                          : "primary.main",
                        fontSize: 24,
                      }}
                    />
                  )}
                </IconButton>
                <IconButton
                  sx={{ p: 0.4 }}
                  onClick={() => resetAddForm(true)}
                  disabled={isUploading}
                >
                  <CloseIcon sx={{ color: "#D32F2F", fontSize: 24 }} />
                </IconButton>
              </Box>
            </Box>
          )}
        </AccordionDetails>

        <DeleteConfirmationDialog
          open={dialogProps.open}
          onClose={() => dialogProps.onClose()}
          onConfirm={handleDeleteAttachment}
          content={{
            category: t("questions_temp.attachment").toLowerCase(),
            title: "",
          }}
        />
      </Accordion>
    </Box>
  );
};

export default Attachments;
