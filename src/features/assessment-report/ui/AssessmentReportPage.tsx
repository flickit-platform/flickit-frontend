"use client";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import ShareIcon from "@mui/icons-material/ShareOutlined";
import PermissionControl from "@/components/common/PermissionControl";
import QueryData from "@/components/common/QueryData";
import GraphicalReportSkeleton from "@/components/common/loadings/GraphicalReportSkeleton";
import { styles } from "@styles";
import { t } from "i18next";
import type { PathInfo } from "@/types";

import { useAssessmentReportVM } from "../../assessment-report/model/useAssessmentReportVM";
import AssessmentReportTitle from "./AssessmentReportTitle";
import InvalidReportBanner from "./InvalidReportBanner";
import ContactExpertBox from "./ContactExpertBox";
import ShareDialog from "./ShareDialog";
import SectionCard from "./SectionCard";
import ReportHeader from "./sections/ReportHeader";
import ScoreSection from "./sections/ScoreSection";
import TreeMapSection from "./sections/TreeMapSection";
import AdviceSection from "./sections/AdviceSection";
import SidebarQuickMode from "./sections/SidebarQuickMode";
import ContactUsDialog from "@/components/common/dialogs/ContactUsDialog";
import ReportActionsRow from "./ReportActionsRow";
import HowIsItMade from "@/features/assessment-report/ui/sections/howIsItMade";
import { useMemo } from "react";
import { ASSESSMENT_MODE } from "@utils/enumType";
import AIGenerated from "@/components/common/icons/AIGenerated";

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
    handleGoToQuestionnaire,
    expertContext,
    expertDialog,
    shareDialog,
  } = useAssessmentReportVM();

  const isAdvanceMode = useMemo(() => {
    return ASSESSMENT_MODE.ADVANCED === report?.assessment?.mode?.code;
  }, [report?.assessment?.mode?.code]);
  const theme = useTheme();

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

          return (
            <>
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
                      >
                        {(!isQuickMode || !isAuthenticatedUser) && (
                          <LoadingButton
                            variant="contained"
                            startIcon={
                              <ShareIcon
                                fontSize="small"
                                sx={{ ...styles.iconDirectionStyle(lng) }}
                              />
                            }
                            size="small"
                            onClick={() => shareDialog.openDialog({})}
                            disabled={
                              !permissions.canShareReport &&
                              !permissions.canManageVisibility
                            }
                            sx={{
                              ...styles.rtlStyle(rtl),
                              height: "100%",
                              width: 290,
                            }}
                          >
                            {t("assessmentReport.shareReport", { lng })}
                          </LoadingButton>
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

                    <Grid item xs={12} md={3}>
                      <SidebarQuickMode
                        show={isAuthenticatedUser && isQuickMode}
                        lng={lng}
                        rtl={rtl}
                        canShare={
                          permissions.canShareReport ||
                          permissions.canManageVisibility
                        }
                        onShare={() => shareDialog.openDialog({})}
                        ContactBox={
                          <ContactExpertBox
                            lng={lng}
                            rtl={rtl}
                            onOpen={() => expertDialog.openDialog({})}
                          />
                        }
                      />
                    </Grid>
                  </Grid>

                  <SectionCard
                    title={t("assessmentReport.howWasThisScoreCalculated", {
                      lng,
                    })}
                    desc={t("assessmentReport.howWasThisScoreCalculatedDesc", {
                      lng,
                    })}
                    rtl={rtl}
                  >
                    <Box px={2} mt={4} display="flex" flexDirection="column">
                      <Box display="flex" flexDirection="column" gap={1} mb={1}>
                        <Typography
                          variant="titleLarge"
                          color="text.primary"
                          sx={{ ...styles.rtlStyle(rtl) }}
                        >
                          {t("assessmentReport.subjectsStatus", { lng })}
                        </Typography>
                        {!isQuickMode && (
                          <Typography
                            component="div"
                            textAlign="justify"
                            variant="bodyMedium"
                            sx={{ ...styles.rtlStyle(rtl) }}
                            dangerouslySetInnerHTML={{
                              __html: assessment.overallInsight,
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
                      />
                    </Box>
                  </SectionCard>

                  <SectionCard
                    icon={
                      isQuickMode && (
                        <AIGenerated
                          styles={{
                            color: theme.palette.primary.main,
                            width: "32px",
                          }}
                        />
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
                    onShare={() => shareDialog.openDialog({})}
                    onExpert={() => expertDialog.openDialog({})}
                    onQuestionnaires={handleGoToQuestionnaire}
                  />
                  {isAdvanceMode && <HowIsItMade report={report} lng={lng} />}
                </Box>

                <ShareDialog {...shareDialog} {...report} lng={lng} />
                <ContactUsDialog
                  {...expertDialog}
                  context={expertContext}
                  lng={lng}
                  sx={{ ...styles.rtlStyle(rtl) }}
                />
              </Box>
            </>
          );
        }}
      />
    </PermissionControl>
  );
}
