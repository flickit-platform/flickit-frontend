import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "@/providers/AuthProvider";
import { setSurveyBox, useConfigContext } from "@providers/ConfgProvider";
import { useGraphicalReport } from "./useGraphicalReport";
import { useReportChips } from "@/features/assessment-report/model/hooks/useReportChips";
import { useIntersectOnce } from "@/utils/helpers";
import { ASSESSMENT_MODE } from "@/utils/enumType";
import type { IGraphicalReport } from "@/types";
import useDialog from "@/utils/useDialog";
import keycloakService from "@/service/keycloakService";
import { Typography } from "@mui/material";
import { t } from "i18next";

export function useAssessmentReportVM() {
  const location = useLocation();
  const navState = (location.state || {}) as { language?: { code?: string } };
  const langCode = navState.language?.code;
  const navigate = useNavigate();
  const { assessmentId, spaceId } = useParams();

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

  const shareDialog = useDialog();
  const expertDialog = useDialog();

  const email =
    keycloakService._kc.tokenParsed?.preferred_username ??
    keycloakService._kc.tokenParsed?.sub;

  const expertContext = useMemo(() => {
    return {
      type: "requestAnExpertReview",
      data: {
        email,
        dialogTitle: t("assessmentReport.contactExpertGroup", { lng }),
        children: (
          <Typography
            textAlign="justify"
            variant="bodyLarge"
            fontFamily="inherit"
            dangerouslySetInnerHTML={{
              __html: t("assessmentReport.requestAnExpertReviewContent", {
                lng,
              }),
            }}
          />
        ),
      },
    };
  }, []);

  const handleGoToQuestionnaire = () => {
    navigate(`/${spaceId}/assessments/1/${assessmentId}/questionnaires`);
  };

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

    // dialogs
    shareDialog,
    expertDialog,
    expertContext,

    //buttons
    handleGoToQuestionnaire,
  };
}
