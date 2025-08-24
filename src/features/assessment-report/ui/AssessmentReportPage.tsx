"use client";
import { Box, Grid } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import ShareIcon from "@mui/icons-material/Share";
import PermissionControl from "@/components/common/PermissionControl";
import QueryData from "@/components/common/QueryData";
import GraphicalReportSkeleton from "@/components/common/loadings/GraphicalReportSkeleton";
import useDialog from "@/utils/useDialog";
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
  } = useAssessmentReportVM();

  const shareDialog = useDialog();

  return (
    <PermissionControl error={[fetchGraphicalReport.errorObject]}>
      <QueryData
        {...fetchGraphicalReport}
        renderLoading={() => (
          <GraphicalReportSkeleton lang={lng} isAuthenticatedUser={isAuthenticatedUser} />
        )}
        render={() => {
          const { assessment, advice, subjects, lang, permissions } = report!;

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
                      <AssessmentReportTitle pathInfo={pathInfo} rtlLanguage={rtl}>
                        {(!isQuickMode || !isAuthenticatedUser) && (
                          <LoadingButton
                            variant="contained"
                            startIcon={<ShareIcon fontSize="small" sx={{ ...styles.iconDirectionStyle(lng) }} />}
                            size="small"
                            onClick={() => shareDialog.openDialog({})}
                            disabled={!permissions.canShareReport && !permissions.canManageVisibility}
                            sx={{ ...styles.rtlStyle(rtl), height: "100%", width: 290 }}
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
                        <ReportHeader rtl={rtl} lng={lng} infoItems={infoItems} />
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
                        canShare={permissions.canShareReport || permissions.canManageVisibility}
                        onShare={() => shareDialog.openDialog({})}
                        ContactBox={<ContactExpertBox lng={lng} rtl={rtl} onOpen={() => shareDialog.openDialog({})} />}
                      />
                    </Grid>
                  </Grid>

                  <SectionCard
                    title={t("assessmentReport.howWasThisScoreCalculated", { lng })}
                    desc={t("assessmentReport.howWasThisScoreCalculatedDesc", { lng })}
                    rtl={rtl}
                  >
                    <TreeMapSection
                      assessment={assessment}
                      lang={lang}
                      subjects={subjects}
                      selectedId={selectedId}
                      setSelectedId={setSelectedId}
                      rtl={rtl}
                      lng={lng}
                    />
                  </SectionCard>

                  <SectionCard
                    title={t("assessmentReport.howCanTheCurrentSituationBeImproved", { lng })}
                    rtl={rtl}
                  >
                    <AdviceSection advice={advice} lang={lang} rtl={rtl} />
                  </SectionCard>
                </Box>

                <ShareDialog {...shareDialog} {...report!} lang={lang} />
              </Box>
            </>
          );
        }}
      />
    </PermissionControl>
  );
}
