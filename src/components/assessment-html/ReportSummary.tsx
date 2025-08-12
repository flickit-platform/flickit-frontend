import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import { getMaturityLevelColors, styles } from "@/config/styles";
import { IGraphicalReport, ISubject } from "@/types/index";
import { t } from "i18next";
import uniqueId from "@/utils/uniqueId";
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

const TitleBox = ({ language }: { language: string }) => {
  return (
    <Box
      position="absolute"
      top="-24px"
      left="24px"
      bgcolor="primary.main"
      color="primary.contrastText"
      padding="16px 24px"
      border="1px solid #ddd"
      borderRadius={5}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        margin={0}
        textAlign={language === "fa" ? "right" : "left"}
        sx={{ ...styles.rtlStyle(language === "fa") }}
      >
        {t("assessmentReport.how_was_this_report_built", { lng: language })}
      </Typography>
    </Box>
  );
};

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
      textAlign="justify"
      variant="bodyMedium"
      sx={{ ...textStyle, ...styles.rtlStyle(rtlLanguage) }}
    >
      {children}
    </Typography>
  </Box>
);

const TopicsList = ({
  graphicalReport,
}: {
  graphicalReport: IGraphicalReport;
}) => {
  const isRTL = graphicalReport?.lang.code.toLowerCase() === "fa";
  return (
    <Box>
      {graphicalReport?.subjects?.map((subject: any) => (
        <Box key={uniqueId()} marginBottom="16px">
          <Typography
            color="primary.main"
            fontWeight="bold"
            marginBottom="8px"
            textAlign={isRTL ? "right" : "left"}
            sx={{ ...styles.rtlStyle(isRTL) }}
          >
            {subject.title}
          </Typography>
          {subject.attributes.map((attribute: any) => (
            <Box key={uniqueId()} mt={2} sx={{ ...styles.centerV }}>
              <Typography
                variant="bodyMedium"
                fontWeight="bold"
                width="20%"
                marginRight="8px"
                textAlign={isRTL ? "right" : "left"}
                sx={{ ...styles.rtlStyle(isRTL) }}
              >
                {attribute.title}
              </Typography>
              <Divider orientation="vertical" flexItem sx={{ mx: "8px" }} />
              <Typography
                width="80%"
                sx={{ ...textStyle, ...styles.rtlStyle(isRTL) }}
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
};

const QuestionnaireList = ({
  graphicalReport,
}: {
  graphicalReport: IGraphicalReport;
}) => {
  const lng = graphicalReport?.lang.code.toLowerCase();
  const isRTL = lng === "fa";

  return (
    <Box>
      {graphicalReport?.assessment?.assessmentKit.questionnaires?.map(
        (item: any) => (
          <Box
            key={uniqueId()}
            marginBottom="8px"
            mt={3}
            sx={{ ...styles.centerV }}
          >
            <Typography
              variant="bodyMedium"
              fontWeight="bold"
              textAlign={isRTL ? "right" : "left"}
              width="200px"
              sx={{ ...styles.rtlStyle(isRTL) }}
            >
              {item.title}
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ mx: "8px" }} />
            <Typography
              width="120px"
              sx={{ ...textStyle, ...styles.rtlStyle(isRTL) }}
            >
              {item.questionCount} {t("common.question", { lng })}
            </Typography>
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                mx: "8px",
              }}
            />
            <Typography
              width="80%"
              sx={{ ...textStyle, ...styles.rtlStyle(isRTL) }}
            >
              {item.description}
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ mx: "8px" }} />
          </Box>
        ),
      )}
    </Box>
  );
};

const ReportCard = ({
  graphicalReport,
}: {
  graphicalReport: IGraphicalReport;
}) => {
  const { assessment, subjects, assessmentProcess, lang } = graphicalReport;
  const lng = lang.code.toLowerCase();
  const rtlLanguage = lng === "fa";

  const isAdvanceMode = useMemo(() => {
    return assessment?.mode?.code === ASSESSMENT_MODE.ADVANCED;
  }, [assessment.mode]);

  return (
    <Box
      position="relative"
      bgcolor="#EAF3FC"
      borderRadius="16px"
      width="100%"
      mt={8}
      border={(theme) => `3px solid ${theme.palette.primary.main}`}
      px={{ md: 2, xs: 1 }}
      py={6}
      display={{ md: "block", xs: "none" }}
    >
      <TitleBox language={lng} />
      {isAdvanceMode && (
        <>
          <Section
            title={t("assessmentReport.disclaimer", { lng })}
            rtlLanguage={rtlLanguage}
          >
            <Typography
              variant="bodyMedium"
              textAlign="justify"
              sx={{
                fontFamily: rtlLanguage ? farsiFontFamily : primaryFontFamily,
              }}
            >
              {t("assessmentReport.disclaimerDescription", { lng })}
            </Typography>
          </Section>

          <Section
            title={t("assessment.assessmentSteps", { lng })}
            rtlLanguage={rtlLanguage}
          >
            {assessmentProcess.steps ? (
              <Typography
                variant="bodyMedium"
                textAlign="justify"
                sx={{
                  fontFamily: rtlLanguage ? farsiFontFamily : primaryFontFamily,
                  ...textStyle,
                }}
                dangerouslySetInnerHTML={{
                  __html:
                    assessmentProcess.steps ?? t("common.unavailable", { lng }),
                }}
                className={"tiptap"}
              />
            ) : (
              <>{t("common.unavailable", { lng })}</>
            )}
          </Section>
          <Section
            title={t("assessmentKit.participant", { lng })}
            rtlLanguage={rtlLanguage}
          >
            {assessmentProcess.participant ? (
              <Typography
                variant="bodyMedium"
                textAlign="justify"
                sx={{
                  fontFamily: rtlLanguage ? farsiFontFamily : primaryFontFamily,
                  ...textStyle,
                }}
                dangerouslySetInnerHTML={{
                  __html:
                    graphicalReport?.assessmentProcess.participant ??
                    t("common.unavailable", { lng }),
                }}
                className={"tiptap"}
              />
            ) : (
              <>{t("common.unavailable", { lng })}</>
            )}
          </Section>
        </>
      )}

      <Section
        title={t("assessmentKit.assessmentKit", { lng })}
        rtlLanguage={rtlLanguage}
      >
        {t("assessmentKit.assessmentKitDescription", {
          lng,
          title: assessment.assessmentKit.title,
          attributesCount: assessment.assessmentKit.attributesCount,
          subjectsLength: subjects.length,
          subjects: subjects
            ?.map((elem: ISubject, index: number) =>
              index === subjects?.length - 1 && subjects?.length !== 1
                ? t("common.and", { lng: lang.code.toLowerCase() }) +
                  elem?.title
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
        title={t("common.maturityLevels", { lng })}
        rtlLanguage={rtlLanguage}
      >
        {t("assessmentReport.maturityLevelsDescription", {
          lng,
          maturityLevelCount: assessment.assessmentKit.maturityLevelCount,
        })}
        {assessment.assessmentKit.maturityLevels.map((level: any) => (
          <Box key={uniqueId()} sx={{ ...styles.centerV }} gap={2}>
            <Box
              bgcolor={
                getMaturityLevelColors(
                  assessment.assessmentKit.maturityLevelCount,
                )[level.value - 1]
              }
              height="10px"
              width="27px"
              borderRadius="16px"
              color="background.containerLowest"
              fontWeight="bold"
            />
            <Typography
              component="span"
              color={
                getMaturityLevelColors(
                  assessment.assessmentKit.maturityLevelCount,
                )[level.value - 1]
              }
              variant="body2"
              minWidth="70px"
              sx={{ ...styles.rtlStyle(rtlLanguage) }}
            >
              {level.title}
            </Typography>

            <Typography
              textAlign="justify"
              component="span"
              variant="bodyMedium"
              sx={{ ...styles.rtlStyle(rtlLanguage) }}
            >
              {level.description}
            </Typography>
          </Box>
        ))}
      </Section>

      <Section
        title={t("assessmentReport.topicsAndIndicators", { lng })}
        rtlLanguage={rtlLanguage}
      >
        {t("assessmentReport.topicsTable", { lng })}
        <TopicsList graphicalReport={graphicalReport} />
      </Section>

      <Section
        title={t("common.questionnaires", { lng })}
        rtlLanguage={rtlLanguage}
      >
        <QuestionnaireList graphicalReport={graphicalReport} />
      </Section>
    </Box>
  );
};

export default ReportCard;
