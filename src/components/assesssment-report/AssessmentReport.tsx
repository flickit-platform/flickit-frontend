import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import PermissionControl from "@/components/common/PermissionControl";
import { styles } from "@styles";
import { t } from "i18next";
import QueryData from "@/components/common/QueryData";
import GraphicalReportSkeleton from "@/components/common/loadings/GraphicalReportSkeleton";
import { useAuthContext } from "@/providers/AuthProvider";
import { setSurveyBox, useConfigContext } from "@providers/ConfgProvider";
import { Button, Typography, Box, Grid, useTheme } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Share from "@mui/icons-material/Share";
import useDialog from "@/utils/useDialog";
import ChipsRow from "@/components/common/fields/ChipsRow";
import { Gauge } from "@/components/common/charts/Gauge";
import { blue } from "@/config/colors";
import ContactUsDialog from "@/components/common/dialogs/ContactUsDialog";
import keycloakService from "@/service/keycloakService";
import uniqueId from "@/utils/uniqueId";
import { Trans } from "react-i18next";
import AdviceItemsAccordion from "@/components/dashboard/advice-tab/advice-items/AdviceItemsAccordions";
import { useReportChips } from "@/hooks/useReportChips";
import { useIntersectOnce } from "@/utils/helpers";
import { ASSESSMENT_MODE } from "@/utils/enumType";
import InvalidReportBanner from "./InvalidReportBanner";
import SectionCard from "./SectionCard"; // ← نسخه‌ای که title/desc/rtl را می‌گیرد
import { IGraphicalReport, PathInfo } from "@/types";
import { useGraphicalReport } from "@/hooks/useGraphicalReport";
import AssessmentReportTitle from "./AssessmentReportTitle";
import { ShareDialog } from "./ShareDialog";
import TreeMapChart from "../common/charts/TreeMapChart";

// --- باکس ستون راست را به یک جزء کوچک تبدیل کردیم
function ContactExpertBox({
  lng,
  rtl,
  onOpen,
}: {
  lng: string;
  rtl: boolean;
  onOpen: () => void;
}) {
  const theme = useTheme();
  return (
    <Box
      p={2}
      borderRadius={2}
      bgcolor={blue[95]}
      flexShrink={0}
      sx={{ ...styles.rtlStyle(rtl) }}
      width="100%"
    >
      <Typography
        variant="bodySmall"
        textAlign="justify"
        fontFamily="inherit"
        display="block"
      >
        <Trans
          i18nKey="assessmentReport.contactExpertBoxText.intro"
          components={{ strong: <strong /> }}
          t={(key: any, options?: any) => t(key, { lng, ...options })}
        />
      </Typography>

      <ul
        style={{
          listStyle: "none",
          paddingInline: 8,
          ...(useTheme().typography.bodySmall as any),
          fontFamily: "inherit",
          textAlign: "justify",
        }}
      >
        {(
          t("assessmentReport.contactExpertBoxText.points", {
            lng,
            returnObjects: true,
          }) as string[]
        ).map((item) => (
          <li key={uniqueId()}>• {item}</li>
        ))}
      </ul>

      <Typography
        variant="bodySmall"
        textAlign="justify"
        fontFamily="inherit"
        display="block"
      >
        {t("assessmentReport.contactExpertBoxText.outro", { lng })}
      </Typography>

      <Button
        size="medium"
        onClick={onOpen}
        variant="contained"
        sx={{
          mt: 2,
          width: "100%",
          background: `linear-gradient(45deg, #1B4D7E, #2D80D2, #1B4D7E)`,
          color: "background.containerLowest",
          boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)",
          "&:hover": {
            background: `linear-gradient(45deg, #1B4D7E, #2D80D2, #1B4D7E)`,
            opacity: 0.9,
          },
          fontFamily: "inherit",
        }}
      >
        {t("assessmentReport.contactExpertGroup", { lng })}
      </Button>
    </Box>
  );
}

