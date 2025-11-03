import React, { useState } from "react";
import { Box, IconButton, Avatar } from "@mui/material";
import { t } from "i18next";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { styles } from "@styles";
import { getReadableDate } from "@utils/readable-date";
import { Text } from "@/components/common/Text";
import { useQuery } from "@/hooks/useQuery";
import { useServiceContext } from "@providers/service-provider";
import useEvidenceBox from "@/features/questions/model/evidenceTabs/useEvidenceBox";
import EvidenceDetail from "@/features/questions/ui/evidences/EvidenceDetail";

interface ButtonConfig {
  icon: React.ReactNode;
  onClick: () => void;
}

interface EvidenceItemProps {
  id: string;
  refreshTab: (type: string) => Promise<void>;
  createdBy: {
    displayName: string;
    pictureLink: string;
  };
  lastModificationTime: string;
  type: string;
  setConfirmDeleteDialog: (state: any) => void;
  editable: boolean;
  description: string;
  attachmentsCount?: number;
  fetchAttachment?: (id: string, type: string) => Promise<any>;
}

const ICON_SIZE = { width: 24, height: 24 };

const EvidenceItem: React.FC<EvidenceItemProps> = (props) => {
  const { id, refreshTab } = props;
  const [editId, setEditId] = useState<string | null>(null);
  const [newDescription, setNewDescription] = useState("");
  const { service } = useServiceContext();

  const isEditing = editId === id;

  const toggleEditMode = (evidenceId: string) => {
    setEditId((prev) => (prev !== evidenceId ? evidenceId : null));
  };

  const addEvidence = useQuery({
    service: (args, config) => service.questions.evidences.save(args, config),
    runOnMount: false,
  });

  const handleSubmit = async (evidenceId: string, evidenceType: string) => {
    await addEvidence.query({
      description: newDescription,
      id: evidenceId,
      type: evidenceType === "Comment" ? null : evidenceType.toUpperCase(),
    });

    const tabType = evidenceType === "Comment" ? "comment" : "evidence";
    await refreshTab(tabType);
  };

  return (
      <Box sx={{ mb: 2 }}>
        <HeaderItem
            {...props}
            toggleEditMode={toggleEditMode}
            editId={editId}
            submit={handleSubmit}
            isEditing={isEditing}
        />
        <EvidenceDetail
            {...props}
            editId={editId}
            setNewDescription={setNewDescription}
            newDescription={newDescription}
            isEditing={isEditing}
        />
      </Box>
  );
};

const HeaderItem: React.FC<any> = ({
                                     createdBy,
                                     lastModificationTime,
                                     type,
                                     id,
                                     setConfirmDeleteDialog,
                                     editable,
                                     toggleEditMode,
                                     editId,
                                     submit,
                                     isEditing,
                                   }) => {
  const { displayName, pictureLink } = createdBy;
  const { boxType } = useEvidenceBox(type, isEditing);

  const headerStyle = {
    ...styles.centerV,
    justifyContent: "space-between",
    flex: 1,
    px: 2,
    py: 1,
    background: "#E8EBEE",
    borderRadius: 1,
    borderInlineStart: `4px solid ${boxType.color}`,
  };

  const labelStyle = {
    color: boxType.color,
    p: "4px 8px",
    border: `0.5px solid ${boxType.color}`,
    borderRadius: 1,
  };

  return (
      <Box sx={headerStyle}>
        <Box sx={{ ...styles.centerVH, gap: 1 }}>
          <Avatar src={pictureLink} sx={{ ...ICON_SIZE, fontSize: 16 }} />
          <Text variant="bodyMedium" color="background.secondaryDark">
            {displayName}
          </Text>
          <Text variant="bodySmall" color="info.main">
            {getReadableDate(lastModificationTime, "absolute", false)}
          </Text>
        </Box>

        <Box sx={{ ...styles.centerVH, gap: 1 }}>
          <Text variant="labelSmall" sx={labelStyle}>
            {t(boxType.label)}
          </Text>
          <ActionButtons
              type={boxType?.type}
              setConfirmDeleteDialog={setConfirmDeleteDialog}
              evidenceId={id}
              editable={editable}
              toggleEditMode={toggleEditMode}
              isEditing={isEditing}
              submit={submit}
          />
        </Box>
      </Box>
  );
};

const ActionButtons: React.FC<any> = ({
                                        setConfirmDeleteDialog,
                                        evidenceId,
                                        type,
                                        editable,
                                        toggleEditMode,
                                        isEditing,
                                        submit,
                                      }) => {
  const handleDelete = () => {
    setConfirmDeleteDialog({ open: true, evidenceId, type });
  };

  const createButton = (icon: React.ReactNode, onClick: () => void): ButtonConfig => ({
    icon,
    onClick,
  });

  const normalButtons: ButtonConfig[] = [
    ...(type === "comment"
        ? [createButton(<CheckIcon fontSize="small" sx={ICON_SIZE} />, () => {})]
        : []),
    ...(editable
        ? [
          createButton(
              <EditOutlinedIcon fontSize="small" sx={ICON_SIZE} />,
              () => toggleEditMode(evidenceId)
          ),
        ]
        : []),
    createButton(<DeleteOutlinedIcon fontSize="small" sx={ICON_SIZE} />, handleDelete),
  ];

  const editButtons: ButtonConfig[] = [
    createButton(
        <CheckIcon fontSize="small" sx={ICON_SIZE} />,
        () => submit(evidenceId, type)
    ),
    createButton(
        <CloseIcon fontSize="small" sx={ICON_SIZE} />,
        () => toggleEditMode(evidenceId)
    ),
  ];

  const buttons = isEditing ? editButtons : normalButtons;

  return (
      <Box sx={{ ...styles.centerV, gap: 1 }} onClick={(e) => e.stopPropagation()}>
        {buttons.map((button, index) => (
            <IconButton key={index} onClick={button.onClick} sx={{ p: 0.4 }}>
              {button.icon}
            </IconButton>
        ))}
      </Box>
  );
};

export default EvidenceItem;