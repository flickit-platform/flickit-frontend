import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "@/providers/AuthProvider";
import { setSurveyBox, useConfigContext } from "@providers/ConfgProvider";
import { useGraphicalReport } from "./useGraphicalReport";
import { useReportChips } from "@/hooks/useReportChips";
import { useIntersectOnce } from "@/utils/helpers";
import { ASSESSMENT_MODE } from "@/utils/enumType";
import type { IGraphicalReport } from "@/types";

export function useAssessmentReportVM() {
  const location = useLocation();
  const navState = (location.state || {}) as { language?: { code?: string } };
  const langCode = navState.language?.code;

  const { isAuthenticatedUser } = useAuthContext();
  const { dispatch } = useConfigContext();
  const { fetchPathInfo, fetchGraphicalReport, reload, computeInvalid } =
    useGraphicalReport();

  useIntersectOnce("recommendations", () => dispatch(setSurveyBox(true)));

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const report = fetchGraphicalReport.data as IGraphicalReport;

  const lng = (report?.lang?.code || langCode || "en").toLowerCase();
  const rtl = lng === "fa";
  const isQuickMode = report?.assessment?.mode?.code === ASSESSMENT_MODE.QUICK;

  const hasInvalidReport = useMemo(() => {
    if (!report) return false;
    const { subjects, advice, isAdvisable } = report;
    return computeInvalid(subjects, advice, isAdvisable, !!isQuickMode);
  }, [report, computeInvalid, isQuickMode]);

  const { infoItems, gotoItems } = useReportChips(report, lng, rtl);

  return {
    // fetchers
    fetchGraphicalReport,
    fetchPathInfo,
    reload,

    // flags & i18n
    isAuthenticatedUser,
    lng,
    rtl,
    isQuickMode: !!isQuickMode,
    hasInvalidReport,

    // chips
    infoItems,
    gotoItems,

    // selection state shared between sections
    selectedId,
    setSelectedId,

    // raw
    report,
  };
}
