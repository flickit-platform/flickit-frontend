import React, { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Typography,
  Divider,
  Switch,
  DialogProps,
} from "@mui/material";
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
import { kitActions, useKitDesignerContext } from "@providers/KitProvider";
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
}

const QuestionDetailsContainer = (props: IQuestionDetailsDialogDialogProps) => {
  const {
    onClose: closeDialog,
    onPreviousQuestion,
    onNextQuestion,
    context = {},
    ...rest
  } = props;
  const { index } = context;

  const { kitVersionId = "" } = useParams();
  const { service } = useServiceContext();
  const formMethods = useForm({ shouldUnregister: true });

  const { kitState, dispatch } = useKitDesignerContext();
  const langCode = kitState.translatedLanguage?.code ?? "";
  const question = kitState.questions[index];

  const { updateTranslation } = useTranslationUpdater(langCode);

  const [selectedAnswerRange, setSelectedAnswerRange] = useState<
    number | undefined
  >(question?.answerRangeId);
  const [tempValue, setTempValue] = useState<ITempValue>({
    title: question.title,
    hint: question.hint,
    translations: question.translations,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);

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
      const initial = {
        options: question.options ?? [{ text: "" }],
        mayNotBeApplicable: question.mayNotBeApplicable ?? false,
        advisable: question.advisable ?? false,
        measure:
          fetchMeasures.data?.items?.find(
            (m: any) => m.id === question.measureId,
          ) ?? null,
      };
      setInitialData(initial);
      formMethods.reset(initial);
      setTempValue({
        title: question.title ?? "",
        hint: question.hint ?? "",
        translations: question.translations ?? "",
      });
      setSelectedAnswerRange(question.answerRangeId);
    }
  }, [rest.open, question.id]);

  const handleSubmit = async (data: any) => {
    try {
      setIsSaving(true);
      const updatedFields = {
        ...data,
        ...tempValue,
        index: question.index,
        answerRangeId: selectedAnswerRange,
        measureId: data.measure?.id ?? null,
      };

      await service.kitVersions.questions.update({
        kitVersionId,
        questionId: question.id,
        data: updatedFields,
      });

      const updatedQuestions = kitState.questions.map((q) =>
        q.id === question.id ? { ...q, ...updatedFields } : q,
      );

      dispatch(kitActions.setQuestions(updatedQuestions));
      setIsSaving(false);
    } catch (err) {
      setIsSaving(false);
      toastError(err as ICustomError);
    }
  };

  const handleNext = () => {
    formMethods.handleSubmit(async (data) => {
      if (isDirty()) {
        await handleSubmit(data);
      }
      onNextQuestion();
    })();
  };

  const handlePrevious = () => {
    formMethods.handleSubmit(async (data) => {
      if (isDirty()) {
        await handleSubmit(data);
      }
      onPreviousQuestion();
    })();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempValue((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isDirty = () => {
    const currentValues = formMethods.getValues();
    const measureId = currentValues.measure?.id ?? null;
    const initialMeasureId = initialData?.measure?.id ?? null;
    return (
      tempValue.title !== (question.title ?? "") ||
      tempValue.hint !== (question.hint ?? "") ||
      JSON.stringify(tempValue.translations) !==
        JSON.stringify(question.translations ?? {}) ||
      selectedAnswerRange !== question.answerRangeId ||
      measureId !== initialMeasureId ||
      currentValues.mayNotBeApplicable !==
        (question.mayNotBeApplicable ?? false) ||
      currentValues.advisable !== (question.advisable ?? false)
    );
  };

  return (
    <CEDialog
      {...rest}
      closeDialog={closeDialog}
      sx={{ width: "100%", paddingInline: 4 }}
      title={<Trans i18nKey="common.save" />}
    >
      <NavigationButtons
        onPrevious={handlePrevious}
        onNext={handleNext}
        isPreviousDisabled={index - 1 < 0}
        isNextDisabled={index + 2 > kitState.questions.length}
        direction={theme.direction}
        previousTextKey="questions.previousQuestion"
        nextTextKey="questions.nextQuestion"
      />
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
            <Trans i18nKey="questions.questionAndOptions" />
          </Typography>
          <Typography variant="bodyMedium" color="textSecondary">
            <Trans i18nKey="questions.questionAndOptionsDescription" />
          </Typography>
        </Box>

        <Grid container spacing={2} mt={2}>
          <Grid item xs={12}>
            <MultiLangTextField
              id="question-title"
              label={<Trans i18nKey="common.question" />}
              name="title"
              value={tempValue.title}
              onChange={handleInputChange}
              translationValue={
                langCode
                  ? (tempValue.translations?.[langCode]?.title ?? "")
                  : ""
              }
              onTranslationChange={updateTranslation("title", setTempValue)}
              placeholder={t("kitDesigner.questionPlaceholder")?.toString()}
              multiline
            />
          </Grid>
          <Grid item xs={12}>
            <MultiLangTextField
              id="question-hint"
              label={<Trans i18nKey="common.hint"/>}
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
              label={<Trans i18nKey="kitDesigner.selectMeasure" />}
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
            <Trans i18nKey="questions.advancedSettings" />
          </Typography>
          <Typography variant="bodyMedium" color="textSecondary">
            <Trans i18nKey="questions.advancedSettingsDescription" />
          </Typography>
        </Box>

        <Grid container spacing={2} alignItems="center" mt={1}>
          <Grid item xs={6}>
            <Box sx={styles.centerVH}>
              <Typography variant="semiBoldMedium">
                <Trans i18nKey="questions.notApplicable" />
              </Typography>
              <Switch
                {...formMethods.register("mayNotBeApplicable")}
                checked={formMethods.watch("mayNotBeApplicable")}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="semiBoldMedium">
              <Trans i18nKey="questions.notAdvisable" />
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
        loading={isSaving}
        onClose={closeDialog}
        onSubmit={formMethods.handleSubmit(handleSubmit)}
        submitButtonLabel="common.save"
        type="create"
        disablePrimaryButton={!isDirty()}
      />
    </CEDialog>
  );
};

export default QuestionDetailsContainer;
