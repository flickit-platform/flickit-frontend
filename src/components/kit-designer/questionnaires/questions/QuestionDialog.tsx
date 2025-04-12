// ✅ کامپوننت ریفکتورشده با حفظ کامل منطق‌ها و جدا کردن بخش‌ها به شکل خوانا و استاندارد
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
import { IQuestionInfo } from "@/types";
import { useQuery } from "@/utils/useQuery";
import { styles } from "@styles";
import {
  CEDialog,
  CEDialogActions,
} from "@/components/common/dialogs/CEDialog";
import FormProviderWithForm from "@/components/common/FormProviderWithForm";
import OptionsSection from "./OptionsSection";
import QuestionSubSection from "./QuestionSubSection";
import { t } from "i18next";
import { useParams } from "react-router-dom";

interface Props {
  open: boolean;
  question: IQuestionInfo;
  onClose: () => void;
  fetchQuery: any;
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

  const [selectedAnswerRange, setSelectedAnswerRange] = useState<
    number | undefined
  >(question?.answerRangeId);

  const [impactState, setImpactState] = useState<any>({
    item: {
      questionId: question.id,
      attributeId: undefined,
      maturityLevelId: undefined,
      weight: 1,
    },
    showForm: false,
  });

  const [measureState, setMeasureState] = useState<any>({
    item: { questionId: question.id, measureId: undefined },
    showForm: false,
  });

  const fetchAttributeKit = useQuery({
    service: () => service.kitVersions.attributes.getAll({ kitVersionId }),
  });
  const fetchMaturityLevels = useQuery({
    service: () => service.kitVersions.maturityLevel.getAll({ kitVersionId }),
  });
  const fetchImpacts = useQuery({
    service: () =>
      service.kitVersions.questions.getImpacts({
        kitVersionId,
        questionId: question.id,
      }),
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

  const createImpact = useQuery({
    service: (args, config) =>
      service.kitVersions.questionImpacts.create(args, config),
  });
  const updateImpact = useQuery({
    service: (args, config) =>
      service.kitVersions.questionImpacts.update(args, config),
  });
  const deleteImpact = useQuery({
    service: (args, config) =>
      service.kitVersions.questionImpacts.update(args, config),
  });

  useEffect(() => {
    if (open && question.id) {
      Promise.all([
        fetchImpacts.query(),
        fetchAttributeKit.query(),
        fetchMaturityLevels.query(),
        fetchOptions.query(),
        fetchMeasures.query(),
      ]);
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
        },
      });
      fetchQuery.query();
      onClose();
    } catch (err) {
      toastError(err as ICustomError);
    }
  };

  const sharedProps = (type: "impact" | "measure") => {
    const isImpact = type === "impact";
    const state = isImpact ? impactState : measureState;
    const setState = isImpact ? setImpactState : setMeasureState;
    const fetchList = isImpact ? fetchImpacts : fetchMeasures;

    return {
      title: isImpact ? "questionImpacts" : "questionMeasures",
      description: isImpact
        ? "optionsImpactsDescription"
        : "questionMeasuresDescription",
      emptyBtnTitle: "newOptionImpact",
      emptyTitle: "optionsImpactsEmptyState",
      emptySubtitle: "optionsImpactsEmptyStateDetailed",
      disabledCondition:
        fetchAttributeKit?.data?.items?.length === 0 ||
        fetchOptions.data?.answerOptions?.length === 0,
      impacts: fetchList?.data?.attributeImpacts ?? [],
      fields: isImpact
        ? [
            {
              name: "attributeId",
              label: t("attribute"),
              options: fetchAttributeKit?.data?.items,
            },
            {
              name: "maturityLevelId",
              label: t("maturityLevel"),
              options: fetchMaturityLevels?.data?.items,
            },
          ]
        : [
            {
              name: "measureId",
              label: t("selectMeasure"),
              options: fetchMeasures?.data?.items,
            },
          ],
      hasWeight: isImpact,
      isAddingNew: state.showForm,
      setIsAddingNew: (val: boolean) =>
        setState((prev: any) => ({ ...prev, showForm: val })),
      newImpact: state.item,
      handlers: {
        onSave: async () => {
          try {
            await createImpact.query({ kitVersionId, data: state.item });
            fetchList.query();
            setState({
              item: isImpact
                ? {
                    questionId: question.id,
                    attributeId: undefined,
                    maturityLevelId: undefined,
                    weight: 1,
                  }
                : { questionId: question.id, measureId: undefined },
              showForm: false,
            });
          } catch (err) {
            toastError(err as ICustomError);
          }
        },
        onCancel: () =>
          setState({
            item: isImpact
              ? {
                  questionId: question.id,
                  attributeId: undefined,
                  maturityLevelId: undefined,
                  weight: 1,
                }
              : { questionId: question.id, measureId: undefined },
            showForm: false,
          }),
        onInputChange: (field: string, value: any) =>
          setState((prev: any) => ({
            ...prev,
            item: { ...prev.item, [field]: value },
          })),
        onDelete: async (item: any) => {
          try {
            await deleteImpact.query({
              kitVersionId,
              questionImpactId: item.questionImpactId,
            });
            fetchList.query();
          } catch (err) {
            toastError(err as ICustomError);
          }
        },
        onEdit: async (values: any, item: any) => {
          try {
            await updateImpact.query({
              kitVersionId,
              questionImpactId: item.questionImpactId,
              data: values,
            });
            fetchList.query();
          } catch (err) {
            toastError(err as ICustomError);
          }
        },
        onAdd: () => setState((prev: any) => ({ ...prev, showForm: true })),
      },
    };
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
            <TextField
              {...formMethods.register("title", { required: true })}
              fullWidth
              label="Question"
              placeholder={t("questionPlaceholder")?.toString()}
              required
              multiline
              inputProps={{
                style: {
                  fontFamily: languageDetector(question.title)
                    ? farsiFontFamily
                    : primaryFontFamily,
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...formMethods.register("hint")}
              fullWidth
              label="Hint"
              placeholder={t("hintPlaceholder")?.toString()}
              multiline
              inputProps={{
                style: {
                  fontFamily: languageDetector(question.hint)
                    ? farsiFontFamily
                    : primaryFontFamily,
                },
              }}
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
        <QuestionSubSection {...sharedProps("impact")} />
        <Divider sx={{ my: 1, mt: 4 }} />
        <QuestionSubSection {...sharedProps("measure")} />

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
