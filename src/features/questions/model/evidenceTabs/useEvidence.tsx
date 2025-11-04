import { lazy, SyntheticEvent, useEffect, useMemo, useRef, useState } from "react";
import { t } from "i18next";
import showToast from "@utils/toast-error";
import { ICustomError } from "@utils/custom-error";
import UseEvidenceApi from "@/features/questions/model/evidenceTabs/useEvidenceAPI";

const EvidenceList = lazy(() => import("../../ui/evidences/EvidenceList"));
const AnswerHistory = lazy(() => import("../../ui/evidences/AnswerHistory"));

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
  { index: 0, label: "common.evidence", value: "evidence", component: EvidenceList },
  { index: 1, label: "questions.comments", value: "comment", component: EvidenceList },
  { index: 2, label: "questions.answerHistory", value: "answerHistory", component: AnswerHistory },
];

const useEvidence = (selectedQuestion: any) => {
  const { id: questionId } = selectedQuestion ?? { id: 0 };

  const saveId = useRef<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [data, setData] = useState<Record<string, any[]>>({});
  const [selectedTab, setSelectedTab] = useState<TabValue>("evidence");

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
  } = UseEvidenceApi(questionId);

  const QUERY_MAP = useMemo(
      () => ({
        evidence: evidencesQueryData,
        comment: commentesQueryData,
        answerHistory: answerHistoryQueryData,
      }),
      [evidencesQueryData, commentesQueryData, answerHistoryQueryData]
  );

  useEffect(() => {
    if (questionId !== saveId.current) {
      saveId.current = questionId;
      setSelectedTab("evidence");
      setData({});
    }
  }, [questionId]);

  const transformCommentData = (items: any[]) => {
    return items.map((item) => ({ ...item, type: "Comment" }));
  };

  const fetchData = async (tab: TabValue = selectedTab, options: FetchOptions = {}) => {
    const { force = false } = options;

    if (!force && Array.isArray(data[tab])) {
      return;
    }

    const currentQuery = QUERY_MAP[tab];
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
    fetchData(selectedTab);
  }, [selectedTab, questionId, currentPage]);

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
    setCurrentPage,
    rawCache: data,
    fetchAttachment,
    removeAttachment
  };
};

export default useEvidence;