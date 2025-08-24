import { useCallback, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "@/utils/useQuery";
import { ErrorCodes, IGraphicalReport, PathInfo, ISubject } from "@/types";
import { VISIBILITY } from "@/utils/enumType";
import { getBasePath } from "@/utils/helpers";
import { useAuthContext } from "@/providers/AuthProvider";
import { useServiceContext } from "@/providers/ServiceProvider";
import useCalculate from "@/hooks/useCalculate";

export const useGraphicalReport = () => {
  const location = useLocation();
  const { isAuthenticatedUser } = useAuthContext();
  const { service } = useServiceContext();

  const { assessmentId = "", linkHash = "" } = useParams();
  const { calculate, calculateConfidence } = useCalculate();

  const fetchPathInfo = useQuery<PathInfo>({
    service: (args, config) =>
      service.common.getPathInfo({ assessmentId, ...(args ?? {}) }, config),
    runOnMount: !!isAuthenticatedUser,
  });

  const fetchGraphicalReport = useQuery<IGraphicalReport>({
    service: (args, config) =>
      isAuthenticatedUser
        ? service.assessments.report.getGraphical(
            { assessmentId, ...(args ?? {}) },
            config,
          )
        : service.assessments.report.getPublicGraphicalReport(
            { linkHash, ...(args ?? {}) },
            { skipAuth: true, ...config },
          ),
    runOnMount: true,
  });

  // --- error handling (self-heal)
  const errorActions: Partial<
    Record<ErrorCodes | "DEPRECATED", () => Promise<boolean>>
  > = {
    [ErrorCodes.CalculateNotValid]: () => calculate(),
    [ErrorCodes.ConfidenceCalculationNotValid]: () => calculateConfidence(),
    DEPRECATED: () =>
      service.assessments.info
        .migrateKitVersion({ assessmentId })
        .then(() => true)
        .catch(() => false),
  };

  const handleErrorResponse = useCallback(
    async (code: unknown) => {
      if (typeof code !== "string" && typeof code !== "number") return;
      const action =
        errorActions[code as ErrorCodes | "DEPRECATED"] ??
        errorActions[String(code) as ErrorCodes | "DEPRECATED"];
      if (!action) return;
      const ok = await action();
      if (ok) fetchGraphicalReport.query();
    },
    [
      assessmentId,
      calculate,
      calculateConfidence,
      fetchGraphicalReport,
      service.assessments.info,
    ],
  );

  useEffect(() => {
    const code = fetchGraphicalReport.errorObject?.response?.data?.code;
    if (code != null) handleErrorResponse(code);
}, [
    fetchGraphicalReport.errorObject?.response?.data?.code,
    handleErrorResponse,
  ]);

  const reload = () => fetchGraphicalReport.query();

  // --- sync public URL (only once when data changes)
  useEffect(() => {
    const data = fetchGraphicalReport.data as IGraphicalReport | undefined;
    if (data?.visibility === VISIBILITY.PUBLIC && data?.linkHash) {
      const basePath = getBasePath(location.pathname);
      const newPath = `${basePath}${data.linkHash}/`;
      if (location.pathname !== newPath) {
        window.history.replaceState({}, "", newPath);
      }
    }
  }, [fetchGraphicalReport.data, location.pathname]);

  // --- helpers (feature-specific)
  const computeInvalid = useCallback(
    (
      subjects: ISubject[] = [],
      advice:
        | { narration?: string; adviceItems?: unknown[] }
        | null
        | undefined,
      isAdvisable: boolean,
      quickMode: boolean,
    ) => {
      if (!quickMode || !isAuthenticatedUser) return false;
      const hasMissingInsight = (subjects ?? []).some((s) => !s?.insight);
      const hasMissingAdvice =
        isAdvisable &&
        (!advice?.narration?.trim?.() ||
          (advice?.adviceItems?.length ?? 0) === 0);
      return hasMissingInsight || hasMissingAdvice;
    },
    [isAuthenticatedUser],
  );

  return {
    fetchPathInfo,
    fetchGraphicalReport,
    reload,
    computeInvalid,
  };
};
