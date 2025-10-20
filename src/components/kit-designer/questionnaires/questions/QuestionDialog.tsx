import { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Divider,
  Switch,
  DialogProps,
  useTheme,
} from "@mui/material";
import { Trans } from "react-i18next";
import { useForm } from "react-hook-form";
import { useServiceContext } from "@/providers/service-provider";
import { ICustomError } from "@/utils/custom-error";
import { useQuery } from "@/hooks/useQuery";
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
import { kitActions, useKitDesignerContext } from "@/providers/kit-provider";
import { useTranslationUpdater } from "@/hooks/useTranslationUpdater";
import MultiLangTextField from "@common/fields/MultiLangTextField";
import NavigationButtons from "@/components/common/buttons/NavigationButtons";
import showToast from "@/utils/toast-error";
import { Text } from "@/components/common/Text";

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
    runOnMount: false
  });
  const fetchOptions = useQuery({
    service: () =>
      service.kitVersions.questions.getOptions({
        kitVersionId,
        questionId: question.id,
      }),
  });

  useEffect(() => {
    if (fetchMeasures?.data?.items){
      const measureObject = fetchMeasures.data?.items?.find(
        (m: any) => m.id === question.measureId,
      );
      formMethods.setValue("measure", measureObject);
    }
  }, [fetchMeasures?.data?.items]);

  useEffect(() => {
    if (rest.open && question.id) {
      const resultFunc = async () => {
        const fetchMeasure = await fetchMeasures.query()
        const initial = {
          options: question.options ?? [{ text: "" }],
          mayNotBeApplicable: question.mayNotBeApplicable ?? false,
          advisable: question.advisable ?? false,
          measure:
            fetchMeasure?.items?.find(
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
      resultFunc()
    }
  }, [rest.open, question.id, isSaving]);

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
      showToast(err as ICustomError);
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
     (!!currentValues.mayNotBeApplicable && currentValues.mayNotBeApplicable )!==
        (question.mayNotBeApplicable ?? false) ||
     (!!currentValues.advisable && currentValues.advisable) !== (question.advisable ?? false)
    );
  };
  const theme = useTheme();

  return (
    <CEDialog
      {...rest}
      closeDialog={closeDialog}
      sx={{ width: "100%", paddingInline: 4 }}
      title={<Trans i18nKey="common.editQuestion" />}
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
        <Grid container spacing={2} mt={2}>
          <Grid item display={"flex"} xs={12}>
            <Box
              sx={{
                ...styles.centerVH,
                width: { xs: "45px" },
                justifyContent: "space-around",
              }}
              borderRadius="0.5rem"
              mx={1.3}
             >
              <Text
                data-testid="question-index"
                variant="semiBoldLarge"
              >{`Q. ${question?.index}`}</Text>
            </Box>
            <MultiLangTextField
              id="question-title"
              label={
              <Text variant={"bodyMedium"} color={"background.secondaryDark"} >
                <Trans i18nKey="common.question" />
              </Text>
            }
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
              bgcolor="inherit"
            />
          </Grid>
          <Grid item xs={12}>
            <MultiLangTextField
              id="question-hint"
              label={
              <Text variant={"bodyMedium"} color={"background.secondaryDark"} >
                <Trans i18nKey="common.hint"/>
              </Text>
            }
              name="hint"
              value={tempValue.hint}
              onChange={handleInputChange}
              translationValue={
                langCode ? (tempValue.translations?.[langCode]?.hint ?? "") : ""
              }
              onTranslationChange={updateTranslation("hint", setTempValue)}
              placeholder={t("hintPlaceholder")?.toString()}
              multiline
              bgcolor="inherit"
            />
          </Grid>

          <Grid item xs={12}>
            <AutocompleteAsyncField
              options={fetchMeasures?.data?.items.map((measure: any) => measure)}
              name="measure"
              label={
                <Text variant={"bodyMedium"} color={"background.secondaryDark"} >
                  <Trans i18nKey="common.measure" />
                </Text>
              }
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

        <ImpactSection question={question} key={question.id} />

        <Box display="flex" flexDirection="column" gap={1} mt={4}>
          <Text variant="semiBoldXLarge" gutterBottom>
            <Trans i18nKey="questions.advancedSettings" />
          </Text>
          <Text variant="bodyMedium" color="textSecondary">
            <Trans i18nKey="questions.advancedSettingsDescription" />
          </Text>
        </Box>

        <Grid container spacing={2} alignItems="center" mt={1}>
          <Grid item xs={6}>
            <Box sx={styles.centerVH}>
              <Text variant="semiBoldMedium">
                <Trans i18nKey="questions.notApplicable" />
              </Text>
              <Switch
                {...formMethods.register("mayNotBeApplicable")}
                checked={formMethods.watch("mayNotBeApplicable")}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Text variant="semiBoldMedium">
              <Trans i18nKey="questions.notAdvisable" />
            </Text>
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
        hasContinueBtn={true}
        submitButtonLabel={t("common.save")}
        type="create"
        disablePrimaryButton={!isDirty()}
      />
    </CEDialog>
  );
};

export default QuestionDetailsContainer;
