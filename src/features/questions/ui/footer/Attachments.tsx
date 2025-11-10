import React, { Fragment, useState } from "react";
import {
  Box,
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
} from "@mui/material";
import { t } from "i18next";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { Text } from "@/components/common/Text";
import { styles } from "@styles";
import uniqueId from "@/utils/unique-id";
import IconButton from "@mui/material/IconButton";
import { FileDownloadOutlined } from "@mui/icons-material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { ICustomError } from "@utils/custom-error";
import toastError from "@utils/toast-error";
import { downloadFile } from "@utils/download-file";
import useFetchData from "@/features/questions/model/evidenceTabs/useFetchData";
import {
  setTab,
  useQuestionContext,
  useQuestionDispatch,
} from "@/features/questions/context";
import languageDetector from "@utils/language-detector";
import useDialog from "@/hooks/useDialog";
import { DeleteConfirmationDialog } from "@common/dialogs/DeleteConfirmationDialog";

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
  "&.Mui-expanded": { margin: 0, minHeight: "unset", borderBottom: "1px solid #C7CCD1" },
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

export const Attachments: React.FC<any> = ({
  evidenceId,
  attachmentsCount,
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const {
    fetchEvidenceAttachments,
    removeEvidenceAttachments,
    evidencesQueryData,
    commentesQueryData,
  } = useFetchData();
  const { tabData } = useQuestionContext();
  const dispatch = useQuestionDispatch();

  const { activeTab } = tabData;
  const theme = useTheme();
  const tooltipStyle: any = {
    sx: {
      bgcolor: "#66809920",
      color: theme.palette.text.primary,
      fontWeight: 400,
      fontSize: "11px",
      px: 0.5,
    },
  };

  const handleAccordionChange = async (
    _event: React.SyntheticEvent,
    isExpanded: boolean,
  ) => {
    setExpanded(isExpanded);

    if (isExpanded) {
      const result = await fetchEvidenceAttachments.query({
        evidence_id: evidenceId,
      });
      setAttachments(result.attachments ?? []);
    }
  };
  const dialogProps = useDialog();
  const handleDeleteAttachment = async (attachmentId: any) => {
    try {
      const queryMap = {
        evidence: evidencesQueryData,
        comment: commentesQueryData,
      };
      const currentQuery = queryMap[activeTab];
      await removeEvidenceAttachments.query({ evidenceId, attachmentId });
      const response = await currentQuery.query();
      const items = response.items ?? [];
      dispatch(setTab({ activeTab: activeTab, data: items }));
      setAttachments((prevState) =>
        prevState.filter((item) => item.id != attachmentId),
      );
      dialogProps.onClose()
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  const extractFileName = (link: string) => {
    const regex = /\/([^/?]+)\?/;
    const match = regex.exec(link);
    if (!match) return { name: null, extension: null, fullName: null };

    const fullName = decodeURIComponent(match[1]);
    const dotIndex = fullName.lastIndexOf(".");
    const hasExtension = dotIndex !== -1;

    const name = hasExtension ? fullName.substring(0, dotIndex) : fullName;
    const extension = hasExtension ? fullName.substring(dotIndex + 1).toLowerCase() : "";

    return { name, extension, fullName };
  };

  const formatFileName = (name: string | null, extension: string | null) => {
    if (!name || !extension) return "";

    if (name.length < MAX_FILENAME_LENGTH) {
      return `${name}.${extension}`;
    }

    return `${name.substring(0, MAX_FILENAME_LENGTH)}....${extension}`;
  };

  return (
    <Box sx={{ pt: 3 }}>
      <Accordion
        sx={ACCORDION_BASE_STYLE}
        expanded={expanded}
        onChange={handleAccordionChange}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{color: "#627384"}} />}
          sx={ACCORDION_SUMMARY_STYLE}
        >
          <Box sx={{ ...styles.centerVH, gap: 1 }}>
            <AttachFileIcon
              sx={{ color: "#627384", width: 16, height: 16 }}
            />
            <Text
              variant="bodySmall"
              color="background.secondaryDark"
              sx={{ fontWeight: 600 }}
            >
              {t("questions.attachments")} ({attachmentsCount})
            </Text>
          </Box>
        </AccordionSummary>

        <AccordionDetails sx={{ background: "#fff", p:"8px", borderRadius: 1 }}>
          {attachments.map((attachment, index) => {
            const { id: attachmentId } = attachment;
            const { name, extension } = extractFileName(attachment.link);
            const isLast = index === attachments.length - 1;
            const handleDownloadAttachment = () => {
              downloadFile(attachment);
            };
            const isRTL = languageDetector(name);

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
                    <Chip sx={CHIP_STYLE} label={extension} />
                    <Text
                      variant="bodySmall"
                      color="background.secondaryDark"
                      sx={{ ...styles.rtlStyle(isRTL) }}
                    >
                      {formatFileName(name, extension)}
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
                      onClick={() => dialogProps.openDialog({
                        type: "delete",
                        data: {
                         id: attachmentId
                        }
                      })}
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
        </AccordionDetails>
        <DeleteConfirmationDialog
          open={dialogProps.open}
          onClose={() => dialogProps.onClose()}
          onConfirm={()=>handleDeleteAttachment(dialogProps?.context?.data.id)}
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
