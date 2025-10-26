import { useCallback, useEffect, useState } from "react";
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
import i18next, { t } from "i18next";
import { useParams } from "react-router-dom";
import ImpactSection from "./ImpactSection";
import AutocompleteAsyncField, {
} from "@/components/common/fields/AutocompleteAsyncField";
import { kitActions, useKitDesignerContext } from "@/providers/kit-provider";
import { useTranslationUpdater } from "@/hooks/useTranslationUpdater";
import NavigationButtons from "@/components/common/buttons/NavigationButtons";
import showToast from "@/utils/toast-error";
import { Text } from "@/components/common/Text";
import { RenderGeneralField } from "@common/RenderGeneralField";
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import Tooltip from "@mui/material/Tooltip";

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

  const {handleFieldEdit, editableFields, toggleTranslation, showTranslations, fieldsName, handleCancelTextBox} = useQuestionInfo(langCode, question, setTempValue)

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
          advisable: !question.advisable ?? false,
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
    const updateData = {...data}
    updateData.advisable = !updateData.advisable

    try {
      setIsSaving(true);
      const updatedFields = {
        ...updateData,
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
     (!!currentValues.advisable && currentValues.advisable) === (question.advisable ?? false)
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


          {fieldsName.map((field: any)=>{

            const {
              name,
              label,
              multiline,
              useRichEditor,
              type,
              options,
              disabled,
              width,
            } = field;

            return (
              <Grid size={{ xs: 12 }} display={"flex"}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  sx={{
                    gap: { xs: 0, md: useRichEditor ? 0 : 5 },
                    flexDirection: {
                      xs: "column",
                      md: useRichEditor ? "column" : "row",
                    },
                    alignItems: {
                      xs: "flex-start",
                      md: useRichEditor ? "flex-start" : "center",
                    },
                    flex: 1
                  }}
                >
                  <Text
                    variant="titleSmall"
                    mt="2px"
                    height="100%"
                    minWidth={width}
                    whiteSpace="nowrap"
                  >
                    <Trans i18nKey={label} />
                  </Text>
                  <Box sx={{ display: "flex", width: "100%" }}>
                    <RenderGeneralField
                      field={name}
                      fieldType={type}
                      data={question}
                      editableFields={editableFields}
                      langCode={langCode}
                      updatedValues={tempValue}
                      setUpdatedValues={setTempValue}
                      showTranslations={showTranslations}
                      handleCancelTextBox={handleCancelTextBox}
                      toggleTranslation={toggleTranslation}
                      handleFieldEdit={handleFieldEdit}
                      multiline={multiline}
                      useRichEditor={useRichEditor}
                      updateTranslation={updateTranslation}
                      options={options}
                      label={<Trans i18nKey={label} />}
                      disabled={disabled}
                      editable={true}
                    />
                  </Box>
                </Box>
              </Grid>
            )
          })}

          <Grid size={{xs: 12}}>
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

          <Grid size={{xs: 12}}>
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
          <Text variant="titleSmall" gutterBottom>
            <Trans i18nKey="common.settings" />
          </Text>
        </Box>

        <Grid container spacing={2} alignItems="center" mt={1}>
          <Grid size={{xs: 6}}>
            <Box sx={styles.centerVH}>
              <Text variant="semiBoldMedium" sx={{display: "flex", alignItems: "center", width: "fit-content"}}>
                <Trans i18nKey="questions.notApplicable" />
                <Tooltip title={t("kitDesigner.notApplicableDesc")} sx={{...theme.typography.bodySmall}}  >
                  <InfoOutlineIcon fontSize={"small"} sx={{mx: .4}}  />
                </Tooltip>
              </Text>
              <Switch
                {...formMethods.register("mayNotBeApplicable")}
                checked={formMethods.watch("mayNotBeApplicable")}
              />
            </Box>
          </Grid>
          <Grid sx={{display: "flex"}} size={{xs: 6}}>
            <Text variant="semiBoldMedium" sx={{display: "flex", alignItems: "center", width: "fit-content"}}>
              <Trans i18nKey="questions.notAdvisable" />
              <Tooltip title={t("kitDesigner.notAdvisableDesc")} sx={{...theme.typography.bodySmall}} >
                 <InfoOutlineIcon fontSize={"small"} sx={{mx: .4}} />
              </Tooltip>
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

const useQuestionInfo = (langCode: string, question: any, setTempValue: any) =>{
  const [editableFields, setEditableFields] = useState<Set<string>>(new Set());
  const [showTranslations, setShowTranslations] = useState({
    title: false,
    hint: false
  });
  const { translations } = question
  useEffect(() => {
    setShowTranslations({
      title: !!translations[langCode]?.title,
      hint:  !!translations[langCode]?.hint,
    })
  }, []);

  const handleFieldEdit = useCallback((field: string)=>{
    setEditableFields((prev)=>{
      const next = new Set(prev)
      next.add(field)
      return next;
    })
  },[setEditableFields])

  const handleCancelTextBox = useCallback((field: string)=>{
    setEditableFields((prev)=>{
      const next = new Set(prev);
      next.delete(field);
      return next;
    })

    setTempValue((prev: any)=>{
      return {
        ...prev,
        translations: {
          [langCode] : { ...prev.translations[langCode] ?? "",[field]: question.translations[langCode]?.[field]  ?? "" }
        }
      }
    })

  },[setEditableFields])

  const toggleTranslation = useCallback(
    (field: "title" | "hint" ) => {
      setShowTranslations((prev: any) => ({
        ...prev,
        [field]: !prev[field],
      }));
    },
    [],
  );

  const fieldsName =[
    {
      name: "title",
      label: "common.question",
      multiline: true,
      useRichEditor: false,
      type: "text" as const,
      options: [],
      disabled: false,
      width: i18next.language === "fa" ? "35px" : "60px",
    },
    {
      name: "hint",
      label: "common.hint",
      multiline: true,
      useRichEditor: false,
      type: "text" as const,
      options: [],
      disabled: false,
      width: i18next.language === "fa" ? "35px" : "60px",
    },
  ]

  return {
    editableFields,
    handleFieldEdit,
    handleCancelTextBox,
    toggleTranslation,
    showTranslations,
    fieldsName
  }
}

export default QuestionDetailsContainer;
