import axios, { AxiosRequestConfig } from "axios";
import { TId } from "@/types";

export const details = {
  getKit(
    { assessmentKitId }: { assessmentKitId: TId },
    config?: AxiosRequestConfig,
  ) {
    return axios.get(`/api/v2/assessment-kits/${assessmentKitId}/details/`, {
      ...(config ?? {}),
    });
  },

  getSubject(
    { assessmentKitId, subjectId }: { assessmentKitId: TId; subjectId: TId },
    config?: AxiosRequestConfig,
  ) {
    return axios.get(
      `/api/v2/assessment-kits/${assessmentKitId}/details/subjects/${subjectId}/`,
      {
        ...(config ?? {}),
      },
    );
  },

  getAttribute(
    {
      assessmentKitId,
      attributeId,
    }: { assessmentKitId: TId; attributeId: TId },
    config?: AxiosRequestConfig,
  ) {
    return axios.get(
      `/api/v2/assessment-kits/${assessmentKitId}/details/attributes/${attributeId}/`,
      {
        ...(config ?? {}),
      },
    );
  },

  getQuestionnaire(
    {
      assessmentKitId,
      questionnaireId,
    }: { assessmentKitId: string | undefined; questionnaireId: TId },
    config?: AxiosRequestConfig,
  ) {
    return axios.get(
      `/api/v2/assessment-kits/${assessmentKitId}/details/questionnaires/${questionnaireId}`,
      {
        ...(config ?? {}),
      },
    );
  },

  getQuestion(
    { assessmentKitId, questionId }: { assessmentKitId: TId; questionId: TId },
    config?: AxiosRequestConfig,
  ) {
    return axios.get(
      `/api/v2/assessment-kits/${assessmentKitId}/details/questions/${questionId}`,
      {
        ...(config ?? {}),
      },
    );
  },

  getMaturityLevelQuestions(
    {
      assessmentKitId,
      attributeId,
      maturityLevelId,
    }: { assessmentKitId: TId; attributeId: TId; maturityLevelId: TId },
    config?: AxiosRequestConfig,
  ) {
    return axios.get(
      `/api/v2/assessment-kits/${assessmentKitId}/details/attributes/${attributeId}/maturity-levels/${maturityLevelId}/`,
      {
        ...(config ?? {}),
      },
    );
  },
};
