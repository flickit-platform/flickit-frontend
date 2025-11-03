import { useQuery } from "@/hooks/useQuery";
import { useServiceContext } from "@providers/service-provider";
import { useParams } from "react-router-dom";
import { lazy, SyntheticEvent, useEffect, useMemo, useRef, useState } from "react";
import { t } from "i18next";
import showToast from "@utils/toast-error";
import { ICustomError } from "@utils/custom-error";
import UseEvidenceApi from "@/features/questions/model/evidenceTabs/useEvidenceAPI";

const EvidenceList = lazy(() => import("../../ui/evidences/EvidenceList"));
const AnswerHistory = lazy(() => import("../../ui/evidences/AnswerHistory"));

const useEvidence = (selectedQuestion: any): any => {
  const { id: questionId } = selectedQuestion ?? { id: 0 };
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();

  const saveId = useRef<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [data, setData] = useState<Record<string, any[]>>({});
  const [selectedTab, setSelectedTab] = useState<string>("evidence");

  const tabItems = useMemo(
    () => [
      { index: 0, label: t("common.evidence"), value: "evidence", component: EvidenceList },
      { index: 1, label: t("questions.comments"), value: "comment", component: EvidenceList },
      { index: 2, label: t("questions.answerHistory"), value: "answerHistory", component: AnswerHistory },
    ],
    [t],
  );

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };

  const ActiveComponent = useMemo(() => {
    const activeTab = tabItems.find((item) => item.value === selectedTab);
    return activeTab ? activeTab.component : null;
  }, [selectedTab, tabItems]);

  // queries
  const {evidencesQueryData, commentesQueryData, answerHistoryQueryData, deleteEvidence, fetchEvidenceAttachments} = UseEvidenceApi(questionId)

  useEffect(() => {
    if (questionId !== saveId.current) {
      saveId.current = questionId;
      setSelectedTab("evidence");
      setData({});
    }
  }, [questionId]);


  const fetchData = async (tab = selectedTab, options?: { force?: boolean }) => {
    const force = options?.force ?? false;

    if (!force && Array.isArray(data[tab])) {
      return;
    }

    const QueryMap: Record<string, any> = {
      evidence: evidencesQueryData,
      comment: commentesQueryData,
      answerHistory: answerHistoryQueryData,
    };

    const currentQuery = QueryMap[tab];
    if (!currentQuery) return;

    try {
      const { items } = await currentQuery.query();
      setData((prev) => ({
        ...prev,
        [tab]: tab === "comment" ? (items ?? []).map((it: any) => ({ ...it, type: "Comment" })) : items ?? [],
      }));
    } catch (e) {
      const err = e as ICustomError;
      showToast(err);
    }
  };

  useEffect(() => {
    fetchData(selectedTab).then();
  }, [selectedTab, questionId, currentPage]);


  const invalidateTab = (tab: string) => {
    setData((prev) => {
      const copy = { ...prev };
      delete copy[tab];
      return copy;
    });
  };

  const deleteItemAndRefresh = async (evidenceId: number, tabToRefresh = "evidence") => {
    try {
      await deleteEvidence.query({ id: evidenceId });
      invalidateTab(tabToRefresh);
      await fetchData(tabToRefresh, { force: true });
    } catch (err) {
      const e = err as ICustomError;
      showToast(e);
    }
  };

  const fetchAttachment = async (evidenceId: number, tabToRefresh = "evidence") =>{
    try {

      const result = await fetchEvidenceAttachments.query({ evidence_id: evidenceId });
      // invalidateTab(tabToRefresh);
      // await fetchData(tabToRefresh, { force: true });
      return result
    } catch (err) {
      const e = err as ICustomError;
      showToast(e);
    }
  }

  const refreshTab = async (tab = selectedTab) => {
    invalidateTab(tab);
    await fetchData(tab, { force: true });
  };

  return {
    data: data[selectedTab] ?? [],
    selectedTab,
    tabItems,
    ActiveComponent,
    handleChange,
    deleteItemAndRefresh,
    fetchData,
    refreshTab,
    setCurrentPage,
    rawCache: data,
    fetchAttachment
  };
};

export default useEvidence;
