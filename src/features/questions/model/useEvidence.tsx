import { useQuery } from "@/hooks/useQuery";
import { useServiceContext } from "@providers/service-provider";
import { useParams } from "react-router-dom";
import { lazy, SyntheticEvent, useEffect, useMemo, useState } from "react";
import { t } from "i18next";
import showToast from "@utils/toast-error";

const EvidenceList = lazy(() => import("../ui/evidences/evidenceList"));
const AnswerHistory = lazy(() => import("../ui/evidences/answerHistory"));

const UseEvidence = (idx: number): any => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [cacheData, setCacheData] = useState<Record<string, []>>({});
  const [selectedId, setSelectedId] = useState("evidence");

  let data = cacheData[selectedId] ?? []
  const tabItems = useMemo(() => [
    {
      index: 0,
      label: t("common.evidence"),
      value: "evidence",
      component: EvidenceList,
    },
    {
      index: 1,
      label: t("questions.comments"),
      value: "comments",
      component: EvidenceList,
    },
    {
      index: 2,
      label: t("questions.answerHistory"),
      value: "answerHistory",
      component: AnswerHistory,
    },
  ], [t]);

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setSelectedId(newValue);
  };

  const ActiveComponent = useMemo(() => {
    const activeTab = tabItems.find((item) => item.value === selectedId);
    return activeTab ? activeTab.component : null;
  }, [selectedId, tabItems]);

  const answerHistoryQueryData = useQuery({
    service: (args, config) =>
      service.assessments.answer.getHistory(
        args ??
          ({
            questionId: idx,
            assessmentId,
            page: currentPage,
            size: 10,
          } as any),
        config,
      ),
    toastError: true,
    runOnMount: false,
    // runOnMount: Boolean(questionsInfo?.permissions?.viewAnswerHistory),
  });

  const evidencesQueryData = useQuery({
    service: (args, config) =>
      service.questions.evidences.getAll(
        args ??
          ({
            questionId: idx,
            assessmentId,
            page: currentPage,
            size: 10,
          } as any),
        config,
      ),
    toastError: true,
    runOnMount: false,
  });

  const commentesQueryData = useQuery({
    service: (args, config) =>
      service.questions.comments.getAll(
        args ??
          ({
            questionId: idx,
            assessmentId,
            page: currentPage,
            size: 10,
          } as any),
        config,
      ),
    toastError: true,
    runOnMount: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (cacheData[selectedId]?.length >= 0 ) return;

      const QueryMap = {
        evidence: evidencesQueryData,
        comments: commentesQueryData,
        answerHistory: answerHistoryQueryData,
      };
      const currentQuery = QueryMap[selectedId];

      if (!currentQuery) return;

      try {
        const { items } = await currentQuery.query();
            setCacheData(prev =>({
                ...prev,
                [selectedId]: items ?? []
            }))

      } catch (err) {
        showToast(err);
      }
    };
    fetchData().then();
  }, [
        idx,
        selectedId,
        currentPage,
      ]
  );

  return {
    data,
    selectedId,
    tabItems,
    ActiveComponent,
    handleChange,
  };
};

export default UseEvidence;
