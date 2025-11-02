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

const EvidenceItem = (props: any) => {

  return (
    <Box sx={{ mb: 2 }}>
      <HeaderItem {...props}/>
      {/*<DetailItem/>*/}
    </Box>
  );
};

const HeaderItem = (props: any) =>{
  const { createdBy, lastModificationTime, type, id, setConfirmDeleteDialog } = props;
  const { displayName, pictureLink } = createdBy;
   const { boxType } = useEvidenceBox(type)

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
          <Text variant={"bodyMedium"} color={"background.secondaryDark"}>
            {displayName}
          </Text>
          <Text variant={"bodySmall"} color={"info.main"}>
            {getReadableDate(lastModificationTime, "absolute", false)}
          </Text>
        </Box>
        <Box sx={{ ...styles.centerVH, gap: 1 }}>
          <Text
            variant={"labelSmall"}
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
          />
        </Box>
      </Box>
  )
}

const ActionButton = (props: any) => {

  const { setConfirmDeleteDialog, evidenceId, type } = props;

  const items = [
    ...(type === "comment"
      ? [{
        icon: <CheckIcon fontSize="small" sx={{ width: 24, height: 24 }} />,
        onClick: () => {},
      }]
      : []),
    {
      icon: (
        <EditOutlinedIcon
          fontSize="small"
          sx={{ width: "24px", height: "24px" }}
        />
      ),
      onClick: () => {},
    },
    {
      icon: (
        <DeleteOutlinedIcon
          fontSize="small"
          sx={{ width: "24px", height: "24px" }}
        />
      ),
      onClick: () => setConfirmDeleteDialog({ open: true, evidenceId, type }),
    }
  ];

  return (
    <Box
      sx={{ ...styles.centerV, gap: 1 }}
      onClick={(e) => e.stopPropagation()}
    >
      {items.map((item) => {
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
