import { useQuery } from "@/hooks/useQuery";
import { useServiceContext } from "@providers/service-provider";
import { useParams } from "react-router-dom";
import { lazy, SyntheticEvent, useEffect, useMemo, useRef, useState } from "react";
import { t } from "i18next";
import showToast from "@utils/toast-error";
import { ICustomError } from "@utils/custom-error";

const EvidenceList = lazy(() => import("../ui/evidences/EvidenceList"));
const AnswerHistory = lazy(() => import("../ui/evidences/AnswerHistory"));

const UseEvidence = (selectedQuestion: any): any => {
  const {id: questionId} = selectedQuestion ?? 0;

  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const saveId = useRef(0)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [cacheData, setCacheData] = useState<Record<string, []>>({});
  const [selectedTab, setSelectedTab] = useState("evidence");

  const data = cacheData[selectedTab] ?? []
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
    setSelectedTab(newValue);
  };

  const ActiveComponent = useMemo(() => {
    const activeTab = tabItems.find((item) => item.value === selectedTab);
    return activeTab ? activeTab.component : null;
  }, [selectedTab, tabItems]);

  const deleteEvidence = useQuery({
    service: (args , config) =>
      service.questions.evidences.remove(args , config),
    runOnMount: false,
  });

  const answerHistoryQueryData = useQuery({
    service: (args, config) =>
      service.assessments.answer.getHistory(
        args ??
          ({
            questionId: questionId,
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
            questionId: questionId,
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
            questionId: questionId,
            assessmentId,
            page: currentPage,
            size: 10,
          } as any),
        config,
      ),
    toastError: true,
    runOnMount: false,
  });


  useEffect(()=>{
    if(questionId !== saveId.current){
      setCacheData({})
      setSelectedTab("evidence")
      saveId.current = questionId
    }
  },[questionId])


  const fetchData = async () => {

    if (cacheData[selectedTab]?.length >= 0 ) return;

    const QueryMap : any = {
      evidence: evidencesQueryData,
      comments: commentesQueryData,
      answerHistory: answerHistoryQueryData,
    };
    const currentQuery = QueryMap[selectedTab];

    if (!currentQuery) return;

    try {
      const { items } = await currentQuery.query();
      setCacheData(prev =>({
        ...prev,
        [selectedTab]: items ?? []
      }))

    } catch (e) {
      const err = e as ICustomError;
      showToast(err);
    }
  };


  useEffect(() => {
    fetchData().then();
  }, [
        questionId,
        selectedTab,
        currentPage,
      ]
  );

  return {
    data,
    selectedTab,
    tabItems,
    ActiveComponent,
    handleChange,
    setCacheData,
    deleteEvidence,
    evidencesQueryData,
    commentesQueryData
  };
};

export default UseEvidence;
