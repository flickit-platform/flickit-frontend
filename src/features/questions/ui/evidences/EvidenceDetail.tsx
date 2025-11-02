import FormProviderWithForm from "@common/FormProviderWithForm";
import Box from "@mui/material/Box";
import { styles } from "@styles";
import RichEditorField from "@common/fields/RichEditorField";
import { t } from "i18next";
import { useForm } from "react-hook-form";

const EvidenceDetail = () => {
  return (
    <div>
      <DescriptionEvidence/>
      <AttachmentEvidence/>
    </div>
  );
};

const AttachmentEvidence= () =>{
  return <></>
}

const DescriptionEvidence = () =>{
  const formMethods = useForm({ shouldUnregister: true });

  return (
    <FormProviderWithForm formMethods={formMethods}>
      <Box
        width="100%"
        justifyContent="space-between"
        mt={{ xs: 26, sm: 17, md: 11, xl: 7 }}
        sx={{ ...styles.centerV }}
      >
        <RichEditorField
          name="evidence-description"
          label={t("common.description")}
          disable_label={false}
          required={true}
          defaultValue={formMethods.getValues("evidence-description")}
          showEditorMenu={true}
        />
      </Box>
    </FormProviderWithForm>
  )
}

export default EvidenceDetail;