import { Box, IconButton } from "@mui/material";
import { styles } from "@styles";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import useEvidenceBox from "@/features/questions/model/evidenceTabs/useEvidenceBox";
import Avatar from "@mui/material/Avatar";
import { getReadableDate } from "@utils/readable-date";
import { Text } from "@/components/common/Text";
import { t } from "i18next";
import CheckIcon from "@mui/icons-material/Check";
import EvidenceDetail from "@/features/questions/ui/evidences/EvidenceDetail";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useQuery } from "@/hooks/useQuery";
import { useServiceContext } from "@providers/service-provider";

const EvidenceItem = (props: any) => {
  const {id, refreshTab} = props
  const [editId, setEditId] = useState<string | null>(null);
  const [newDescription,setNewDescription] = useState("")
  const { service } = useServiceContext();
  const isEditing = editId === id;
  const toggleEditMode = (id:any) =>{
    setEditId(prev => prev != id ? id : null)
  }

  const addEvidence = useQuery({
    service: (args, config) => service.questions.evidences.save(args, config),
    runOnMount: false,
  });

  const submit = async (id: any, type: any) => {
    await addEvidence.query({
      description: newDescription,
      id: id,
      type: type == "Comment" ? null :  type.toUpperCase(),
    });
    await refreshTab(type === "Comment" ? "comment" : "evidence");
  }


  return (
    <Box sx={{ mb: 2 }}>
      <HeaderItem {...props} toggleEditMode={toggleEditMode} editId={editId} submit={submit} isEditing={isEditing}/>
      <EvidenceDetail {...props} editId={editId} setNewDescription={setNewDescription} newDescription={newDescription} isEditing={isEditing}/>
    </Box>
  );
};

const HeaderItem = (props: any) =>{
  const { createdBy, lastModificationTime, type, id, setConfirmDeleteDialog, editable, toggleEditMode, editId, submit, isEditing } = props;
  const { displayName, pictureLink } = createdBy;
  const { boxType } = useEvidenceBox(type, isEditing);

  return (
      <Box
        sx={{ ...styles.centerV, justifyContent: "space-between", flex: 1, px: 2, py: 1, background: "#E8EBEE",
      borderRadius: 1, borderInlineStart: `4px solid ${boxType.color}`
      }}
      >
        <Box sx={{ ...styles.centerVH, gap: 1 }}>
          <Avatar
            src={pictureLink}
            sx={{ width: 24, height: 24, fontSize: 16 }}
          />
          <Text variant="bodyMedium" color={"background.secondaryDark"}>
            {displayName}
          </Text>
          <Text variant="bodySmall" color={"info.main"}>
            {getReadableDate(lastModificationTime, "absolute", false)}
          </Text>
        </Box>
        <Box sx={{ ...styles.centerVH, gap: 1 }}>
          <Text
            variant="labelSmall"
            sx={{
              color: boxType.color,
              p: "4px 8px",
              border: `0.5px solid ${boxType.color}`,
              borderRadius: 1
            }}
          >
            {t(boxType.label)}
          </Text>
          <ActionButton
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
  )
}

const ActionButton = (props: any) => {

  const { setConfirmDeleteDialog, evidenceId, type, editable, toggleEditMode, isEditing, submit } = props;
  const handleDelete = () => {
    setConfirmDeleteDialog({ open: true, evidenceId, type });
  };

  const normalButtons  = [
    ...(type === "comment"
      ? [{
        icon: <CheckIcon fontSize="small" sx={{ width: 24, height: 24 }} />,
        onClick: () => {},
      }]
      : []),
    ...(editable
      ? [{
        icon: <EditOutlinedIcon fontSize="small" sx={{ width: 24, height: 24 }} />,
        onClick: ()=> toggleEditMode(evidenceId),
      }]
      : []),

    {
      icon: (
        <DeleteOutlinedIcon
          fontSize="small"
          sx={{ width: "24px", height: "24px" }}
        />
      ),
      onClick: handleDelete,
    }
  ];

  const editButtons  = [
    {
      icon: (
        <CheckIcon
          fontSize="small"
          sx={{ width: "24px", height: "24px" }}
        />
      ),
      onClick: ()=> submit(evidenceId, type),
    },
    {
      icon: (
        <CloseIcon
          fontSize="small"
          sx={{ width: "24px", height: "24px" }}
        />
      ),
      onClick: () => toggleEditMode(evidenceId),
    }
  ]
  const buttons = isEditing ? editButtons : normalButtons;
  return (
    <Box
      sx={{ ...styles.centerV, gap: 1 }}
      onClick={(e) => e.stopPropagation()}
    >
      {buttons.map((item) => {
        return (
          <Box>
            <IconButton onClick={item.onClick} sx={{ p: 0.4 }}>
              {item.icon}
            </IconButton>
          </Box>
        );
      })}
    </Box>
  );
};

export default EvidenceItem;
