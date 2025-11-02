import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { Box, IconButton } from "@mui/material";
import { Text } from "@common/Text";
import Avatar from "@mui/material/Avatar";
import { styles } from "@styles";
import { getReadableDate } from "@utils/readable-date";
import { t } from "i18next";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Trans } from "react-i18next";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import RichEditorField from "@common/fields/RichEditorField";
import FormProviderWithForm from "@common/FormProviderWithForm";
import EvidenceDetail from "@/features/questions/ui/evidences/EvidenceDetail";

type EvidenceType = "Positive" | "Negative" | "comment";
interface StyleItem {
  color: string;
  background: string;
  label: string;
}

const EvidenceItem = (props: any) => {
const {createdBy, lastModificationTime, type, id, setConfirmDeleteDialog} = props
const {displayName, pictureLink} = createdBy
const GeneralType = type == "Negative" || type == "Positive" ? "evidence" : "comment";

  const style : Record<EvidenceType, StyleItem>  ={
    Positive: {
      color: "success.dark",
      background: "#A2CDB14d",
      label: "questions.positiveEvidence",
    },
    Negative : {
      color: "#821717",
      background: "#CDA2A24d",
      label: "questions.positiveEvidence",
    },
    comment: {
      color: "success.dark",
      background: "#A2CDB14d",
      label: "questions.positiveEvidence",
    }
  }
  const typeStyle = style[(type as EvidenceType)] ?? style.comment;


    return (
      <Accordion sx={{ mb: 2 }}>
          <AccordionSummary
            aria-controls="panel1-content"
            id="panel1-header"
            sx={{
              borderInlineStart: `2px solid ${typeStyle.color}`,
              background: typeStyle.background,
              borderRadius: 1,
              minHeight: "41px !important",
              height: "41px",
              "&.Mui-expanded": {
                minHeight: "41px !important"
              },
             "& .MuiAccordionSummary-content.Mui-expanded" : {
                m: 0,
             }
            }}
          >
            <Box sx={{...styles.centerV, justifyContent: "space-between", flex: 1 }}>
            <Box sx={{...styles.centerVH, gap: 1}}>
              <Avatar
                src={pictureLink}
                sx={{ width: 24, height: 24, fontSize: 16 }}
              />
              <Text variant={"bodyMedium"} color={"background.secondaryDark"}>{displayName}</Text>
              <Text variant={"bodySmall"} color={"info.main"}>{getReadableDate(lastModificationTime, "absolute", false)}</Text>
            </Box>
              <Box sx={{...styles.centerVH, gap: 1}}>
                <Text variant={"labelSmall"} sx={{color: typeStyle.color, background: typeStyle.background, p: "4px 8px"}} >{t(typeStyle.label)}</Text>
                <ActionButton type={GeneralType} setConfirmDeleteDialog={setConfirmDeleteDialog} evidenceId={id} />
              </Box>
          </Box>
          </AccordionSummary>
          <AccordionDetails>

            <EvidenceDetail/>
          </AccordionDetails>
      </Accordion>
    );
};

const ActionButton = (props: any) =>{
  const { setConfirmDeleteDialog, evidenceId, type } = props
  const items = [
    {
      icon:  <EditOutlinedIcon fontSize="small"   sx={{width: "24px", height: "24px"}} />,
      lable: <Trans i18nKey="common.edit" />,
      onClick: () => {}
    },
    {
      icon: <DeleteOutlinedIcon fontSize="small"  sx={{width: "24px", height: "24px"}} />,
      text: <Trans i18nKey="common.delete" />,
      onClick: () => setConfirmDeleteDialog({ open: true, evidenceId, type })
    }
  ]

  return (
    <Box sx={{...styles.centerV, gap: 1}} onClick={(e)=>e.stopPropagation()}>
      {items.map(item =>{
        return (
          <Box>
            <IconButton onClick={item.onClick} sx={{p: 0.4}} >{item.icon}</IconButton>
          </Box>
        )
      })}
    </Box>
  )
}

export default EvidenceItem;