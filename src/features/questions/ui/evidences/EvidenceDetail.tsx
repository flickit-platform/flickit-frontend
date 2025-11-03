import { Fragment } from "react"
import FormProviderWithForm from "@common/FormProviderWithForm";
import Box from "@mui/material/Box";
import { styles } from "@styles";
import RichEditorField from "@common/fields/RichEditorField";
import { t } from "i18next";
import { useForm } from "react-hook-form";
import {Text} from "@/components/common/Text"
import React, {useEffect, useState} from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import uniqueId from "@/utils/unique-id";

const EvidenceDetail = (props: any) => {
  const {editId , description, id: evidenceId, setNewDescription, newDescription, isEditing, fetchAttachment, attachmentsCount, type} = props

    return (
    <div>
      <DescriptionEvidence description={description} editId={editId} evidenceId={evidenceId} setNewDescription={setNewDescription} newDescription={newDescription} isEditing={isEditing}/>
        {attachmentsCount > 0 && <AttachmentEvidence type={type} fetchAttachment={fetchAttachment} evidenceId={evidenceId} attachmentsCount={attachmentsCount}/>}
    </div>
  );
};

const AttachmentEvidence= (props: any) =>{
    const {fetchAttachment, evidenceId, attachmentsCount, type} = props
    const [expanded, setExpanded] = useState<boolean>(false);
    const [attachments, setAttachments] = useState([])
    const accordionBaseStyle = {
        background: "#66809914",
        boxShadow: "none",
        borderRadius: "4px !important",
        border: ".5px solid #66809980",
        mb: 1,
        "&:before": {
            display: "none",
        },
    };
    const accordionSummaryStyle = {
        flexDirection: "row",
        px: 1,
        py: "6px",
        minHeight: "unset",
        borderRadius: 1,
        border: ".5px solid #66809980",
        background: `#66809914`,
        "&.Mui-expanded": { margin: 0, minHeight: "unset" },
        "& .MuiAccordionSummary-content": {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            m: 0
        },
        "& .MuiAccordionSummary-content.Mui-expanded": { margin: 0 },
        "& .MuiAccordionSummary-expandIconWrapper": {
            paddingInlineEnd: "10px",
        },
    };

    const handleAccordionChange = async (
        event: React.SyntheticEvent,
        isExpanded: boolean,
    ) => {
        setExpanded(isExpanded);
       const result = await fetchAttachment(evidenceId, type == "Comment"? "comment": "evidence" )
        setAttachments(result.attachments ?? [])
    };


  return (
      <Box>
          <Accordion   sx={accordionBaseStyle} expanded={expanded} onChange={handleAccordionChange}>
              <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={accordionSummaryStyle}
              >
                  <Box sx={{...styles.centerVH, gap: 1}}>
                  <AttachFileIcon fontSize={"small"} sx={{color: "primary.main"}}/>
                  <Text variant="bodySmall">{t("questions.attachments")} ({attachmentsCount})</Text>
              </Box>
              </AccordionSummary>
              <AccordionDetails
              sx={{background: "#fff", p: 1, borderRadius: 1}}
              >
                  {attachments.map((attachment ,index) => {
                      const { link } = attachment;
                      const reg = /\/([^/?]+)\?/;
                      const match = link?.match(reg);
                      const nameWithExp = match ? match[1] : null;
                      const name = match ? match[1].split(".")[0] : null;
                      const exp = nameWithExp?.substring(nameWithExp.lastIndexOf("."));

                      const isLast = index === attachments.length - 1;
                      return (<Fragment key={uniqueId()}>
                              <Box sx={{ p: "6px 8px"}}>
                                  <Box sx={{...styles.centerV, gap: 1}}>
                                      <Chip sx={{color:"background.secondaryDark",
                                          height:16,
                                          fontSize: '10px',
                                          borderRadius: 1,
                                          "& .MuiChip-label":{
                                              p: "0px 4px"
                                          }
                                      }} label={exp} />
                                      <Text> {name.length < 20 ?  `${name} ${exp}` :`${name.substring(0,20)}....${exp}` }</Text>
                                  </Box>

                              </Box>
                              {!isLast && <Divider sx={{height: "0.5px"}} color={"#C7CCD1"} orientation="horizontal" flexItem  /> }
                          </Fragment>
                      )
                  })}
              </AccordionDetails>
          </Accordion>
      </Box>
  )
}

const DescriptionEvidence = (props: any) =>{
  const {description, editId, evidenceId, setNewDescription, newDescription, isEditing} = props
  const formMethods = useForm({ shouldUnregister: true });
  const watchedDesc = formMethods.watch("evidence-description");
  useEffect(() => {
      setNewDescription(description);
  }, [isEditing]);
  useEffect(() => {
      setNewDescription(formMethods.getValues()["evidence-description"] ?? description);
  }, [watchedDesc]);

  return (
    <FormProviderWithForm formMethods={formMethods}>
      <Box
        width="100%"
        justifyContent="space-between"
        // mt={{ xs: 26, sm: 17, md: 11, xl: 7 }}
        sx={{ ...styles.centerV }}
      >
        {editId == evidenceId ?  <RichEditorField
          name="evidence-description"
          label={t("common.description")}
          disable_label={false}
          required={true}
          defaultValue={newDescription ?? ""}
          setNewDescription={setNewDescription}
          showEditorMenu={false}
        /> :
          <Box sx={{py: 1, px: 2, width: "100%"}}>
            <Text  variant="bodyMedium" color="background.secondaryDark" dangerouslySetInnerHTML={{
              __html: description,
            }} ></Text>
          </Box>
        }
      </Box>
    </FormProviderWithForm>
  )
}

export default EvidenceDetail;