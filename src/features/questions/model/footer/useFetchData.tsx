import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useQuery } from "@/hooks/useQuery";
import { useServiceContext } from "@providers/service-provider";
import { useParams } from "react-router-dom";
import { useQuestionContext } from "@/features/questions/context";

export type FooterTab = "evidences" | "comments" | "history";

const PAGE_SIZE = 10;

type TabState = {
  page: number;
  size: number;
  items: any[];
  total?: number;
  hasMore: boolean;
  loadingMore: boolean;
  initialized: boolean;
};

type StateMap = Record<FooterTab, TabState>;

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

const initialTabState = (): TabState => ({
  page: 0,
  size: PAGE_SIZE,
  items: [],
  total: undefined,
  hasMore: true,
  loadingMore: false,
  initialized: false,
});

const useFetchData = () => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const { selectedQuestion } = useQuestionContext();
  const questionId = selectedQuestion?.id;

  const isLoadingRef = useRef(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // --- mutations / queries
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

  const resolveComment = useQuery({
    service: (args, config) => service.questions.comments.resolve(args, config),
    runOnMount: false,
  });

  const evidencesQueryData = useQuery({
    service: (args, config) => service.questions.evidences.getAll(args, config),
    toastError: true,
    runOnMount: false,
  });
  const commentesQueryData = useQuery({
    service: (args, config) => service.questions.comments.getAll(args, config),
    toastError: true,
    runOnMount: false,
  });
  const answerHistoryQueryData = useQuery({
    service: (args, config) =>
      service.assessments.answer.getHistory(args, config),
    toastError: true,
    runOnMount: false,
  });
  const fetchEvidenceAttachments = useQuery({
    service: (args, config) =>
      service.questions.evidences.getAttachments(args, config),
    runOnMount: false,
  });

  // --- maps
  const queriesMap = useMemo(
    () =>
      ({
        evidences: evidencesQueryData,
        comments: commentesQueryData,
        history: answerHistoryQueryData,
      }) as const,
    [evidencesQueryData, commentesQueryData, answerHistoryQueryData],
  );

  const [stateMap, setStateMap] = useState<StateMap>({
    evidences: initialTabState(),
    comments: initialTabState(),
    history: initialTabState(),
  });

  const setTabState = useCallback(
    (tab: FooterTab, updater: (prev: TabState) => TabState) => {
      setStateMap((prev) => ({ ...prev, [tab]: updater(prev[tab]) }));
    },
    [],
  );

  const resetAll = useCallback(() => {
    setStateMap({
      evidences: initialTabState(),
      comments: initialTabState(),
      history: initialTabState(),
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

  // --- generic fetch (first page)
  const fetchByTab = useCallback(
    async (tab: FooterTab) => {
      if (!questionId || !assessmentId) return;
      const q = queriesMap[tab];
      if (!q) return;

      const args = { questionId, assessmentId, page: 1, size: PAGE_SIZE };
      const r = await q.query(args);
      const items = normalizeItems(r);
      const total = getTotal(r);

      setTabState(tab, () => ({
        page: 1,
        size: PAGE_SIZE,
        items,
        total,
        hasMore:
          total == null ? items.length === PAGE_SIZE : items.length < total,
        loadingMore: false,
        initialized: true,
      }));

      return r;
    },
    [questionId, assessmentId, queriesMap, setTabState],
  );

  // --- generic load more (append)
  const loadMoreByTab = useCallback(
    async (tab: FooterTab) => {
      if (isLoadingRef.current) return;

      const q = queriesMap[tab];
      const current = stateMap[tab];
      if (!q || !current.hasMore || current.loadingMore) return;

      isLoadingRef.current = true;
      setTabState(tab, (s) => ({ ...s, loadingMore: true }));

      try {
        const nextPage = current.page + 1;
        const r = await q.query({
          questionId,
          assessmentId,
          page: nextPage,
          size: current.size,
        });

        const newItems = normalizeItems(r);
        const total = getTotal(r) ?? current.total;
        const totalCount = current.items.length + newItems.length;
        const hasMore =
          total == null ? newItems.length === current.size : totalCount < total;

        setTabState(tab, (s) => ({
          ...s,
          page: nextPage,
          items: [...s.items, ...newItems],
          total,
          hasMore,
          loadingMore: false,
          initialized: true,
        }));

        return r;
      } catch (e) {
        setTabState(tab, (s) => ({ ...s, loadingMore: false }));
        throw e;
      } finally {
        isLoadingRef.current = false;
      }
    },
    [assessmentId, questionId, queriesMap, stateMap, setTabState],
  );

  const debouncedLoadMore = useCallback(
    (tab: FooterTab) => {
      if (isLoadingRef.current || debounceRef.current) return;
      debounceRef.current = setTimeout(() => {
        loadMoreByTab(tab);
        debounceRef.current = null;
      }, 300);
    },
    [loadMoreByTab],
  );

  // derivations for backward compatibility with callers
  const evidences = stateMap.evidences.items;
  const comments = stateMap.comments.items;
  const histories = stateMap.history.items;

  const evidencesState = stateMap.evidences;
  const commentsState = stateMap.comments;
  const historyState = stateMap.history;

  return {
    // mutations
    deleteEvidence,
    removeEvidenceAttachments,
    addEvidence,
    resolveComment,

    // infinite data
    evidences,
    comments,
    histories,

    evidencesState,
    commentsState,
    historyState,

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
