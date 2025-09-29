"use client";
import { Box, Grid, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import ShareIcon from "@mui/icons-material/ShareOutlined";
import PermissionControl from "@/components/common/PermissionControl";
import QueryData from "@/components/common/QueryData";
import GraphicalReportSkeleton from "@/features/assessment-report/ui/loading/GraphicalReportSkeleton";
import { styles } from "@styles";
import { t } from "i18next";
import type { PathInfo } from "@/types";
import {useCallback, useEffect, useState} from "react";

import { useAssessmentReportVM } from "../../assessment-report/model/useAssessmentReportVM";
import AssessmentReportTitle from "./AssessmentReportTitle";
import InvalidReportBanner from "./InvalidReportBanner";
import ContactExpertBox from "./ContactExpertBox";
import ShareDialog from "./ShareDialog";
import SectionCard from "./SectionCard";
import ReportHeader from "./sections/header/ReportHeader";
import ScoreSection from "./sections/header/ScoreSection";
import TreeMapSection from "./sections/tree-map/TreeMapSection";
import AdviceSection from "./sections/AdviceSection";
import SidebarQuickMode from "./sections/header/SidebarQuickMode";
import ContactUsDialog from "@/components/common/dialogs/ContactUsDialog";
import ReportActionsRow from "./ReportActionsRow";
import HowIsItMade from "@/features/assessment-report/ui/sections/howIsItMade";
import { ASSESSMENT_MODE } from "@/utils/enum-type";
import AIGenerated from "@/components/common/icons/AIGenerated";
import ChecklistRtlRoundedIcon from "@mui/icons-material/ChecklistRtlRounded";
import ChecklistRoundedIcon from "@mui/icons-material/ChecklistRounded";
import { Dashboard } from "@mui/icons-material";

export default function AssessmentReportPage() {
  const {
    fetchGraphicalReport,
    fetchPathInfo,
    reload,
    isAuthenticatedUser,
    lng,
    rtl,
    isQuickMode,
    hasInvalidReport,
    infoItems,
    gotoItems,
    selectedId,
    setSelectedId,
    report,
    handleNavigation,
    expertContext,
    expertDialog,
    shareDialog,
  } = useAssessmentReportVM();

  const [step, setStep] = useState(0);
  const onShare = useCallback(() => shareDialog.openDialog({}), [shareDialog]);
  const onExpert = useCallback(
    () => expertDialog.openDialog({}),
    [expertDialog],
  );

  useEffect(() => {
    if (globalThis.location.hash === "#shareDialog") {
      shareDialog.openDialog({ type: "create" });
      const cleanUrl = globalThis.location?.href?.split('#')[0] ?? '';
      globalThis.history.replaceState(null, globalThis.document.title, cleanUrl);
      setStep(1)
    }
  }, []);

  return (
    <PermissionControl error={[fetchGraphicalReport.errorObject]}>
      <QueryData
        {...fetchGraphicalReport}
        renderLoading={() => (
          <GraphicalReportSkeleton
            lang={lng}
            isAuthenticatedUser={isAuthenticatedUser}
          />
        )}
        render={() => {
          const { assessment, advice, subjects, permissions } = report;
          const isAdvancedMode =
            report?.assessment?.mode?.code === ASSESSMENT_MODE.ADVANCED;
          const navigate = () => {
            handleNavigation(permissions);
          };
          const sidebarProps = {
            show: isAuthenticatedUser && isQuickMode,
            lng,
            rtl,
            canShare:
              permissions.canShareReport || permissions.canManageVisibility,
            navigate,
            canViewQuestionnaires: permissions.canViewQuestionnaires,
            onShare,
            ContactBox: (
              <ContactExpertBox lng={lng} rtl={rtl} onOpen={onExpert} />
            ),
          };

          return (
            <Box pb={4}>
              {hasInvalidReport && <InvalidReportBanner onRetry={reload} />}

              <Box
                m="auto"
                pb={3}
                textAlign={rtl ? "right" : "left"}
                p={hasInvalidReport ? 1 : { xs: 1, sm: 1, md: 4 }}
                px={{ xxl: 30, xl: 20, lg: 12, md: 8, xs: 1, sm: 3 }}
                sx={{ ...styles.rtlStyle(rtl) }}
                display="flex"
                flexDirection="column"
                gap={2}
              >
                {isAuthenticatedUser && (
                  <QueryData
                    {...fetchPathInfo}
                    render={(pathInfo: PathInfo) => (
                      <AssessmentReportTitle
                        pathInfo={pathInfo}
                        rtlLanguage={rtl}
                        lng={lng}
                      >
                        {!isQuickMode && (
                          <Box sx={{ ...styles.centerVH }} gap={2}>
                            {(permissions.canViewDashboard ||
                              permissions.canViewQuestionnaires) && (
                              <LoadingButton
                                variant="outlined"
                                size="small"
                                startIcon={
                                  rtl ? (
                                    permissions.canViewDashboard ? (
                                      <Dashboard fontSize="small" />
                                    ) : (
                                      <ChecklistRoundedIcon fontSize="small" />
                                    )
                                  ) : permissions.canViewDashboard ? (
                                    <Dashboard fontSize="small" />
                                  ) : (
                                    <ChecklistRtlRoundedIcon fontSize="small" />
                                  )
                                }
                                onClick={navigate}
                                sx={{
                                  ...styles.rtlStyle(rtl),
                                  height: "100%",
                                }}
                              >
                                {permissions.canViewDashboard
                                  ? t("dashboard.dashboard", { lng })
                                  : t("common.questionnaires", { lng })}
                              </LoadingButton>
                            )}
                            <LoadingButton
                              variant="contained"
                              size="small"
                              onClick={onShare}
                              disabled={
                                !permissions.canShareReport &&
                                !permissions.canManageVisibility
                              }
                              sx={{
                                ...styles.rtlStyle(rtl),
                                minWidth: "30px",
                                py: 0.5,
                                px: 0,
                              }}
                            >
                              {" "}
                              <ShareIcon
                                fontSize="small"
                                sx={{ paddingY: 0.2 }}
                              />
                            </LoadingButton>
                          </Box>
                        )}
                      </AssessmentReportTitle>
                    )}
                  />
                )}

                <Box display="flex" flexDirection="column" gap={4}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={isQuickMode ? 9 : 12}>
                      <SectionCard>
                        <ReportHeader
                          rtl={rtl}
                          lng={lng}
                          infoItems={infoItems}
                        />
                        <ScoreSection
                          rtl={rtl}
                          lng={lng}
                          isQuickMode={isQuickMode}
                          assessment={assessment}
                          gotoItems={gotoItems}
                        />
                      </SectionCard>
                    </Grid>

                    <Grid item display={{ xs: "none", md: "block" }} md={3}>
                      <SidebarQuickMode {...sidebarProps} />
                    </Grid>
                  </Grid>

                  <SectionCard
                    id="howCalculated"
                    className="anchor-offset"
                    title={t("assessmentReport.howWasThisScoreCalculated", {
                      lng,
                    })}
                    desc={t("assessmentReport.howWasThisScoreCalculatedDesc", {
                      lng,
                    })}
                    rtl={rtl}
                  >
                    <Box
                      px={{ xs: 0.5, md: 2 }}
                      mt={4}
                      display="flex"
                      flexDirection="column"
                    >
                      <Box display="flex" flexDirection="column" gap={1} mb={1}>
                        <Typography
                          variant="titleLarge"
                          color="text.primary"
                          sx={{ ...styles.rtlStyle(rtl) }}
                        >
                          {t("assessmentReport.attributesStatus", { lng })}
                        </Typography>
                        {!isQuickMode && (
                          <Typography
                            component="div"
                            textAlign="justify"
                            variant="bodyMedium"
                            sx={{ ...styles.rtlStyle(rtl) }}
                            dangerouslySetInnerHTML={{
                              __html: assessment.prosAndCons,
                            }}
                            className="tiptap"
                          />
                        )}
                      </Box>
                      <TreeMapSection
                        isQuickMode={isQuickMode}
                        assessment={assessment}
                        subjects={subjects}
                        selectedId={selectedId}
                        setSelectedId={setSelectedId}
                        rtl={rtl}
                        lng={lng}
                        permissions={permissions}
                      />
                    </Box>
                  </SectionCard>

                  <SectionCard
                    id="howToImprove"
                    className="anchor-offset"
                    icon={
                      isQuickMode && (
                        <Box sx={{ color: "primary.main" }}>
                          <AIGenerated styles={{ width: "32px" }} />
                        </Box>
                      )
                    }
                    title={t(
                      "assessmentReport.howCanTheCurrentSituationBeImproved",
                      { lng },
                    )}
                    rtl={rtl}
                  >
                    <AdviceSection advice={advice} lng={lng} rtl={rtl} />
                  </SectionCard>

                  <ReportActionsRow
                    rtl={rtl}
                    lng={lng}
                    canShare={
                      permissions.canShareReport ||
                      permissions.canManageVisibility
                    }
                    isQuickMode={isQuickMode}
                    onShare={onShare}
                    onExpert={onExpert}
                    onQuestionnaires={navigate}
                    canViewQuestionnaire={permissions.canViewQuestionnaires}
                  />

                  {isAdvancedMode && <HowIsItMade report={report} lng={lng} />}
                </Box>

                <Box display={{ xs: "block", md: "none" }}>
                  <SidebarQuickMode {...sidebarProps} />
                </Box>

                <ShareDialog
                  {...shareDialog}
                  {...report}
                  lng={lng}
                  fetchGraphicalReport={fetchGraphicalReport}
                  setStep={setStep}
                  step={step}
                />
                <ContactUsDialog
                  {...expertDialog}
                  context={expertContext}
                  lng={lng}
                  sx={{ ...styles.rtlStyle(rtl) }}
                />
              </Box>
            </Box>
          );
        }}
      />
    </PermissionControl>
  );
}
