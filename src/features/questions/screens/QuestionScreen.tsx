import useDocumentTitle from "@/hooks/useDocumentTitle";
import { useQuestionContext } from "../context";
import RichEditorField from "@/components/common/fields/RichEditorField";
import FormProviderWithForm from "@/components/common/FormProviderWithForm";
import { useForm } from "react-hook-form";
import { Box, Theme } from "@mui/material";

const QuestionScreen = () => {
  useDocumentTitle();
  const { selectedQuestion } = useQuestionContext();
  const formMethods = useForm({ shouldUnregister: true });

  return (
    <Box width="100%">
      <FormProviderWithForm formMethods={formMethods}>
        {" "}
        <RichEditorField
          name="create"
          disable_label={false}
          defaultValue={""}
          showEditorMenu={true}
          richEditorProps={{
            borderTopLeftRadius: "0px",
            borderTopRightRadius: "0px",
            border: "1px solid",
            borderColor: (theme: Theme) =>
              theme.palette.outline?.variant + "!important",
            borderTop: "0px",
          }}
          menuProps={{
            top: "0px",
            boxShadow: "none",
            includeTable: false,
            width: "100%",
            border: "1px solid",
            borderColor: (theme: Theme) => theme.palette.outline?.variant,
            borderBottom: "0px",
            borderBottomLeftRadius: "0px",
            borderBottomRightRadius: "0px",
          }}
        />
      </FormProviderWithForm>
    </Box>
  );
};

export default QuestionScreen;
