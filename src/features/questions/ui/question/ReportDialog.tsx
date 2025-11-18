import React, { useMemo, useState } from "react";
import { CEDialog, CEDialogActions } from "@common/dialogs/CEDialog";
import Box from "@mui/material/Box";
import { styles } from "@styles";
import FormProviderWithForm from "@common/FormProviderWithForm";
import { Controller, useForm } from "react-hook-form";
import { t } from "i18next";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import { Checkbox, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Text } from "@common/Text";
import { InputFieldUC } from "@common/fields/InputField";
import { useForm as useFormSpree } from "@formspree/react";
import showToast from "@utils/toast-error";

type ReportItem = { id: number; title: string };
const ReportItems: ReportItem[] = [
  { id: 1, title: "questionIsUnclear" },
  { id: 2, title: "questionIsIncorrect" },
  { id: 3, title: "questionHaveMultipleAnswers" },
  { id: 4, title: "optionsNotMatch" },
  { id: 5, title: "questionPhraseBetter" },
  { id: 6, title: "other" },
];

const ReportDialog = (props: any) => {
  const { onClose, context, ...rest } = props;

  const abortController = useMemo(() => new AbortController(), [rest.open]);
  const [state, handleSubmitSpree] = useFormSpree(
    import.meta.env.VITE_FORM_SPREE,
  );
  const [dialogKey, setDialogKey] = useState(0);

  const formMethods = useForm({
    shouldUnregister: true,
    defaultValues: {
      reportItems: [],
      feedbackQuestionReport: "",
    } as any,
  });

  const { control, handleSubmit } = formMethods;

  const onSubmit = (data: any) => {
    const questionId = context?.data?.questionId ?? "";
    const reportData = {
      ...data,
      questionId,
      type: `Report Question - ${globalThis.location.href}`,
    };
    handleSubmitSpree(reportData).then(() => {
      showToast(t("questions_temp.reportSentSuccessfully"), {
        variant: "success",
      });
      close();
    });
  };

  const close = () => {
    abortController.abort();
    formMethods.reset();
    setDialogKey((prev) => prev + 1);
    onClose();
  };

  return (
    <CEDialog
      {...rest}
      key={dialogKey}
      closeDialog={close}
      fullWidth
      maxWidth="sm"
      title={
        <Box sx={{ ...styles.centerVH, gap: "6px" }}>
          <ReportGmailerrorredIcon
            sx={{ fontSize: "24px", color: "primary.contrastText" }}
          />
          <Text color="primary.contrastText" variant="semiBoldXLarge">
            {t("questions_temp.reportQuestion")}
          </Text>
        </Box>
      }
      titleStyle={{ marginBottom: 0 }}
      contentStyle={{ padding: "32px 32px 16px" }}
      style={{ paddingTop: "16px", background: "#F3F5F6" }}
    >
      <Box sx={{ mb: "32px" }}>
        <Text fontWeight={600} variant="bodyMedium">
          {t("questions_temp.whatIssuesLikeToReport")}
        </Text>
      </Box>

      <FormProviderWithForm formMethods={formMethods}>
        <Controller
          name="reportItems"
          control={control}
          render={({ field }) => (
            <ToggleButtonGroup
              value={field.value}
              onChange={(event, newValues) => field.onChange(newValues || [])}
              orientation="vertical"
              exclusive={false}
              sx={{
                display: "flex",
                flexDirection: "column",
                "& .MuiToggleButtonGroup-grouped": {
                  border: "1px solid",
                  borderColor: "outline.variant",
                  borderRadius: "8px !important",
                  margin: 0,
                },
                "& .MuiToggleButtonGroup-grouped:not(:first-of-type)": {
                  marginTop: "8px",
                  borderTop: "1px solid",
                },
              }}
            >
              {ReportItems.map(({ id, title }) => (
                <Box
                  key={id}
                  display="flex"
                  mb={1}
                  gap={1}
                  sx={{ ...styles.centerV }}
                >
                  <ToggleButton
                    value={title}
                    data-cy="answer-option"
                    color="primary"
                    size="large"
                    sx={{
                      p: 0,
                      paddingInlineStart: "4px",
                      paddingInlineEnd: "12px",
                      borderRadius: "8px",
                      border: "1px solid",
                      justifyContent: "flex-start",
                      bgcolor: "transparent",
                      "&.Mui-selected": {
                        bgcolor: "primary.states.selected",
                        borderColor: "primary.main",
                      },
                      "&.Mui-disabled": {
                        bgcolor: "background.container",
                        color: "outline.variant",
                      },
                    }}
                  >
                    <Checkbox
                      checked={field.value.includes(title)}
                      size="small"
                      color="primary"
                      disableRipple
                    />
                    <Text
                      variant="bodyMedium"
                      textTransform="initial"
                      color={"text.primary"}
                      textAlign="start"
                    >
                      {t(`questions_temp.${title}`)}
                    </Text>
                  </ToggleButton>
                </Box>
              ))}
            </ToggleButtonGroup>
          )}
        />

        <Box sx={{ mt: 3 }}>
          <InputFieldUC
            name="feedbackQuestionReport"
            label={t("questions_temp.moreDetails")}
            multiline
            rows={4}
          />
        </Box>

        <CEDialogActions
          closeDialog={close}
          submitButtonLabel={"common.submit"}
          hideCancelButton
          onSubmit={handleSubmit(onSubmit)}
          loading={state.submitting}
        />
      </FormProviderWithForm>
    </CEDialog>
  );
};

export default ReportDialog;
