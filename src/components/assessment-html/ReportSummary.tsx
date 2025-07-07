import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { farsiFontFamily, primaryFontFamily, theme } from "@/config/theme";
import { getMaturityLevelColors, styles } from "@/config/styles";
import { IGraphicalReport, ISubject } from "@/types/index";
import { t } from "i18next";
import languageDetector from "@/utils/languageDetector";
import uniqueId from "@/utils/uniqueId";
import { useAssessmentContext } from "@/providers/AssessmentProvider";
import { useMemo } from "react";
import { ASSESSMENT_MODE } from "@/utils/enumType";

const sectionStyle = {
  marginTop: "16px",
  padding: "16px",
  textAlign: "justify",
};

const textStyle = {
  fontSize: "14px",
  lineHeight: "1.8",
  color: "#424242",
};

const sectionTitleStyle = {
  fontWeight: "bold",
  marginBottom: "12px",
};

const TitleBox = ({ language }: { language: string }) => (
  <Box
    sx={{
      position: "absolute",
      top: "-24px",
      left: "24px",
      backgroundColor: theme.palette.primary.main,
      color: "white",
      padding: "16px 24px",
      border: "1px solid #ddd",
      borderRadius: 5,
    }}
  >
    <Typography
      variant="h5"
      sx={{
        fontWeight: "bold",
        margin: 0,
        textAlign: language === "fa" ? "right" : "left",
        ...styles.rtlStyle(language === "fa"),
      }}
    >
      {t("assessmentReport.how_was_this_report_built", {
        lng: language,
      })}
    </Typography>
  </Box>
);

const Section = ({ title, children, rtlLanguage }: any) => (
  <Box sx={sectionStyle}>
    <Typography
      color="primary"
      variant="h6"
      sx={{ ...sectionTitleStyle, ...styles.rtlStyle(rtlLanguage) }}
    >
      {title}
    </Typography>
    <Typography
      sx={{
        ...textStyle,
        textAlign: "justify",
        ...styles.rtlStyle(rtlLanguage),
      }}
      variant="bodyMedium"
    >
      {children}
    </Typography>
  </Box>
);

const TopicsList = ({
  graphicalReport,
}: {
  graphicalReport: IGraphicalReport;
}) => (
  <Box>
    {graphicalReport?.subjects?.map((subject: any) => (
      <Box key={uniqueId()} sx={{ marginBottom: "16px" }}>
        <Typography
          sx={{
            fontWeight: "bold",
            color: "#2466A8",
            marginBottom: "8px",
            textAlign:
              graphicalReport?.lang.code.toLowerCase() === "fa"
                ? "right"
                : "left",
            ...styles.rtlStyle(
              graphicalReport?.lang.code.toLowerCase() === "fa",
            ),
          }}
        >
          {subject.title}
        </Typography>
        {subject.attributes.map((attribute: any) => (
          <Box
            key={uniqueId()}
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Typography
              variant="bodyMedium"
              sx={{
                fontWeight: "bold",
                width: "20%",
                marginRight: "8px",
                textAlign:
                  graphicalReport?.lang.code.toLowerCase() === "fa"
                    ? "right"
                    : "left",
                ...styles.rtlStyle(
                  graphicalReport?.lang.code.toLowerCase() === "fa",
                ),
              }}
            >
              {attribute.title}
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ mx: "8px" }} />
            <Typography
              sx={{
                ...textStyle,
                width: "80%",
                ...styles.rtlStyle(
                  graphicalReport?.lang.code.toLowerCase() === "fa",
                ),
              }}
            >
              {attribute.description}
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ mx: "8px" }} />
          </Box>
        ))}
      </Box>
    ))}
  </Box>
);

const QuestionnaireList = ({
  graphicalReport,
}: {
  graphicalReport: IGraphicalReport;
}) => (
  <Box>
    {graphicalReport?.assessment?.assessmentKit.questionnaires?.map(
      (item: any) => (
        <Box
          key={uniqueId()}
          sx={{
            display: "flex",
            alignItems: "center",
            marginBottom: "8px",
            mt: 3,
          }}
        >
          <Typography
            variant="bodyMedium"
            sx={{
              fontWeight: "bold",
              textAlign:
                graphicalReport?.lang.code.toLowerCase() === "fa"
                  ? "right"
                  : "left",
              ...styles.rtlStyle(
                graphicalReport?.lang.code.toLowerCase() === "fa",
              ),
              width: "200px",
            }}
          >
            {item.title}
          </Typography>
          <Divider orientation="vertical" flexItem sx={{ mx: "8px" }} />
          <Typography
            sx={{
              ...textStyle,
              width: "120px",
              ...styles.rtlStyle(
                graphicalReport?.lang.code.toLowerCase() === "fa",
              ),
            }}
          >
            {item.questionCount}{" "}
            {t("common.question", { lng: graphicalReport?.lang.code.toLowerCase() })}
          </Typography>
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              mx: "8px",
            }}
          />
          <Typography
            sx={{
              ...textStyle,
              width: "80%",
              ...styles.rtlStyle(
                graphicalReport?.lang.code.toLowerCase() === "fa",
              ),
            }}
          >
            {item.description}
          </Typography>
          <Divider orientation="vertical" flexItem sx={{ mx: "8px" }} />
        </Box>
      ),
    )}
  </Box>
);

