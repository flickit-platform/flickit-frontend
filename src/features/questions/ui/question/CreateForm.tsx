import { Controller } from "react-hook-form";
import {
  Box,
  Theme,
  Tabs,
  Tab,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import FormProviderWithForm from "@/components/common/FormProviderWithForm";
import RichEditorField from "@/components/common/fields/RichEditorField";
import { Text } from "@/components/common/Text";
import { LoadingButton } from "@mui/lab";
import { useCreateEvidenceForm } from "../../model/question/useCreateEvidenceForm";

enum EVIDENCE_TYPE {
  POSITIVE = "POSITIVE",
  NEGATIVE = "NEGATIVE",
}

type CreateFormViewProps = UseCreateEvidenceFormResult;

const CreateFormView = ({
  showTabs,
  tab,
  onTabChange,
  formMethods,
  charCount,
  limit,
  disabled,
  loading,
  onSubmit,
}: CreateFormViewProps) => {
  const { t } = useTranslation();

  return (
    <Box width="100%">
      <FormProviderWithForm formMethods={formMethods}>
        {/* Tabs */}
        {showTabs && (
          <Tabs
            value={tab}
            onChange={onTabChange}
            aria-label="evidence tabs"
            variant="fullWidth"
            sx={{
              border: "1px solid",
              borderColor: "outline.variant",
              bgcolor: "background.background",
              minHeight: 36,
              borderRadius: "4px 4px 0px 0px",
              px: 0,
              "& .MuiTab-root": { minHeight: 36, textTransform: "none" },
              "& .MuiTabs-indicator": { height: 2 },
            }}
          >
            <Tab
              value={EVIDENCE_TYPE.POSITIVE}
              label={
                <Text variant="semiBoldSmall">
                  {t("questions_temp.positiveEvidenceLabel")}
                </Text>
              }
            />
            <Tab
              value={EVIDENCE_TYPE.NEGATIVE}
              label={
                <Text variant="semiBoldSmall">
                  {t("questions_temp.negativeEvidenceLabel")}
                </Text>
              }
            />
          </Tabs>
        )}

        {/* Editor */}
        <Box>
          <RichEditorField
            name="description"
            disable_label={false}
            defaultValue=""
            showEditorMenu
            richEditorProps={{
              border: "1px solid",
              borderColor: (theme: Theme) =>
                theme.palette.outline?.variant + "!important",
              borderBlock: "0px",
              maxHeight: "72px",
              overflow: "auto",
              borderRadius: "0px !important",
            }}
            menuProps={{
              variant: "inline",
              boxShadow: "none",
              includeTable: false,
              width: "100%",
              border: "1px solid",
              borderColor: "outline.variant",
              borderBottom: "0px",
              borderRadius: showTabs
                ? "0px !important"
                : "4px  4px 0px 0px !important",
            }}
          />
        </Box>

        {/* footer: checkbox + counter */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: "1px solid",
            borderColor: "outline.variant",
            borderTop: 0,
            borderRadius: "0px 0px 4px 4px",
            px: 1,
            py: 0.5,
            bgcolor: "background.containerLowest",
          }}
        >
          <Controller
            name="autoOpenAttachment"
            control={formMethods.control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={!!field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                }
                label={
                  <Text variant="semiBoldSmall">
                    {t("questions_temp.addAttachmentsAfterCreation")}
                  </Text>
                }
                sx={{ m: 0 }}
              />
            )}
          />

          <Text
            variant="bodySmall"
            color={charCount > limit ? "error.main" : "background.onVariant"}
          >
            {charCount ?? 0} / {limit}
          </Text>
        </Box>

        {/* Submit */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", my: 0.5 }}>
          <LoadingButton
            type="button"
            variant="contained"
            color="primary"
            size="small"
            disabled={disabled}
            onClick={onSubmit}
            loading={loading}
          >
            {showTabs
              ? t("questions_temp.createEvidenceLabel")
              : t("questions_temp.createCommentLabel")}
          </LoadingButton>
        </Box>
      </FormProviderWithForm>
    </Box>
  );
};

const CreateForm = ({ showTabs }: { showTabs?: boolean }) => {
  const logic = useCreateEvidenceForm({ showTabs });
  return <CreateFormView {...logic} />;
};

export default CreateForm;
export { EVIDENCE_TYPE, CreateFormView };
