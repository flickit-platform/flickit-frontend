import React, { Fragment, useEffect, useState } from "react";
import { Box, Chip, Divider, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { useForm } from "react-hook-form";
import { t } from "i18next";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import FormProviderWithForm from "@common/FormProviderWithForm";
import RichEditorField from "@common/fields/RichEditorField";
import { Text } from "@/components/common/Text";
import { styles } from "@styles";
import uniqueId from "@/utils/unique-id";

interface Attachment {
    link: string;
}

interface EvidenceDetailProps {
    editId: string | null;
    description: string;
    id: string;
    setNewDescription: (desc: string) => void;
    newDescription: string;
    isEditing: boolean;
    fetchAttachment?: (id: string, type: string) => Promise<{ attachments: Attachment[] }>;
    attachmentsCount?: number;
    type: string;
}

const ACCORDION_BASE_STYLE = {
    background: "#66809914",
    boxShadow: "none",
    borderRadius: "4px !important",
    border: ".5px solid #66809980",
    mb: 1,
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
    border: ".5px solid #66809980",
    background: "#66809914",
    "&.Mui-expanded": { margin: 0, minHeight: "unset" },
    "& .MuiAccordionSummary-content": {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        m: 0,
    },
    "& .MuiAccordionSummary-content.Mui-expanded": { margin: 0 },
    "& .MuiAccordionSummary-expandIconWrapper": {
        paddingInlineEnd: "10px",
    },
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

const EvidenceDetail: React.FC<EvidenceDetailProps> = ({
                                                           editId,
                                                           description,
                                                           id: evidenceId,
                                                           setNewDescription,
                                                           newDescription,
                                                           isEditing,
                                                           fetchAttachment,
                                                           attachmentsCount = 0,
                                                           type,
                                                       }) => {
    const hasAttachments = attachmentsCount > 0;

    return (
        <div>
            <DescriptionEvidence
                description={description}
                editId={editId}
                evidenceId={evidenceId}
                setNewDescription={setNewDescription}
                newDescription={newDescription}
                isEditing={isEditing}
            />
            {hasAttachments && fetchAttachment && (
                <AttachmentEvidence
                    type={type}
                    fetchAttachment={fetchAttachment}
                    evidenceId={evidenceId}
                    attachmentsCount={attachmentsCount}
                />
            )}
        </div>
    );
};

const AttachmentEvidence: React.FC<any> = ({
                                               fetchAttachment,
                                               evidenceId,
                                               attachmentsCount,
                                               type,
                                           }) => {
    const [expanded, setExpanded] = useState<boolean>(false);
    const [attachments, setAttachments] = useState<Attachment[]>([]);

    const handleAccordionChange = async (
        _event: React.SyntheticEvent,
        isExpanded: boolean
    ) => {
        setExpanded(isExpanded);

        if (isExpanded) {
            const result = await fetchAttachment(
                evidenceId,
                type === "Comment" ? "comment" : "evidence"
            );
            setAttachments(result.attachments ?? []);
        }
    };

    const extractFileName = (link: string) => {
        const regex = /\/([^/?]+)\?/;
        const match = link?.match(regex);
        if (!match) return { name: null, extension: null, fullName: null };

        const fullName = match[1];
        const name = fullName.split(".")[0];
        const extension = fullName.substring(fullName.lastIndexOf("."));

        return { name, extension, fullName };
    };

    const formatFileName = (name: string | null, extension: string | null) => {
        if (!name || !extension) return "";

        if (name.length < MAX_FILENAME_LENGTH) {
            return `${name} ${extension}`;
        }

        return `${name.substring(0, MAX_FILENAME_LENGTH)}....${extension}`;
    };

    return (
        <Box>
            <Accordion
                sx={ACCORDION_BASE_STYLE}
                expanded={expanded}
                onChange={handleAccordionChange}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={ACCORDION_SUMMARY_STYLE}>
                    <Box sx={{ ...styles.centerVH, gap: 1 }}>
                        <AttachFileIcon fontSize="small" sx={{ color: "primary.main" }} />
                        <Text variant="bodySmall">
                            {t("questions.attachments")} ({attachmentsCount})
                        </Text>
                    </Box>
                </AccordionSummary>

                <AccordionDetails sx={{ background: "#fff", p: 1, borderRadius: 1 }}>
                    {attachments.map((attachment, index) => {
                        const { name, extension } = extractFileName(attachment.link);
                        const isLast = index === attachments.length - 1;

                        return (
                            <Fragment key={uniqueId()}>
                                <Box sx={{ p: "6px 8px" }}>
                                    <Box sx={{ ...styles.centerV, gap: 1 }}>
                                        <Chip sx={CHIP_STYLE} label={extension} />
                                        <Text>{formatFileName(name, extension)}</Text>
                                    </Box>
                                </Box>
                                {!isLast && (
                                    <Divider
                                        sx={{ height: "0.5px" }}
                                        color="#C7CCD1"
                                        orientation="horizontal"
                                        flexItem
                                    />
                                )}
                            </Fragment>
                        );
                    })}
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

const DescriptionEvidence: React.FC<any> = ({
                                                description,
                                                editId,
                                                evidenceId,
                                                setNewDescription,
                                                newDescription,
                                                isEditing,
                                            }) => {
    const formMethods = useForm({ shouldUnregister: true });
    const watchedDesc = formMethods.watch("evidence-description");

    useEffect(() => {
        setNewDescription(description);
    }, [isEditing, description, setNewDescription]);

    useEffect(() => {
        const currentValue = formMethods.getValues()["evidence-description"] ?? description;
        setNewDescription(currentValue);
    }, [watchedDesc, description, formMethods, setNewDescription]);

    const isEditMode = editId === evidenceId;

    return (
        <FormProviderWithForm formMethods={formMethods}>
            <Box width="100%" justifyContent="space-between" sx={{ ...styles.centerV }}>
                {isEditMode ? (
                    <RichEditorField
                        name="evidence-description"
                        label={t("common.description")}
                        disable_label={false}
                        required={true}
                        defaultValue={newDescription ?? ""}
                        setNewDescription={setNewDescription}
                        showEditorMenu={false}
                    />
                ) : (
                    <Box sx={{ py: 1, px: 2, width: "100%" }}>
                        <Text
                            variant="bodyMedium"
                            color="background.secondaryDark"
                            dangerouslySetInnerHTML={{ __html: description }}
                        />
                    </Box>
                )}
            </Box>
        </FormProviderWithForm>
    );
};

export default EvidenceDetail;