export default function AssessmentReport() {
  const location = useLocation();
  const { isAuthenticatedUser } = useAuthContext();
  const { dispatch } = useConfigContext();
  const dialogProps = useDialog();

  const { fetchPathInfo, fetchGraphicalReport, reload, computeInvalid } =
    useGraphicalReport();

  useIntersectOnce("recommendations", () => dispatch(setSurveyBox(true)));

  const navState = (location.state || {}) as { language?: { code?: string } };
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
          const {
            assessment,
            advice,
            subjects,
            lang,
            isAdvisable,
            permissions,
          } = graphicalReport as IGraphicalReport;

          const lng = lang?.code?.toLowerCase();
          const rtl = lng === "fa";
          const isQuickMode = assessment?.mode?.code === ASSESSMENT_MODE.QUICK;

          const hasInvalidReport = useMemo(
            () => computeInvalid(subjects, advice, isAdvisable, isQuickMode),
            [subjects, advice, isAdvisable, isQuickMode, computeInvalid],
          );

          // chips
          const { infoItems, gotoItems } = useReportChips(
            graphicalReport,
            lng,
            rtl,
          );

          // dialog for expert request
          const requestAnExpertDialogProps = useDialog({
            context: {
              type: "requestAnExpertReview",
              data: {
                email:
                  keycloakService._kc.tokenParsed?.preferred_username ??
                  keycloakService._kc.tokenParsed?.sub,
                dialogTitle: t("assessmentReport.contactExpertGroup", { lng }),
                children: (
                  <Typography
                    textAlign="justify"
                    variant="bodyLarge"
                    fontFamily="inherit"
                    dangerouslySetInnerHTML={{
                      __html: t(
                        "assessmentReport.requestAnExpertReviewContent",
                        { lng },
                      ),
                    }}
                  />
                ),
              },
            },
          });

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
                              <Share
                                fontSize="small"
                                sx={{ ...styles.iconDirectionStyle(lng) }}
                              />
                            }
                            size="small"
                            onClick={() => dialogProps.openDialog({})}
                            disabled={
                              !permissions.canShareReport &&
                              !permissions.canManageVisibility
                            }
                            sx={{
                              ...styles.rtlStyle(rtl),
                              height: "100%",
                              width: "290px",
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
                        <Box
                          justifyContent="space-between"
                          width="100%"
                          sx={{ ...styles.centerV }}
                        >
                          <Typography
                            variant="headlineMedium"
                            color="primary"
                            sx={{ ...styles.rtlStyle(rtl) }}
                          >
                            {t("assessmentReport.assessmentResult", { lng })}
                          </Typography>
                          <ChipsRow items={infoItems} lng={lng} />
                        </Box>

                        <Grid
                          container
                          mt={2}
                          columnSpacing={isQuickMode ? 2 : 5}
                        >
                          <Grid item xs={12} md={8}>
                            {!isQuickMode && (
                              <>
                                <Typography
                                  component="div"
                                  variant="titleSmall"
                                  color="background.onVariant"
                                  sx={{ ...styles.rtlStyle(rtl) }}
                                >
                                  {t("assessmentReport.introduction", { lng })}
                                </Typography>
                                <Typography
                                  component="div"
                                  textAlign="justify"
                                  variant="bodyMedium"
                                  sx={{ mt: 1, ...styles.rtlStyle(rtl) }}
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      assessment.intro ??
                                      t("common.unavailable", { lng }),
                                  }}
                                  className="tiptap"
                                />
                                <Typography
                                  component="div"
                                  variant="titleSmall"
                                  color="background.onVariant"
                                  sx={{ mt: 2, ...styles.rtlStyle(rtl) }}
                                >
                                  {t("common.summary", { lng })}
                                </Typography>
                              </>
                            )}

                            <Typography
                              component="div"
                              textAlign="justify"
                              variant="bodyMedium"
                              sx={{ mt: 1, ...styles.rtlStyle(rtl) }}
                              dangerouslySetInnerHTML={{
                                __html:
                                  assessment.overallInsight ??
                                  t("common.unavailable", { lng }),
                              }}
                              className="tiptap"
                            />

                            <Box sx={{ ...styles.centerV }} gap={2}>
                              <Typography
                                component="div"
                                variant="titleSmall"
                                color="background.onVariant"
                                sx={{ ...styles.rtlStyle(rtl) }}
                              >
                                {t("common.goto", { lng })}
                              </Typography>
                              <ChipsRow items={gotoItems} lng={lng} />
                            </Box>
                          </Grid>

                          <Grid item xs={12} md={4} height="220px">
                            <Gauge
                              level_value={assessment.maturityLevel?.value ?? 0}
                              maturity_level_status={
                                assessment.maturityLevel?.title
                              }
                              maturity_level_number={
                                assessment.assessmentKit?.maturityLevelCount
                              }
                              confidence_value={assessment.confidenceValue}
                              confidence_text={
                                isQuickMode
                                  ? ""
                                  : t("common.withPercentConfidence", { lng })
                              }
                              isMobileScreen={false}
                              hideGuidance
                              status_font_variant="headlineLarge"
                              height={300}
                              confidence_text_variant="semiBoldSmall"
                            />
                          </Grid>
                        </Grid>
                      </SectionCard>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      {isAuthenticatedUser && isQuickMode && (
                        <Box sx={{ ...styles.centerCV }} gap={3} width="100%">
                          <LoadingButton
                            variant="contained"
                            startIcon={
                              <Share
                                fontSize="small"
                                sx={{ ...styles.iconDirectionStyle(lng) }}
                              />
                            }
                            size="small"
                            onClick={() => dialogProps.openDialog({})}
                            disabled={
                              !permissions.canShareReport &&
                              !permissions.canManageVisibility
                            }
                            sx={{ ...styles.rtlStyle(rtl) }}
                          >
                            {t("assessmentReport.shareReport", { lng })}
                          </LoadingButton>

                          <ContactExpertBox
                            lng={lng}
                            rtl={rtl}
                            onOpen={() =>
                              requestAnExpertDialogProps.openDialog({})
                            }
                          />
                        </Box>
                      )}

                      <ContactUsDialog
                        {...requestAnExpertDialogProps}
                        lng={lng}
                        sx={{ ...styles.rtlStyle(rtl) }}
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
                    <TreeMapChart
                      data={subjects.flatMap((subject: any) =>
                        subject.attributes.map((attribute: any) => ({
                          name: attribute.title,
                          description: attribute.description,
                          id: attribute.id,
                          count: attribute.weight,
                          label: attribute.maturityLevel.value.toString(),
                        })),
                      )}
                      levels={assessment.assessmentKit.maturityLevelCount}
                      lang={lang}
                    />
                  </SectionCard>

                  <SectionCard
                    title={t(
                      "assessmentReport.howCanTheCurrentSituationBeImproved",
                      { lng },
                    )}
                    rtl={rtl}
                  >
                    {advice?.narration || advice?.adviceItems?.length ? (
                      <>
                        <Typography
                          textAlign="justify"
                          variant="bodyMedium"
                          sx={{ ...styles.rtlStyle(rtl) }}
                          dangerouslySetInnerHTML={{
                            __html: advice?.narration,
                          }}
                        />
                        <AdviceItemsAccordion
                          items={graphicalReport?.advice?.adviceItems}
                          onDelete={() => {}}
                          setDisplayedItems={() => {}}
                          query={undefined}
                          readOnly
                          language={lang?.code?.toLowerCase()}
                        />
                      </>
                    ) : (
                      <Typography
                        textAlign="justify"
                        variant="titleSmall"
                        fontWeight="light"
                        mt={2}
                        sx={{ ...styles.rtlStyle(rtl) }}
                      >
                        {t("common.unavailable", { lng })}
                      </Typography>
                    )}
                  </SectionCard>
                </Box>

                <ShareDialog
                  {...dialogProps}
                  {...graphicalReport}
                  lang={lang}
                />
              </Box>
            </>
          );
        }}
      />
    </PermissionControl>
  );
}