const ReportCard = ({
  graphicalReport,
}: {
  graphicalReport: IGraphicalReport;
}) => {
  const { assessment, subjects, assessmentProcess, lang } = graphicalReport;
  const rtlLanguage = lang.code.toLowerCase() === "fa";
  const { assessmentInfo } = useAssessmentContext();

  const isAdvanceMode = useMemo(() => {
    return assessmentInfo?.mode?.code === ASSESSMENT_MODE.ADVANCED;
  }, [assessmentInfo?.mode?.code]);

  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: "#EAF3FC",
        borderRadius: "16px",
        width: "100%",
        marginTop: 8,
        border: "3px solid #2466A8",
        paddingX: { md: 2, xs: 1 },
        paddingY: 6,
        display: {
          md: "block",
          xs: "none",
        },
      }}
    >
      <TitleBox language={lang.code.toLowerCase()} />

      {isAdvanceMode && (
        <>
          <Section
            title={t("assessmentReport.disclaimer", { lng: lang.code.toLowerCase() })}
            rtlLanguage={rtlLanguage}
          >
            <Typography
              variant="bodyMedium"
              sx={{
                fontFamily:
                  lang.code.toLowerCase() === "fa"
                    ? farsiFontFamily
                    : primaryFontFamily,
                textAlign: "justify",
              }}
            >
              {t("assessmentReport.disclaimerDescription", { lng: lang.code.toLowerCase() })}
            </Typography>
          </Section>

          <Section
            title={t("assessment.assessmentSteps", { lng: lang.code.toLowerCase() })}
            rtlLanguage={rtlLanguage}
          >
            {assessmentProcess.steps ? (
              <Typography
                variant="bodyMedium"
                sx={{
                  fontFamily: languageDetector(assessmentProcess.steps)
                    ? farsiFontFamily
                    : primaryFontFamily,
                  ...textStyle,
                  textAlign: "justify",
                }}
                dangerouslySetInnerHTML={{
                  __html:
                    assessmentProcess.steps ??
                    t("common.unavailable", { lng: lang.code.toLowerCase() }),
                }}
                className={"tiptap"}
              />
            ) : (
              <>{t("common.unavailable", { lng: lang.code.toLowerCase() })}</>
            )}
          </Section>
          <Section
            title={t("assessmentKit.participant", { lng: lang.code.toLowerCase() })}
            rtlLanguage={rtlLanguage}
          >
            {assessmentProcess.participant ? (
              <Typography
                variant="bodyMedium"
                sx={{
                  fontFamily: languageDetector(assessmentProcess.participant)
                    ? farsiFontFamily
                    : primaryFontFamily,
                  ...textStyle,
                  textAlign: "justify",
                }}
                dangerouslySetInnerHTML={{
                  __html:
                    graphicalReport?.assessmentProcess.participant ??
                    t("common.unavailable", { lng: lang.code.toLowerCase() }),
                }}
                className={"tiptap"}
              />
            ) : (
              <>{t("common.unavailable", { lng: lang.code.toLowerCase() })}</>
            )}
          </Section>
        </>
      )}

      <Section
        title={t("assessmentKit.assessmentKit", { lng: lang.code.toLowerCase() })}
        rtlLanguage={rtlLanguage}
      >
        {t("assessmentKit.assessmentKitDescription", {
          lng: lang.code.toLowerCase(),
          title: assessment.assessmentKit.title,
          attributesCount: assessment.assessmentKit.attributesCount,
          subjectsLength: subjects.length,
          subjects: subjects
            ?.map((elem: ISubject, index: number) =>
              index === subjects?.length - 1 && subjects?.length !== 1
                ? t("common.and", { lng: lang.code.toLowerCase() }) + elem?.title
                : index === 0
                  ? elem?.title
                  : ", " + elem?.title,
            )
            ?.join(""),
          maturityLevelCount: assessment.assessmentKit.maturityLevelCount,
          questionnairesCount: assessment.assessmentKit.questionnairesCount,
        })}
      </Section>

      <Section
        title={t("common.maturityLevels", { lng: lang.code.toLowerCase() })}
        rtlLanguage={rtlLanguage}
      >
        {t("assessmentReport.maturityLevelsDescription", {
          lng: lang.code.toLowerCase(),
          maturityLevelCount: assessment.assessmentKit.maturityLevelCount,
        })}
        {assessment.assessmentKit.maturityLevels.map((level: any) => (
          <Box
            key={uniqueId()}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                backgroundColor: getMaturityLevelColors(
                  assessment.assessmentKit.maturityLevelCount,
                )[level.value - 1],
                height: "10px",
                width: "27px",
                borderRadius: "16px",
                color: "#fff",
                fontWeight: "bold",
              }}
            ></Box>

            <Typography
              component="span"
              sx={{
                ...theme.typography.body2,
                color: getMaturityLevelColors(
                  assessment.assessmentKit.maturityLevelCount,
                )[level.value - 1],
                minWidth: "70px",
                direction: lang.code.toLowerCase() === "fa" ? "rtl" : "ltr",
                fontFamily:
                  lang.code.toLowerCase() === "fa"
                    ? farsiFontFamily
                    : primaryFontFamily,
              }}
            >
              {level.title}
            </Typography>

            <Typography
              textAlign="justify"
              component="span"
              sx={{
                ...theme.typography.bodyMedium,
                ...styles.rtlStyle(lang.code.toLowerCase() === "fa"),
              }}
            >
              {level.description}
            </Typography>
          </Box>
        ))}
      </Section>

      <Section
        title={t("assessmentReport.topicsAndIndicators", { lng: lang.code.toLowerCase() })}
        rtlLanguage={rtlLanguage}
      >
        {t("assessmentReport.topicsTable", {
          lng: lang.code.toLowerCase(),
        })}
        <TopicsList graphicalReport={graphicalReport} />
      </Section>

      <Section
        title={t("common.questionnaires", { lng: lang.code.toLowerCase() })}
        rtlLanguage={rtlLanguage}
      >
        <QuestionnaireList graphicalReport={graphicalReport} />
      </Section>
    </Box>
  );
};

export default ReportCard;
