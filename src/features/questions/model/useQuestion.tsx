import { useServiceContext } from "@/providers/service-provider";
import { useEffect, useState } from "react";
import { questionActions, useQuestionDispatch } from "../context";
import { useParams } from "react-router-dom";
import { IQuestionsModel } from "@/types";
import { useQuery } from "@/hooks/useQuery";
import showToast from "@/utils/toast-error";
import { ICustomError } from "@/utils/custom-error";

export const useQuestions = () => {
  const { service } = useServiceContext();
  const dispatch = useQuestionDispatch();
  const { questionnaireId = "", assessmentId = "" } = useParams();
  const pageSize = 50;

  const questionsResultQueryData = useQuery<IQuestionsModel>({
    service: (args, config) =>
      service.assessments.questionnaire.getQuestionnaireAnswers(
        {
          questionnaireId,
          assessmentId,
          page: args?.page ?? 0,
          size: pageSize,
        },
        config,
      ),
    runOnMount: false,
  });

  const fetchPathInfo = useQuery({
    service: (args, config) =>
      service.common.getPathInfo(
        { questionnaireId, assessmentId, ...(args ?? {}) },
        config,
      ),
    runOnMount: false,
  });

  useEffect(() => {
    questionsResultQueryData
      .query({ page: 0 })
      .then((response) => {
        if (response) {
          const { items = [] } = response;
          dispatch(questionActions.setQuestions(items));
        }
      })
      .catch((e) => {
        showToast(e as ICustomError);
      });
  }, [questionnaireId]);

  return { fetchPathInfo, questionsResultQueryData };
};
