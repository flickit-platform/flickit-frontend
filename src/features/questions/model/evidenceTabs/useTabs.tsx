import { lazy, SyntheticEvent, useEffect, useMemo, useRef, useState } from "react";
import showToast from "@utils/toast-error";
import { ICustomError } from "@utils/custom-error";
import useFetchData from "@/features/questions/model/evidenceTabs/useFetchData";
import {useQuestionContext} from "@/features/questions/context";
import { useTranslation } from "react-i18next";
const EvidenceList = lazy(() => import("@/features/questions/ui/footer/EvidenceList"));
const AnswerHistory = lazy(() => import("@/features/questions/ui/footer/AnswerHistory"));

type TabValue = "evidence" | "comment" | "answerHistory";

interface TabItem {
  index: number;
  label: string;
  value: TabValue;
  component: React.LazyExoticComponent<any>;
}

interface FetchOptions {
  force?: boolean;
}

interface EvidenceData {
  items?: any[];
}

const TAB_ITEMS: TabItem[] = [
  { index: 0, label: "questions_temp.evidences", value: "evidence", component: EvidenceList },
  { index: 1, label: "questions_temp.comments", value: "comment", component: EvidenceList },
  { index: 2, label: "questions_temp.answerHistories", value: "answerHistory", component: AnswerHistory },
];

const useTabs = () => {
  const {selectedQuestion} = useQuestionContext()
  const questionId = selectedQuestion?.id

  const [data, setData] = useState<Record<string, any[]>>({});
  const [selectedTab, setSelectedTab] = useState<TabValue>("evidence");

  const { t } = useTranslation()
  const tabItems = useMemo(
      () =>
          TAB_ITEMS.map((item) => ({
            ...item,
            label: t(item.label),
          })),
      []
  );

  const handleTabChange = (_event: SyntheticEvent, newValue: TabValue) => {
    setSelectedTab(newValue);
  };

  const ActiveComponent = useMemo(() => {
    const activeTab = tabItems.find((item) => item.value === selectedTab);
    return activeTab?.component ?? null;
  }, [selectedTab, tabItems]);

  const {
    evidencesQueryData,
    commentesQueryData,
    answerHistoryQueryData,
    deleteEvidence,
    fetchEvidenceAttachments,
    RemoveEvidenceAttachments
  } = useFetchData(questionId);

  const queryMap = useMemo(
      () => ({
        evidence: evidencesQueryData,
        comment: commentesQueryData,
        answerHistory: answerHistoryQueryData,
      }),
      [evidencesQueryData, commentesQueryData, answerHistoryQueryData]
  );



  const transformCommentData = (items: any[]) => {
    return items.map((item) => ({ ...item, type: "Comment" }));
  };

  const fetchData = async (tab: TabValue = selectedTab, options: FetchOptions = {}) => {
    const { force = false } = options;

    if (!force && Array.isArray(data[tab])) {
      return;
    }

    const currentQuery = queryMap[tab];
    if (!currentQuery) {
      return;
    }

    try {
      const response: EvidenceData = await currentQuery.query();
      const items = response.items ?? [];

      setData((prev) => ({
        ...prev,
        [tab]: tab === "comment" ? transformCommentData(items) : items,
      }));
    } catch (error) {
      const customError = error as ICustomError;
      showToast(customError);
    }
  };

  useEffect(() => {
    if (questionId) fetchData(selectedTab);
  }, [selectedTab, questionId]);

  useEffect(() => {
    if (!questionId) return;
    setData({});
    setSelectedTab("evidence");
    fetchData("evidence", { force: true });
  }, [questionId]);

  const invalidateTab = (tab: string) => {
    setData((prev) => {
      const { [tab]: _, ...rest } = prev;
      return rest;
    });
  };

  const deleteItemAndRefresh = async (evidenceId: number, tabToRefresh: TabValue = "evidence") => {
    try {
      await deleteEvidence.query({ id: evidenceId });
      invalidateTab(tabToRefresh);
      await fetchData(tabToRefresh, { force: true });
    } catch (error) {
      const customError = error as ICustomError;
      showToast(customError);
    }
    return true
  };

  const fetchAttachment = async (evidenceId: number, tabToRefresh: TabValue = "evidence") => {
    try {
      const result = await fetchEvidenceAttachments.query({ evidence_id: evidenceId });
      return result;
    } catch (error) {
      const customError = error as ICustomError;
      showToast(customError);
    }
  };
  const removeAttachment = async (evidenceId: number,attachmentId: number, tabToRefresh: TabValue = "evidence") => {
    try {
      const result = await RemoveEvidenceAttachments.query({ evidenceId,attachmentId });
      invalidateTab(tabToRefresh);
      await fetchData(tabToRefresh, { force: true });
      return result;
    } catch (error) {
      const customError = error as ICustomError;
      showToast(customError);
    }
  };

  const refreshTab = async (tab: TabValue = selectedTab) => {
    invalidateTab(tab);
    await fetchData(tab, { force: true });
  };

  return {
    data: data[selectedTab] ?? [],
    selectedTab,
    tabItems,
    ActiveComponent,
    handleChange: handleTabChange,
    deleteItemAndRefresh,
    fetchData,
    refreshTab,
    rawCache: data,
    fetchAttachment,
    removeAttachment
  };
};

export default useTabs;