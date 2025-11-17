import { useState, useMemo, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { useServiceContext } from "@/providers/service-provider";
import { useQuery } from "@/hooks/useQuery";
import { useParams } from "react-router-dom";
import {
  addComment,
  addEvidence,
  setEvidences,
  setSelectedQuestion,
  useQuestionContext,
  useQuestionDispatch,
} from "../context";
import { LoadingButton } from "@mui/lab";
import { useAuthContext } from "@/providers/auth-provider";
import { capitalizeFirstChar } from "@/utils/helpers";

enum EVIDENCE_TYPE {
  POSITIVE = "POSITIVE",
  NEGATIVE = "NEGATIVE",
}

type FormValues = {
  description: string;
  type: EVIDENCE_TYPE | null;
  autoOpenAttachment: boolean;
};

const LIMIT = 500;

function stripHtml(input?: string): string {
  if (!input) return "";
  const parser = new DOMParser();
  const doc = parser.parseFromString(input, "text/html");
  return doc.body.textContent?.replaceAll(/\u00A0/g, " ").trim() ?? "";
}

const CreateForm = ({ showTabs }: { showTabs?: boolean }) => {
  const defaultType = showTabs ? EVIDENCE_TYPE.POSITIVE : null;

  const { t } = useTranslation();
  const { service } = useServiceContext();
  const { assessmentId } = useParams();
  const createEvidence = useQuery({
    service: (args, config) => service.evidence.create(args, config),
    runOnMount: false,
  });
  const { selectedQuestion } = useQuestionContext();
  const { userInfo } = useAuthContext();

  const dispatch = useQuestionDispatch();

  const [tab, setTab] = useState<EVIDENCE_TYPE | null>(defaultType);

  const formMethods = useForm<FormValues>({
    shouldUnregister: true,
    defaultValues: {
      description: "",
      type: defaultType,
      autoOpenAttachment: false,
    },
  });

  const { setValue, handleSubmit, watch } = formMethods;

  useEffect(() => {
    setValue("type", tab, { shouldDirty: true });
  }, [tab, setValue]);

  const handleTabChange = (
    _: React.SyntheticEvent,
    newValue: EVIDENCE_TYPE,
  ) => {
    setTab(newValue);
  };

  const descriptionHtml = watch("description");
  const descriptionText = useMemo(
    () => stripHtml(descriptionHtml),
    [descriptionHtml],
  );
  const charCount = descriptionText.length;

  const disabled = charCount === 0 || charCount > LIMIT;

  const onSubmit = (values: FormValues) => {
    const variant = values.type !== null ? "evidences" : "comments";
    createEvidence
      .query({
        questionId: selectedQuestion.id,
        assessmentId,
        ...values,
      })
      .then((res) => {
        const newEvidence = {
          autoOpenAttachment: values.autoOpenAttachment,
          description: values.description,
          type: capitalizeFirstChar(values.type),
          attachmentsCount: 0,
          lastModificationTime: new Date().toISOString(),
          id: res.id,
          createdBy: {
            id: userInfo.id,
            displayName: userInfo.displayName,
            pictureLink: userInfo.pictureLink,
          },
          editable: true,
          deletable: true,
        };
        dispatch(
          values.type ? addEvidence(newEvidence) : addComment(newEvidence),
        );
        formMethods.reset();
        formMethods.setValue("type", defaultType);
        setTab(EVIDENCE_TYPE.POSITIVE);
        dispatch(
          setSelectedQuestion({
            ...selectedQuestion,
            counts: {
              ...selectedQuestion.counts,
              [variant]: selectedQuestion.counts[variant] + 1,
            },
          }),
        );
      });
  };

  return (
    <Box width="100%">
      <FormProviderWithForm formMethods={formMethods}>
        {/* Tabs */}
        {showTabs && (
          <Tabs
            value={tab}
            onChange={handleTabChange}
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
                  {t("questions_temp.positiveEvidence")}
                </Text>
              }
            />
            <Tab
              value={EVIDENCE_TYPE.NEGATIVE}
              label={
                <Text variant="semiBoldSmall">
                  {t("questions_temp.negativeEvidence")}
                </Text>
              }
            />
          </Tabs>
        )}

        {/* Editor */}
        <Box mt={5.5}>
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
              top: "0px",
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
                    {t("questions_temp.addAttachmentAfterCreation")}
                  </Text>
                }
                sx={{ m: 0 }}
              />
            )}
          />

          <Text
            variant="bodySmall"
            color={charCount > LIMIT ? "error.main" : "background.onVariant"}
          >
            {charCount ?? 0} / {LIMIT}
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
            onClick={handleSubmit(onSubmit)}
            loading={createEvidence.loading}
          >
            {showTabs
              ? t("questions_temp.createEvidence")
              : t("questions_temp.createComment")}
          </LoadingButton>
        </Box>
      </FormProviderWithForm>
    </Box>
  );
};

export default CreateForm;
