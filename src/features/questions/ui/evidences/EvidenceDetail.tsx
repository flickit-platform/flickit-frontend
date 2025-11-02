import FormProviderWithForm from "@common/FormProviderWithForm";
import Box from "@mui/material/Box";
import { styles } from "@styles";
import RichEditorField from "@common/fields/RichEditorField";
import { t } from "i18next";
import { useForm } from "react-hook-form";
import {Text} from "@/components/common/Text"

const EvidenceDetail = (props: any) => {
  const {edit , description, id: evidenceId} = props
  return (
    <div>
      <DescriptionEvidence description={description} edit={edit} evidenceId={evidenceId}/>
      <AttachmentEvidence/>
    </div>
  );
};

const AttachmentEvidence= () =>{
  return <></>
}

const DescriptionEvidence = (props: any) =>{
  const {description, edit, evidenceId} = props
  const formMethods = useForm({ shouldUnregister: true });
  return (
    <FormProviderWithForm formMethods={formMethods}>
      <Box
        width="100%"
        justifyContent="space-between"
        // mt={{ xs: 26, sm: 17, md: 11, xl: 7 }}
        sx={{ ...styles.centerV }}
      >
        {edit == evidenceId ?  <RichEditorField
          name="evidence-description"
          label={t("common.description")}
          disable_label={false}
          required={true}
          defaultValue={description}
          showEditorMenu={false}
        /> :
        <Text  dangerouslySetInnerHTML={{
          __html: description,
        }} ></Text>
        }

      </Box>
    </FormProviderWithForm>
  )
}

export default EvidenceDetail;