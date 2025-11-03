import FormProviderWithForm from "@common/FormProviderWithForm";
import Box from "@mui/material/Box";
import { styles } from "@styles";
import RichEditorField from "@common/fields/RichEditorField";
import { t } from "i18next";
import { useForm } from "react-hook-form";
import {Text} from "@/components/common/Text"
import { useEffect } from "react";

const EvidenceDetail = (props: any) => {
  const {editId , description, id: evidenceId, setNewDesc, newDesc, isEditing} = props
  return (
    <div>
      <DescriptionEvidence description={description} editId={editId} evidenceId={evidenceId} setNewDesc={setNewDesc} newDesc={newDesc} isEditing={isEditing}/>
      <AttachmentEvidence/>
    </div>
  );
};

const AttachmentEvidence= () =>{
  return <></>
}

const DescriptionEvidence = (props: any) =>{
  const {description, editId, evidenceId, setNewDesc, newDesc, isEditing} = props
  const formMethods = useForm({ shouldUnregister: true });
  const watchedDesc = formMethods.watch("evidence-description");
  useEffect(() => {
    setNewDesc(description);
  }, [isEditing]);
  useEffect(() => {
    setNewDesc(formMethods.getValues()["evidence-description"] ?? description);
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
          defaultValue={newDesc ?? ""}
          setNewAdvice={setNewDesc}
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