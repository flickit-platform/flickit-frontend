import { lazy, SyntheticEvent, useEffect, useMemo, useState } from "react";
import showToast from "@utils/toast-error";
import { ICustomError } from "@utils/custom-error";
import useFetchData from "@/features/questions/model/evidenceTabs/useFetchData";
import {
  setTab,
  useQuestionContext,
  useQuestionDispatch,
} from "@/features/questions/context";
import { useTranslation } from "react-i18next";
const EvidenceContainer = lazy(
  () => import("@/features/questions/ui/footer/EvidenceContainer"),
);
const AnswerHistoryContainer = lazy(
  () => import("@/features/questions/ui/footer/AnswerHistoryContainer"),
);

type TabValue = "evidence" | "comment" | "answerHistory";

interface TabItem {
  index: number;
  label: string;
  value: TabValue;
  component: React.LazyExoticComponent<any>;
  counts: number;
}

interface EvidenceData {
  items?: any[];
}

const TAB_ITEMS: TabItem[] = [
  {
    index: 0,
    label: "questions_temp.evidences",
    value: "evidence",
    component: EvidenceContainer,
    counts: 0,
  },
  {
    index: 1,
    label: "questions_temp.comments",
    value: "comment",
    component: EvidenceContainer,
    counts: 0,
  },
  {
    index: 2,
    label: "questions_temp.answerHistories",
    value: "answerHistory",
    component: AnswerHistoryContainer,
    counts: 0,
  },
];

const useTabs = () => {
  const { selectedQuestion } = useQuestionContext();
  const { answerHistories, comments, evidences } =
    selectedQuestion?.counts ?? {};
  const questionId = selectedQuestion?.id;
  const [selectedTab, setSelectedTab] = useState<TabValue>("evidence");
  const dispatch = useQuestionDispatch();

  const tabCounts = {
    evidence: evidences,
    comment: comments,
    answerHistory: answerHistories,
  };

  const { t } = useTranslation();
  const tabItems = useMemo(
    () =>
      TAB_ITEMS.map((item) => ({
        ...item,
        label: t(item.label),
        counts: tabCounts[item.value],
      })),
    [],
  );

  const handleTabChange = (_event: SyntheticEvent, newValue: TabValue) => {
    setSelectedTab(newValue);
  };

  const ActiveComponent = useMemo<any>(() => {
    const activeTab = tabItems.find((item) => item.value === selectedTab);
    return activeTab?.component ?? null;
  }, [selectedTab, tabItems]);

  const { evidencesQueryData, commentesQueryData, answerHistoryQueryData } =
    useFetchData();

  const queryMap = useMemo(
    () => ({
      evidence: evidencesQueryData,
      comment: commentesQueryData,
      answerHistory: answerHistoryQueryData,
    }),
    [evidencesQueryData, commentesQueryData, answerHistoryQueryData],
  );

  const fetchData = async () => {
    const currentQuery = queryMap[selectedTab];
    if (!currentQuery) {
      return;
    }

    try {
      const response: EvidenceData = await currentQuery.query();
      const items = response.items ?? [];
      dispatch(setTab({ activeTab: selectedTab, data: items }));
    } catch (error) {
      const customError = error as ICustomError;
      showToast(customError);
    }
  };

  useEffect(() => {
    if (questionId) {
      dispatch(setTab({ activeTab: "evidence", data: [] }));
      fetchData();
      setSelectedTab("evidence");
    }
  }, [questionId]);

  useEffect(() => {
    if (questionId) fetchData();
  }, [selectedTab]);

  return {
    selectedTab,
    tabItems,
    ActiveComponent,
    handleChange: handleTabChange,
  };
};

export default useTabs;
