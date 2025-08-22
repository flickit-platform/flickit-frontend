import { useCallback, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PermissionControl from "../common/PermissionControl";
import { useQuery } from "@/utils/useQuery";
import {
  ErrorCodes,
  IGraphicalReport,
  ISubject,
  PathInfo,
} from "@/types/index";
import { useServiceContext } from "@/providers/ServiceProvider";
import { styles } from "@styles";
import { t } from "i18next";
import useCalculate from "@/hooks/useCalculate";
import QueryData from "../common/QueryData";
import { ASSESSMENT_MODE, VISIBILITY } from "@/utils/enumType";
import GraphicalReportSkeleton from "../common/loadings/GraphicalReportSkeleton";
import { useAuthContext } from "@/providers/AuthProvider";
import { setSurveyBox, useConfigContext } from "@providers/ConfgProvider";
import AssessmentReportTitle from "./AssessmentReportTitle";
import { Button, Typography, Box } from "@mui/material";
import { Replay } from "@mui/icons-material";
import { getBasePath, useIntersectOnce } from "@/utils/helpers";

const InvalidReportBanner = ({ onRetry }: { onRetry: () => void }) => (
  <Box
    bgcolor="error.main"
    height={48}
    gap={6}
    sx={{ ...styles.centerVH }}
    role="alert"
    aria-live="polite"
  >
    <Typography
      variant="semiBoldLarge"
      color="error.contrastText"
      sx={{ ...styles.centerV }}
    >
      {t("notification.incompleteReportDueToDelay")}
    </Typography>
    <Box bgcolor="background.container" color="error.main" borderRadius="4px">
      <Button
        onClick={onRetry}
        size="small"
        variant="contained"
        color="inherit"
        endIcon={<Replay />}
      >
        {t("common.retry")}
      </Button>
    </Box>
  </Box>
);

const AssessmentReport = () => {
  const { calculate, calculateConfidence } = useCalculate();
  const { isAuthenticatedUser } = useAuthContext();
  const { service } = useServiceContext();
  const { dispatch } = useConfigContext();

  const location = useLocation();

  const { assessmentId = "", spaceId = "", linkHash = "" } = useParams();

  const fetchPathInfo = useQuery<PathInfo>({
    service: (args, config) =>
      service.common.getPathInfo({ assessmentId, ...(args ?? {}) }, config),
    runOnMount: isAuthenticatedUser ?? false,
  });

  const fetchGraphicalReport = useQuery({
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

  // --- intersection for survey box (trigger once when recommendations appears)
  useIntersectOnce("recommendations", () => dispatch(setSurveyBox(true)));

  // --- handle error codes (type-safe & optional handlers)
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
      errorActions,
    ],
  );

  useEffect(() => {
    const code = fetchGraphicalReport.errorObject?.response?.data?.code;
    if (code != null) void handleErrorResponse(code);
  }, [
    fetchGraphicalReport.errorObject?.response?.data?.code,
    handleErrorResponse,
  ]);

  // --- reload
  const handleReloadReport = () => fetchGraphicalReport.query();

  // --- smart back (optional: currently unused; keep if needed elsewhere)
  // const { state } = useLocation();  // اگر از state استفاده می‌کنی این را فعال کن
  // const from = state?.location?.from;
  // const handleBack = () => {
  //   if (from) navigate(from, { replace: true });
  //   else navigate(`/${spaceId}/assessments/${assessmentId}/`, { replace: true });
  // };

  // --- helper
  const isInvalid = (
    subjects: ISubject[] = [],
    advice: { narration?: string; adviceItems?: unknown[] } | null | undefined,
    isAdvisable: boolean,
    quickMode: boolean,
  ) => {
    if (!quickMode || !isAuthenticatedUser) return false;
    const hasMissingInsight = subjects.some((s) => !s?.insight);
    const hasMissingAdvice =
      isAdvisable &&
      (!advice?.narration?.trim?.() || (advice.adviceItems?.length ?? 0) === 0);
    return hasMissingInsight || hasMissingAdvice;
  };

  useEffect(() => {
    const data = fetchGraphicalReport.data as IGraphicalReport | undefined;

    const visibility = data?.visibility;
    const linkHashFromData = data?.linkHash;

    if (visibility === VISIBILITY.PUBLIC && linkHashFromData) {
      const basePath = getBasePath(location.pathname);
      const newPath = `${basePath}${linkHashFromData}/`;
      if (location.pathname !== newPath) {
        window.history.replaceState({}, "", newPath);
      }
    }
  }, [fetchGraphicalReport.data, location.pathname]);

  const navState = (location.state || {}) as {
    language?: { code?: string };
  };

  const langCode = navState.language?.code;

  return (
    <PermissionControl error={[fetchGraphicalReport.errorObject]}>
      <QueryData
        {...fetchGraphicalReport}
        renderLoading={() => (
          <GraphicalReportSkeleton
            lang={langCode}
            isAuthenticatedUser={isAuthenticatedUser}
          />
        )}
        render={(graphicalReport) => {
          const { assessment, advice, subjects, lang, isAdvisable } =
            graphicalReport as IGraphicalReport;

          const isQuickMode = assessment?.mode?.code === ASSESSMENT_MODE.QUICK;
          const lng = lang?.code?.toLowerCase();
          const rtlLanguage = lng === "fa";

          return (
            <>
              {isInvalid(subjects, advice, isAdvisable, isQuickMode) && (
                <InvalidReportBanner onRetry={handleReloadReport} />
              )}

              <Box
                m="auto"
                pb={3}
                textAlign={rtlLanguage ? "right" : "left"}
                p={
                  isInvalid(subjects, advice, isAdvisable, isQuickMode)
                    ? 1
                    : { xs: 1, sm: 1, md: 4 }
                }
                px={{ xxl: 30, xl: 20, lg: 12, md: 8, xs: 1, sm: 3 }}
                sx={{ ...styles.rtlStyle(rtlLanguage) }}
              >
                {isAuthenticatedUser && (
                  <QueryData
                    {...fetchPathInfo}
                    render={(pathInfo) => (
                      <AssessmentReportTitle
                        pathInfo={pathInfo}
                        rtlLanguage={rtlLanguage}
                      />
                    )}
                  />
                )}
              </Box>
            </>
          );
        }}
      />
    </PermissionControl>
  );
};

export default AssessmentReport;
