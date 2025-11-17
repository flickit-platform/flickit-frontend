import { useState, useMemo, useEffect, SyntheticEvent } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { useServiceContext } from "@/providers/service-provider";
import { useQuery } from "@/hooks/useQuery";
import { useParams } from "react-router-dom";
import {
  addComment,
  addEvidence,
  setSelectedQuestion,
  useQuestionContext,
  useQuestionDispatch,
} from "../context";
import { useAuthContext } from "@/providers/auth-provider";
import { capitalizeFirstChar } from "@/utils/helpers";
import { EVIDENCE_TYPE } from "../ui/CreateForm";
import { useUpdateQuestionIssues } from "./useQuestionIssues";

type FormValues = {
  description: string;
  type: EVIDENCE_TYPE | null;
  autoOpenAttachment: boolean;
};

const LIMIT = 500;

// ===================
// helpers (logic)
// ===================

function stripHtml(input?: string): string {
  if (!input) return "";
  const parser = new DOMParser();
  const doc = parser.parseFromString(input, "text/html");
  return doc.body.textContent?.replaceAll(/\u00A0/g, " ").trim() ?? "";
}

// ===================
// Logic hook
// ===================

type UseCreateEvidenceFormArgs = {
  showTabs?: boolean;
};

type UseCreateEvidenceFormResult = {
  showTabs?: boolean;
  tab: EVIDENCE_TYPE | null;
  onTabChange: (e: SyntheticEvent, value: EVIDENCE_TYPE) => void;
  formMethods: UseFormReturn<FormValues>;
  charCount: number;
  limit: number;
  disabled: boolean;
  loading: boolean;
  onSubmit: () => void;
};

export function useCreateEvidenceForm({
  showTabs,
}: UseCreateEvidenceFormArgs): UseCreateEvidenceFormResult {
  const defaultType = showTabs ? EVIDENCE_TYPE.POSITIVE : null;

  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
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

  const { updateQuestionIssues } = useUpdateQuestionIssues();

  const { setValue, handleSubmit, watch, reset } = formMethods;

  useEffect(() => {
    setValue("type", tab, { shouldDirty: true });
  }, [tab, setValue]);

  const handleTabChange = (_: SyntheticEvent, newValue: EVIDENCE_TYPE) => {
    setTab(newValue);
  };

  const descriptionHtml = watch("description");
  const descriptionText = useMemo(
    () => stripHtml(descriptionHtml),
    [descriptionHtml],
  );
  const charCount = descriptionText.length;
  const disabled = charCount === 0 || charCount > LIMIT;

  const onSubmitInternal = (values: FormValues) => {
    const variant = values.type !== null ? "evidences" : "comments";
    createEvidence
      .query({
        questionId: selectedQuestion.id,
        assessmentId,
        ...values,
      })
      .then(async (res) => {
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
          resolvable: values.type ? false : true,
        };

        dispatch(
          values.type ? addEvidence(newEvidence) : addComment(newEvidence),
        );

        reset();
        setValue("type", defaultType);
        setTab(EVIDENCE_TYPE.POSITIVE);

        const updatedQuestion = {
          ...selectedQuestion,
          counts: {
            ...selectedQuestion.counts,
            [variant]: selectedQuestion.counts[variant] + 1,
          },
        };
        dispatch(setSelectedQuestion(updatedQuestion));

        updateQuestionIssues(updatedQuestion);
      });
  };

  const onSubmit = handleSubmit(onSubmitInternal);

  return {
    showTabs,
    tab,
    onTabChange: handleTabChange,
    formMethods,
    charCount,
    limit: LIMIT,
    disabled,
    loading: createEvidence.loading,
    onSubmit,
  };
}
