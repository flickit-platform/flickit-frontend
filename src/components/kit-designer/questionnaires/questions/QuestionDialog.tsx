import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Box,
  Typography,
  Divider,
  Switch,
} from "@mui/material";
import { Trans } from "react-i18next";
import { useForm } from "react-hook-form";
import { useServiceContext } from "@/providers/ServiceProvider";
import { ICustomError } from "@/utils/CustomError";
import toastError from "@/utils/toastError";
import languageDetector from "@/utils/languageDetector";
import { farsiFontFamily, primaryFontFamily } from "@config/theme";
import { IQuestionInfo, MultiLangs } from "@/types";
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

interface Props {
  open: boolean;
  question: IQuestionInfo;
  onClose: () => void;
  fetchQuery: any;
}


interface ITempValue {
  question: string;
  hint: string;
  translations: {[key: string] : { question: string, hint: string }} | null;
}

const QuestionDialog: React.FC<Props> = ({
  open,
  question,
  onClose,
  fetchQuery,
}) => {
  const { kitVersionId = "" } = useParams();

  const { service } = useServiceContext();
  const formMethods = useForm({ shouldUnregister: true });

  const { kitState } = useKitLanguageContext();
  const langCode = kitState.translatedLanguage?.code ?? "";

  const { updateTranslation } = useTranslationUpdater(langCode);

  const [selectedAnswerRange, setSelectedAnswerRange] = useState<
    number | undefined
  >(question?.answerRangeId);

  const [selectedMeasure, setSelectedMeasure] = useState<any>(null);


  const [tempValue, setTempValue] = useState<ITempValue>({
    question: "",
    hint: "",
    translations: null
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
    setSelectedMeasure(measureObject);
    formMethods.setValue("measure", measureObject);
  }, [fetchMeasures?.data?.items]);

  useEffect(() => {
    if (open && question.id) {
      Promise.all([fetchOptions.query(), fetchMeasures.query()]);

      formMethods.reset({
        title: question.title ?? "",
        hint: question.hint ?? "",
        options: question.options ?? [{ text: "" }],
        mayNotBeApplicable: question.mayNotBeApplicable ?? false,
        advisable: question.advisable ?? false,
      });
      setSelectedAnswerRange(question.answerRangeId);
    }
  }, [open]);

  const handleSubmit = async (data: any) => {
    try {
      await service.kitVersions.questions.update({
        kitVersionId,
        questionId: question.id,
        data: {
          ...data,
          index: question.index,
          answerRangeId: selectedAnswerRange,
          measureId: data.measure?.id ?? null,
        },
      });
      fetchQuery.query();
      onClose();
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
      open={open}
      onClose={onClose}
      title={<Trans i18nKey="editQuestion" />}
    >
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
              name="question"
              value={tempValue.question}
              onChange={handleInputChange}
              translationValue={
                langCode ? (tempValue.translations?.[langCode]?.question ?? "") : ""
              }
              onTranslationChange={updateTranslation("question", setTempValue)}
              placeholder={t("questionPlaceholder")?.toString()}
              multiline
            />
            {/*<TextField*/}
            {/*  {...formMethods.register("title", { required: true })}*/}
            {/*  fullWidth*/}
            {/*  label="Question"*/}
            {/*  placeholder={t("questionPlaceholder")?.toString()}*/}
            {/*  required*/}
            {/*  multiline*/}
            {/*  inputProps={{*/}
            {/*    style: {*/}
            {/*      fontFamily: languageDetector(question.title)*/}
            {/*        ? farsiFontFamily*/}
            {/*        : primaryFontFamily,*/}
            {/*    },*/}
            {/*  }}*/}
            {/*/>*/}
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
            {/*<TextField*/}
            {/*  {...formMethods.register("hint")}*/}
            {/*  fullWidth*/}
            {/*  label="Hint"*/}
            {/*  placeholder={t("hintPlaceholder")?.toString()}*/}
            {/*  multiline*/}
            {/*  inputProps={{*/}
            {/*    style: {*/}
            {/*      fontFamily: languageDetector(question.hint)*/}
            {/*        ? farsiFontFamily*/}
            {/*        : primaryFontFamily,*/}
            {/*    },*/}
            {/*  }}*/}
            {/*/>*/}
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
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 1, mt: 4 }} />
        <ImpactSection question={question} />

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
        onClose={onClose}
        onSubmit={formMethods.handleSubmit(handleSubmit)}
        submitButtonLabel="editQuestion"
        type="create"
      />
    </CEDialog>
  );
};

export default QuestionDialog;
