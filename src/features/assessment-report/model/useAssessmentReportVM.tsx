import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "@/providers/auth-provider";
import { setSurveyBox, useConfigContext } from "@/providers/config-provider";
import { useGraphicalReport } from "./useGraphicalReport";
import { useReportChips } from "@/features/assessment-report/model/hooks/useReportChips";
import { useIntersectOnce } from "@/utils/helpers";
import { ASSESSMENT_MODE } from "@/utils/enum-type";
import type { IGraphicalReport } from "@/types";
import useDialog from "@/hooks/useDialog";
import keycloakService from "@/service/keycloakService";
import { t } from "i18next";
import { Text } from "@/components/common/Text";

export function useAssessmentReportVM() {
  const location = useLocation();
  const navState = (location.state || {}) as { language?: { code?: string } };
  const langCode = navState.language?.code;
  const navigate = useNavigate();
  const { assessmentId, spaceId } = useParams();

  const { isAuthenticatedUser } = useAuthContext();
  const { dispatch } = useConfigContext();
  const { fetchPathInfo, fetchGraphicalReport, fetchData } =
    useGraphicalReport();

  useIntersectOnce("recommendations", () => dispatch(setSurveyBox(true)));

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const report = fetchGraphicalReport.data as IGraphicalReport;

  const lng = (report?.lang?.code || langCode || "en").toLowerCase();
  const rtl = lng === "fa";
  const isQuickMode = report?.assessment?.mode?.code === ASSESSMENT_MODE.QUICK;

  const hasInvalidReport = useMemo(() => {
    if (!report) return false;
  }, [report, isQuickMode]);

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
          <Text
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

  const navigateDashboard = () => {
    navigate(`/${spaceId}/assessments/1/${assessmentId}/dashboard`);
  };

  const navigateQuestionnaire = () => {
    navigate(`/${spaceId}/assessments/1/${assessmentId}/questionnaires`);
  };

  return {
    fetchGraphicalReport,
    fetchPathInfo,
    fetchData,
    isAuthenticatedUser,
    lng,
    rtl,
    isQuickMode: !!isQuickMode,
    hasInvalidReport,
    infoItems,
    gotoItems,
    selectedId,
    setSelectedId,
    report,
    shareDialog,
    expertDialog,
    expertContext,
    navigateDashboard,
    navigateQuestionnaire
  };
}
