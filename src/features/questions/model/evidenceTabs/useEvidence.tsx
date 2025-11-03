import { useQuery } from "@/hooks/useQuery";
import { useServiceContext } from "@providers/service-provider";
import { useParams } from "react-router-dom";
import { lazy, SyntheticEvent, useEffect, useMemo, useRef, useState } from "react";
import { t } from "i18next";
import showToast from "@utils/toast-error";
import { ICustomError } from "@utils/custom-error";

const EvidenceList = lazy(() => import("../../ui/evidences/EvidenceList"));
const AnswerHistory = lazy(() => import("../../ui/evidences/AnswerHistory"));

const useEvidence = (selectedQuestion: any): any => {
  const { id: questionId } = selectedQuestion ?? { id: 0 };
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();

  const saveId = useRef<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // cache per tab: { evidence: [...], comments: [...], answerHistory: [...] }
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
  const deleteEvidence = useQuery({
    service: (args, config) => service.questions.evidences.remove(args, config),
    runOnMount: false,
  });

  const answerHistoryQueryData = useQuery({
    service: (args, config) =>
      service.assessments.answer.getHistory(
        args ??
        ({
          questionId,
          assessmentId,
          page: currentPage,
          size: 10,
        } as any),
        config,
      ),
    toastError: true,
    runOnMount: false,
  });

  const evidencesQueryData = useQuery({
    service: (args, config) =>
      service.questions.evidences.getAll(
        args ??
        ({
          questionId,
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
          questionId,
          assessmentId,
          page: currentPage,
          size: 10,
        } as any),
        config,
      ),
    toastError: true,
    runOnMount: false,
  });

  // reset cache when question changes
  useEffect(() => {
    if (questionId !== saveId.current) {
      saveId.current = questionId;
      setSelectedTab("evidence"); // default tab
      setData({}); // clear cache for new question
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
      // پس از حذف، فقط کش تب مربوطه را پاک کن و مجدداً آن تب را fetch کن
      invalidateTab(tabToRefresh);
      await fetchData(tabToRefresh, { force: true });
    } catch (err) {
      const e = err as ICustomError;
      showToast(e);
    }
  };

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
    deleteItemAndRefresh, // استفاده در کامپوننت حذف
    fetchData, // در صورت نیاز مستقیم
    refreshTab,
    setCurrentPage,
    rawCache: data, // (اختیاری) برای دیباگ یا نمایش تعداد آیتم‌ها
  };
};

export default useEvidence;
