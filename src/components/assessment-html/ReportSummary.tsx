import { Box, Typography, Divider } from "@mui/material";
import { farsiFontFamily, primaryFontFamily, theme } from "@/config/theme";
import { getMaturityLevelColors, styles } from "@/config/styles";
import { IGraphicalReport, ISubject } from "@/types";
import { t } from "i18next";
import languageDetector from "@/utils/languageDetector";

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
      {t("how_was_this_report_built", {
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
      variant="extraLight"
      fontWeight={300}
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
    {graphicalReport?.subjects?.map((subject: any, index: any) => (
      <Box key={index} sx={{ marginBottom: "16px" }}>
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
        {subject.attributes.map((attribute: any, idx: any) => (
          <Box
            key={idx}
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Typography
              variant="extraLight"
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
      (item: any, index: any) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            marginBottom: "8px",
            mt: 3,
          }}
        >
          <Typography
            variant="extraLight"
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
              width: "80px",
              ...styles.rtlStyle(
                graphicalReport?.lang.code.toLowerCase() === "fa",
              ),
            }}
          >
            {item.questionCount}{" "}
            {t("question", { lng: graphicalReport?.lang.code.toLowerCase() })}
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
  const { assessment, advice, permissions, subjects, assessmentProcess, lang } =
    graphicalReport;
  const rtlLanguage = lang.code.toLowerCase() === "fa";
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
      }}
    >
      <TitleBox language={lang.code.toLowerCase()} />

      <Section
        title={t("disclaimer", { lng: lang.code.toLowerCase() })}
        rtlLanguage={rtlLanguage}
      >
        <Typography
          variant="extraLight"
          sx={{
            fontFamily:
              lang.code.toLowerCase() === "fa"
                ? farsiFontFamily
                : primaryFontFamily,
            textAlign: "justify",
          }}
        >
          {t("disclaimerDescription", { lng: lang.code.toLowerCase() })}
        </Typography>
      </Section>

      <Section
        title={t("evaluationSteps", { lng: lang.code.toLowerCase() })}
        rtlLanguage={rtlLanguage}
      >
        {assessmentProcess.steps ? (
          <Typography
            variant="extraLight"
            fontWeight={300}
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
                t("unavailable", { lng: lang.code.toLowerCase() }),
            }}
            className={"tiptap"}
          />
        ) : (
          <>{t("unavailable", { lng: lang.code.toLowerCase() })}</>
        )}
      </Section>
      <Section
        title={t("participant", { lng: lang.code.toLowerCase() })}
        rtlLanguage={rtlLanguage}
      >
        {assessmentProcess.participant ? (
          <Typography
            variant="extraLight"
            fontWeight={300}
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
                t("unavailable", { lng: lang.code.toLowerCase() }),
            }}
            className={"tiptap"}
          />
        ) : (
          <>{t("unavailable", { lng: lang.code.toLowerCase() })}</>
        )}
      </Section>

      <Section
        title={t("assessmentKit", { lng: lang.code.toLowerCase() })}
        rtlLanguage={rtlLanguage}
      >
        {t("assessmentKitDescription", {
          lng: lang.code.toLowerCase(),
          title: assessment.assessmentKit.title,
          attributesCount: assessment.assessmentKit.attributesCount,
          subjectsLength: subjects.length,
          subjects: subjects
            ?.map((elem: ISubject, index: number) =>
              index === subjects?.length - 1 && subjects?.length !== 1
                ? t("and", { lng: lang.code.toLowerCase() }) + elem?.title
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
        title={t("maturityLevels", { lng: lang.code.toLowerCase() })}
        rtlLanguage={rtlLanguage}
      >
        {t("maturityLevelsDescription", {
          lng: lang.code.toLowerCase(),
          maturityLevelCount: assessment.assessmentKit.maturityLevelCount,
        })}
        {assessment.assessmentKit.maturityLevels.map(
          (level: any, index: number) => (
            <Box
              key={index}
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
                  ...theme.typography.extraLight,
                  fontWeight: 300,
                  direction: lang.code.toLowerCase() === "fa" ? "rtl" : "ltr",
                  fontFamily:
                    lang.code.toLowerCase() === "fa"
                      ? farsiFontFamily
                      : primaryFontFamily,
                }}
              >
                {level.description}
              </Typography>
            </Box>
          ),
        )}
      </Section>

      <Section
        title={t("topicsAndIndicators", { lng: lang.code.toLowerCase() })}
        rtlLanguage={rtlLanguage}
      >
        {t("topicsTable", {
          lng: lang.code.toLowerCase(),
        })}
        <TopicsList graphicalReport={graphicalReport} />
      </Section>

      <Section
        title={t("questionnaires", { lng: lang.code.toLowerCase() })}
        rtlLanguage={rtlLanguage}
      >
        <QuestionnaireList graphicalReport={graphicalReport} />
      </Section>
    </Box>
  );
};

export default ReportCard;
