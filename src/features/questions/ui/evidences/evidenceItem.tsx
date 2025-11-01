import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { Box } from "@mui/material";
import { Text } from "@common/Text";
import Avatar from "@mui/material/Avatar";
import { styles } from "@styles";
import { getReadableDate } from "@utils/readable-date";
import { t } from "i18next";
import MoreActions from "@common/MoreActions";
import useMenu from "@/hooks/useMenu";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Trans } from "react-i18next";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { v3Tokens } from "@config/tokens";

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
                <Actions
                  type={GeneralType}
                  setConfirmDeleteDialog={setConfirmDeleteDialog}
                  evidenceId={id}
                />
              </Box>

          </Box>

          </AccordionSummary>
          <AccordionDetails>

          </AccordionDetails>
      </Accordion>
    );
};

const Actions = (props: any) => {
const { setConfirmDeleteDialog, evidenceId, type } = props
  const editEvidence = () =>{

  }


  return (
    <MoreActions
      {...useMenu()}
      boxProps={{ ml: 0.2 }}
      // loading={}
      items={[
        {
          icon: <EditOutlinedIcon fontSize="small" />,
          text: <Trans i18nKey="common.edit" />,
          onClick: editEvidence,
        },
        {
          icon: <DeleteOutlinedIcon fontSize="small" />,
          text: <Trans i18nKey="common.delete" />,
          onClick: () => setConfirmDeleteDialog({ open: true, evidenceId, type })
        }
      ]}
      color={v3Tokens.surface.on}
      IconButtonProps={{ width: "20px", height: "20px" }}
      hideInnerIconButton={false}
    />
  )
}

export default EvidenceItem;