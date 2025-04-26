import React, { useEffect, useState } from "react";
import { Grid, Box, Typography, Divider, Switch, DialogProps } from "@mui/material";
import { Trans } from "react-i18next";
import { useForm } from "react-hook-form";
import { useServiceContext } from "@/providers/ServiceProvider";
import { ICustomError } from "@/utils/CustomError";
import toastError from "@/utils/toastError";
import { useQuery } from "@/utils/useQuery";
import { styles } from "@styles";
import {
  CEDialog,
  CEDialogActions,
} from "@/components/common/dialogs/CEDialog";
import FormProviderWithForm from "@/components/common/FormProviderWithForm";
import OptionsSection from "./OptionsSection";
import { t } from "i18next";
import { useParams } from "react-router-dom";
import ImpactSection from "./ImpactSection";
import AutocompleteAsyncField, {
  useConnectAutocompleteField,
} from "@/components/common/fields/AutocompleteAsyncField";
import { useKitLanguageContext } from "@providers/KitProvider";
import { useTranslationUpdater } from "@/hooks/useTranslationUpdater";
import MultiLangTextField from "@common/fields/MultiLangTextField";
import { theme } from "@/config/theme";
import NavigationButtons from "@/components/common/buttons/NavigationButtons";

interface ITempValue {
  title: string;
  hint: string;
  translations: { [key: string]: { title: string; hint: string } } | null;
}

interface IQuestionDetailsDialogDialogProps extends DialogProps {
  onClose: () => void;
  onPreviousQuestion: () => void;
  onNextQuestion: () => void;
  context?: any;
  questionsLength: number;
  fetchQuery: any;
}

