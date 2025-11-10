import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useQuery } from "@/hooks/useQuery";
import { useServiceContext } from "@providers/service-provider";
import { useParams } from "react-router-dom";
import { useQuestionContext } from "@/features/questions/context";

export type FooterTab = "evidences" | "comments" | "history";

const PAGE_SIZE = 10;

function normalizeItems(r: any): any[] {
  if (!r) return [];
  if (Array.isArray(r)) return r;
  if (Array.isArray(r?.items)) return r.items;
  if (Array.isArray(r?.list)) return r.list;
  if (Array.isArray(r?.content)) return r.content;
  return [];
}
function getTotal(r: any): number | undefined {
  return r?.total ?? r?.totalElements ?? r?.count ?? undefined;
}

const useFetchData = () => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const { selectedQuestion } = useQuestionContext();
  const questionId = selectedQuestion?.id;

  // ref برای جلوگیری از درخواست‌های تکراری
  const isLoadingRef = useRef(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // ---- Mutations
  const deleteEvidence = useQuery({
    service: (args, config) => service.questions.evidences.remove(args, config),
    runOnMount: false,
  });
  const addEvidence = useQuery({
    service: (args, config) => service.questions.evidences.save(args, config),
    runOnMount: false,
  });
  const removeEvidenceAttachments = useQuery({
    service: (args, config) =>
      service.questions.evidences.removeAttachment(args, config),
    runOnMount: false,
  });

  // ---- Queries
  const answerHistoryQueryData = useQuery({
    service: (args, config) =>
      service.assessments.answer.getHistory(
        args ?? { questionId, assessmentId, page: 1, size: PAGE_SIZE },
        config,
      ),
    toastError: true,
    runOnMount: false,
  });

  const evidencesQueryData = useQuery({
    service: (args, config) =>
      service.questions.evidences.getAll(
        args ?? { questionId, assessmentId, page: 1, size: PAGE_SIZE },
        config,
      ),
    toastError: true,
    runOnMount: false,
  });

  const commentesQueryData = useQuery({
    service: (args, config) =>
      service.questions.comments.getAll(
        args ?? { questionId, assessmentId, page: 1, size: PAGE_SIZE },
        config,
      ),
    toastError: true,
    runOnMount: false,
  });

  const fetchEvidenceAttachments = useQuery({
    service: (args, config) =>
      service.questions.evidences.getAttachments(
        args ?? { questionId, assessmentId },
        config,
      ),
    runOnMount: false,
  });

  // ---- Infinite state per tab
  type TabState = {
    page: number;
    size: number;
    items: any[];
    total?: number;
    hasMore: boolean;
    loadingMore: boolean;
    initialized: boolean;
  };
  
  const [evidencesState, setEvidencesState] = useState<TabState>({
    page: 0,
    size: PAGE_SIZE,
    items: [],
    total: undefined,
    hasMore: true,
    loadingMore: false,
    initialized: false,
  });
  
  const [commentsState, setCommentsState] = useState<TabState>({
    page: 0,
    size: PAGE_SIZE,
    items: [],
    total: undefined,
    hasMore: true,
    loadingMore: false,
    initialized: false,
  });
  
  const [historyState, setHistoryState] = useState<TabState>({
    page: 0,
    size: PAGE_SIZE,
    items: [],
    total: undefined,
    hasMore: true,
    loadingMore: false,
    initialized: false,
  });

  const resetAll = useCallback(() => {
    setEvidencesState({
      page: 0,
      size: PAGE_SIZE,
      items: [],
      total: undefined,
      hasMore: true,
      loadingMore: false,
      initialized: false,
    });
    setCommentsState({
      page: 0,
      size: PAGE_SIZE,
      items: [],
      total: undefined,
      hasMore: true,
      loadingMore: false,
      initialized: false,
    });
    setHistoryState({
      page: 0,
      size: PAGE_SIZE,
      items: [],
      total: undefined,
      hasMore: true,
      loadingMore: false,
      initialized: false,
    });
    isLoadingRef.current = false;
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  }, []);

  useEffect(() => {
    resetAll();
  }, [questionId, assessmentId, resetAll]);

  // ---- loaders
  const fetchByTab = useCallback(
    async (tab: FooterTab) => {
      if (!questionId || !assessmentId) return;

      const baseArgs = { questionId, assessmentId, page: 1, size: PAGE_SIZE };

      if (tab === "evidences") {
        const r = await evidencesQueryData.query(baseArgs);
        const items = normalizeItems(r);
        const total = getTotal(r);
        setEvidencesState({
          page: 1,
          size: PAGE_SIZE,
          items,
          total,
          hasMore: total != null ? items.length < total : items.length === PAGE_SIZE,
          loadingMore: false,
          initialized: true,
        });
        return r;
      }

      if (tab === "comments") {
        const r = await commentesQueryData.query(baseArgs);
        const items = normalizeItems(r);
        const total = getTotal(r);
        setCommentsState({
          page: 1,
          size: PAGE_SIZE,
          items,
          total,
          hasMore: total != null ? items.length < total : items.length === PAGE_SIZE,
          loadingMore: false,
          initialized: true,
        });
        return r;
      }

      if (tab === "history") {
        const r = await answerHistoryQueryData.query(baseArgs);
        const items = normalizeItems(r);
        const total = getTotal(r);
        setHistoryState({
          page: 1,
          size: PAGE_SIZE,
          items,
          total,
          hasMore: total != null ? items.length < total : items.length === PAGE_SIZE,
          loadingMore: false,
          initialized: true,
        });
        return r;
      }
    },
    [questionId, assessmentId, evidencesQueryData, commentesQueryData, answerHistoryQueryData],
  );

  const loadMoreByTab = useCallback(
    async (tab: FooterTab) => {
      // جلوگیری از درخواست‌های تکراری
      if (isLoadingRef.current) return;
      
      let currentState: TabState;
      let queryFunction: any;
      let setStateFunction: any;

      if (tab === "evidences") {
        if (!evidencesState.hasMore || evidencesState.loadingMore) return;
        currentState = evidencesState;
        queryFunction = evidencesQueryData.query;
        setStateFunction = setEvidencesState;
      } else if (tab === "comments") {
        if (!commentsState.hasMore || commentsState.loadingMore) return;
        currentState = commentsState;
        queryFunction = commentesQueryData.query;
        setStateFunction = setCommentsState;
      } else if (tab === "history") {
        if (!historyState.hasMore || historyState.loadingMore) return;
        currentState = historyState;
        queryFunction = answerHistoryQueryData.query;
        setStateFunction = setHistoryState;
      } else {
        return;
      }

      isLoadingRef.current = true;
      setStateFunction((s: TabState) => ({ ...s, loadingMore: true }));

      try {
        const nextPage = currentState.page + 1;
        const r = await queryFunction({
          questionId,
          assessmentId,
          page: nextPage,
          size: currentState.size,
        });
        
        const newItems = normalizeItems(r);
        const total = getTotal(r) ?? currentState.total;
        
        // محاسبه صحیح hasMore
        const currentTotalItems = currentState.items.length + newItems.length;
        const hasMoreData = total != null ? currentTotalItems < total : newItems.length === currentState.size;
        
        setStateFunction((s: TabState) => ({
          ...s,
          page: nextPage,
          items: [...s.items, ...newItems],
          total,
          hasMore: hasMoreData,
          loadingMore: false,
          initialized: true,
        }));
        
        return r;
      } catch (error) {
        setStateFunction((s: TabState) => ({ ...s, loadingMore: false }));
        throw error;
      } finally {
        isLoadingRef.current = false;
      }
    },
    [
      questionId,
      assessmentId,
      evidencesState,
      commentsState,
      historyState,
      evidencesQueryData,
      commentesQueryData,
      answerHistoryQueryData,
    ],
  );

  // تابع برای اینفینیتی اسکرول - با debounce
  const debouncedLoadMore = useCallback(
    (tab: FooterTab) => {
      // اگر در حال لود هستیم یا debounce فعال است، return
      if (isLoadingRef.current || debounceRef.current) return;

      debounceRef.current = setTimeout(() => {
        loadMoreByTab(tab);
        debounceRef.current = null;
      }, 300);
    },
    [loadMoreByTab]
  );

  // خروجی‌های آماده برای رندر
  const evidences = evidencesState.items;
  const comments = commentsState.items;
  const histories = historyState.items;

  return {
    // mutations
    deleteEvidence,
    removeEvidenceAttachments,
    addEvidence,

    // infinite data
    evidences,
    comments,
    histories,

    evidencesState,
    commentsState,
    historyState,

    // queries
    evidencesQueryData,
    commentesQueryData,
    answerHistoryQueryData,
    fetchEvidenceAttachments,

    // helpers
    fetchByTab,
    loadMoreByTab: debouncedLoadMore,
    resetAll,
  };
};

export default useFetchData;