const QuestionDetailsContainer = (props: IQuestionDetailsDialogDialogProps) => {
  const {
    onClose: closeDialog,
    onPreviousQuestion,
    onNextQuestion,
    context = {},
    questionsLength,
    fetchQuery,
    ...rest
  } = props;
  const { question = {}, index } = context;

  const { kitVersionId = "" } = useParams();

  const { service } = useServiceContext();
  const formMethods = useForm({ shouldUnregister: true });

  const { kitState } = useKitLanguageContext();
  const langCode = kitState.translatedLanguage?.code ?? "";

  const { updateTranslation } = useTranslationUpdater(langCode);

  const [selectedAnswerRange, setSelectedAnswerRange] = useState<
    number | undefined
  >(question?.answerRangeId);

  const [tempValue, setTempValue] = useState<ITempValue>({
    title: "",
    hint: "",
    translations: null,
  });

  const fetchMeasures = useQuery({
    service: () => service.kitVersions.measures.getAll({ kitVersionId }),
  });
  const fetchOptions = useQuery({
    service: () =>
      service.kitVersions.questions.getOptions({
        kitVersionId,
        questionId: question.id,
      }),
  });

  useEffect(() => {
    const measureObject = fetchMeasures.data?.items?.find(
      (m: any) => m.id === question.measureId,
    );
    formMethods.setValue("measure", measureObject);
  }, [fetchMeasures?.data?.items]);

  useEffect(() => {
    if (rest.open && question.id) {
      Promise.all([fetchOptions.query(), fetchMeasures.query()]);

      setTempValue({
        title: question.title ?? "",
        hint: question.hint ?? "",
        translations: question.translations ?? "",
      });

      formMethods.reset({
        options: question.options ?? [{ text: "" }],
        mayNotBeApplicable: question.mayNotBeApplicable ?? false,
        advisable: question.advisable ?? false,
      });
      setSelectedAnswerRange(question.answerRangeId);
    }
  }, [rest.open, question.id]);

  const handleSubmit = async (data: any) => {
    try {
      await service.kitVersions.questions.update({
        kitVersionId,
        questionId: question.id,
        data: {
          ...data,
          ...tempValue,
          index: question.index,
          answerRangeId: selectedAnswerRange,
          measureId: data.measure?.id ?? null,
        },
      });
      fetchQuery.query();
      closeDialog();
    } catch (err) {
      toastError(err as ICustomError);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempValue((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <CEDialog
      {...rest}
      closeDialog={closeDialog}
      sx={{ width: "100%", paddingInline: 4 }}
      title={<Trans i18nKey="save" />}
    >
      <NavigationButtons
        onPrevious={onPreviousQuestion}
        onNext={onNextQuestion}
        isPreviousDisabled={index - 1 < 0}
        isNextDisabled={index + 2 > questionsLength}
        direction={theme.direction} 
        previousTextKey="previousQuestion"
        nextTextKey="nextQuestion"
      />{" "}
      <FormProviderWithForm
        formMethods={formMethods}
        style={{
          paddingBlock: 20,
          paddingInline: 40,
          maxHeight: "80vh",
          overflow: "auto",
        }}
      >
        <Box display="flex" flexDirection="column" gap={1}>
          <Typography variant="semiBoldXLarge" gutterBottom>
            <Trans i18nKey="questionAndOptions" />
          </Typography>
          <Typography variant="bodyMedium" color="textSecondary">
            <Trans i18nKey="questionAndOptionsDescription" />
          </Typography>
        </Box>

        <Grid container spacing={2} mt={2}>
          <Grid item xs={12}>
            <MultiLangTextField
              id="question-title"
              label={<Trans i18nKey="question" />}
              name="title"
              value={tempValue.title}
              onChange={handleInputChange}
              translationValue={
                langCode
                  ? (tempValue.translations?.[langCode]?.title ?? "")
                  : ""
              }
              onTranslationChange={updateTranslation("title", setTempValue)}
              placeholder={t("questionPlaceholder")?.toString()}
              multiline
            />
          </Grid>
          <Grid item xs={12}>
            <MultiLangTextField
              id="question-hint"
              label={<Trans i18nKey="hint" />}
              name="hint"
              value={tempValue.hint}
              onChange={handleInputChange}
              translationValue={
                langCode ? (tempValue.translations?.[langCode]?.hint ?? "") : ""
              }
              onTranslationChange={updateTranslation("hint", setTempValue)}
              placeholder={t("hintPlaceholder")?.toString()}
              multiline
            />
          </Grid>

          <Grid item xs={12}>
            <AutocompleteAsyncField
              {...useConnectAutocompleteField({
                service: (args, config) =>
                  service.kitVersions.measures.getAll({ kitVersionId }),
              })}
              name="measure"
              label={<Trans i18nKey="kitDesignerTab.selectMeasure" />}
              getOptionLabel={(option: any) => option?.title ?? ""}
              defaultValue={formMethods.watch("measure")}
              rules={{ required: false }}
              filterFields={["title"]}
            />
          </Grid>

          <Grid item xs={12}>
            <OptionsSection
              question={question}
              kitVersionId={kitVersionId}
              fetchOptions={fetchOptions}
              selectedAnswerRange={selectedAnswerRange}
              setSelectedAnswerRange={setSelectedAnswerRange}
              key={question.id}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 1, mt: 4 }} />
        <ImpactSection question={question} key={question.id} />

        <Divider sx={{ my: 1, mt: 4 }} />

        <Box display="flex" flexDirection="column" gap={1} mt={4}>
          <Typography variant="semiBoldXLarge" gutterBottom>
            <Trans i18nKey="advancedSettings" />
          </Typography>
          <Typography variant="bodyMedium" color="textSecondary">
            <Trans i18nKey="advancedSettingsDescription" />
          </Typography>
        </Box>

        <Grid container spacing={2} alignItems="center" mt={1}>
          <Grid item xs={6}>
            <Box sx={styles.centerVH}>
              <Typography variant="semiBoldMedium">
                <Trans i18nKey="notApplicable" />
              </Typography>
              <Switch
                {...formMethods.register("mayNotBeApplicable")}
                checked={formMethods.watch("mayNotBeApplicable")}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="semiBoldMedium">
              <Trans i18nKey="notAdvisable" />
            </Typography>
            <Switch
              {...formMethods.register("advisable")}
              checked={formMethods.watch("advisable")}
            />
          </Grid>
        </Grid>
        <Divider sx={{ mt: 4 }} />
      </FormProviderWithForm>
      <CEDialogActions
        loading={false}
        onClose={closeDialog}
        onSubmit={formMethods.handleSubmit(handleSubmit)}
        submitButtonLabel="save"
        type="create"
      />
    </CEDialog>
  );
};

export default QuestionDetailsContainer;
