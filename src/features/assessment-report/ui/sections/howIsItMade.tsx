import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { t } from "i18next";
import { ISubject } from "@/types";
import uniqueId from "@/utils/unique-id";
import { getMaturityLevelColors, styles } from "@styles";
import { v3Tokens } from "@config/tokens";

interface Props {
  readonly title: string;
  readonly lng: string;
  readonly children: React.ReactNode;
}

function InnerAccordion({ title, children, lng }: Props) {
  return (
    <Accordion
      disableGutters
      elevation={0}
      square
      sx={{
        mb: 2,
        "&.Mui-expanded": {
          mb: 4,
        },
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary
        sx={{
          bgcolor: "background.containerHigher",
          borderRadius: 1,
          flexDirection: "row-reverse",
          px: 0,
          "& .MuiAccordionSummary-expandIconWrapper": {
            paddingInlineStart: "8px",
            paddingInlineEnd: "8px",
          },
        }}
        expandIcon={<ExpandMoreIcon sx={{ color: "primary.main" }} />}
      >
        <Typography
          variant="titleMedium"
          color="primary"
          sx={{ ...styles.rtlStyle(lng === "fa") }}
        >
          {title}
        </Typography>
      </AccordionSummary>

      <AccordionDetails
        sx={{
          "&.MuiAccordionDetails-root": {
            bgcolor: "color(srgb 0.9276 0.9376 0.9461) !important",
          },
          px: { sm: "40px" },
          py: 2,
        }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
}

export default function HowIsItMade({ lng, report }: any) {
  const { lang, subjects, assessmentProcess } = report;
  const { assessmentKit } = report?.assessment ?? {};
  const {
    maturityLevels,
    questionnaires,
    questionnairesCount,
    questionsCount,
    maturityLevelCount,
  } = assessmentKit;
  const rtlLanguage = lng === "fa";
  const isRTL = lang.code.toLowerCase() === "fa";
  const attributes = subjects.flatMap((s: any) => s.attributes);

  const formatSubjects = (subjects: ISubject[], lng: string): string => {
    return subjects
      ?.map((elem, index) => {
        const isLast = index === subjects.length - 1;
        const isSingle = subjects.length === 1;

        if (isLast && !isSingle) {
          return t("common.and", { lng }) + elem.title;
        }
        if (index === 0) {
          return elem.title;
        }
        return ", " + elem.title;
      })
      ?.join("");
  };

  const rowItem = (data: any[]) => (
    <>
      {data?.map((item: any) => (
        <Box key={uniqueId()} mt={2} sx={{ ...styles.centerV }}>
          <Typography
            variant="bodyMedium"
            fontWeight="bold"
            width="20%"
            marginRight="8px"
            textAlign={isRTL ? "right" : "left"}
            sx={{ ...styles.rtlStyle(isRTL) }}
          >
            {item.title}
          </Typography>
          <Divider
            orientation="vertical"
            flexItem
            color={v3Tokens.outline.outline}
            sx={{ mx: "8px" }}
          />
          <Typography
            width="80%"
            variant="bodyMedium"
            color={"text.primary"}
            sx={{ ...styles.rtlStyle(isRTL) }}
          >
            {item.description}
          </Typography>
          <Divider
            orientation="vertical"
            flexItem
            color={v3Tokens.outline.outline}
            sx={{ mx: "8px" }}
          />
        </Box>
      ))}
    </>
  );

  return (
    <Box
      sx={{
        width: "100%",
        mx: "auto",
        direction: lng === "fa" ? "rtl" : "ltr",
        mb: 4,
      }}
    >
      <Accordion sx={{ background: "inherit", boxShadow: "none" }}>
        <AccordionSummary
          sx={{
            flexDirection: "row-reverse",
            borderBottom: "1px solid #2466A880",
            my: 0,
            minHeight: "unset",
            px: 0,
            pb: 1.8,
            "& .MuiAccordionSummary-expandIconWrapper": {
              paddingInlineStart: "16px",
              paddingInlineEnd: "10px",
            },
            "& .MuiAccordionSummary-content": {
              margin: "0px !important",
              minHeight: "unset",
            },
            "&.Mui-expanded": {
              margin: "0px !important",
              minHeight: "unset",
            },
          }}
          expandIcon={<ExpandMoreIcon sx={{ color: "primary.main" }} />}
        >
          <Typography
            variant="headlineSmall"
            color="primary"
            sx={{ ...styles.rtlStyle(lng === "fa") }}
          >
            {t("assessmentReport.howIsThisReportMade", { lng })}
          </Typography>
        </AccordionSummary>

        <AccordionDetails sx={{ mt: 1.2, p: 0 }}>
          <InnerAccordion
            title={t("assessmentReport.disclaimer", { lng })}
            lng={lng}
          >
            <Typography
              sx={{ ...styles.rtlStyle(lng === "fa") }}
              variant="bodyMedium"
              color={"text.primary"}
            >
              {t("assessmentReport.disclaimerDescription", { lng })}
            </Typography>
          </InnerAccordion>

          <InnerAccordion
            title={t("assessment.assessmentSteps", { lng })}
            lng={lng}
          >
            {assessmentProcess.steps ? (
              <Typography
                variant="bodyMedium"
                textAlign="justify"
                sx={{ ...styles.rtlStyle(lng === "fa") }}
                dangerouslySetInnerHTML={{
                  __html:
                    assessmentProcess.steps ?? t("common.unavailable", { lng }),
                }}
                className={"tiptap"}
              />
            ) : (
              <>{t("common.unavailable", { lng })}</>
            )}
          </InnerAccordion>

          <InnerAccordion
            title={t("assessmentReport.participants", { lng })}
            lng={lng}
          >
            {assessmentProcess.participant ? (
              <Typography
                variant="bodyMedium"
                textAlign="justify"
                sx={{ ...styles.rtlStyle(lng === "fa") }}
                dangerouslySetInnerHTML={{
                  __html:
                    assessmentProcess.participant ??
                    t("common.unavailable", { lng }),
                }}
                className={"tiptap"}
              />
            ) : (
              <>{t("common.unavailable", { lng })}</>
            )}
          </InnerAccordion>

          <InnerAccordion
            title={t("assessmentReport.aboutAssessmentKit", { lng })}
            lng={lng}
          >
            <Typography
              sx={{ ...styles.rtlStyle(lng === "fa") }}
              variant="bodyMedium"
              color={"text.primary"}
            >
              {t("assessmentReport.aboutAssessmentKitDesc", {
                lng,
                title: assessmentKit.title,
                attributesCount: assessmentKit.attributesCount,
                subjectsLength: subjects.length,
                subjects: formatSubjects(subjects, lang?.code.toLowerCase()),
                maturityLevelCount,
                questionnairesCount,
              })}
            </Typography>
          </InnerAccordion>

          <InnerAccordion title={t("common.maturityLevels", { lng })} lng={lng}>
            <Typography
              variant="bodyMedium"
              color={"text.primary"}
              mb={2}
              sx={{ ...styles.rtlStyle(lng === "fa") }}
            >
              {t("assessmentReport.assessmentKitEvaluatesMaturity", { lng })}
            </Typography>
            {maturityLevels.map((level: any) => (
              <Box key={uniqueId()} sx={{ ...styles.centerV }} gap={2}>
                <Box
                  bgcolor={
                    getMaturityLevelColors(maturityLevelCount)[level.value - 1]
                  }
                  height="10px"
                  width="27px"
                  borderRadius="16px"
                />
                <Typography
                  component="span"
                  color={
                    getMaturityLevelColors(maturityLevelCount)[level.value - 1]
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
                  color={"text.primary"}
                  sx={{ ...styles.rtlStyle(rtlLanguage) }}
                >
                  {level.description}
                </Typography>
              </Box>
            ))}
          </InnerAccordion>

          <InnerAccordion
            title={t("assessmentReport.subjectsAndAttributes", { lng })}
            lng={lng}
          >
            <Typography
              variant="bodyMedium"
              color={"text.primary"}
              sx={{ ...styles.rtlStyle(lng === "fa") }}
            >
              {t("assessmentReport.assessmentStructured", {
                lng,
                count: attributes.length,
              })}
            </Typography>
            {rowItem(attributes)}
          </InnerAccordion>

          <InnerAccordion title={t("common.questionnaires", { lng })} lng={lng}>
            <Typography
              variant="bodyMedium"
              color={"text.primary"}
              sx={{ ...styles.rtlStyle(lng === "fa") }}
            >
              {t("assessmentReport.measureMaturityLevel", {
                lng,
                QuestionCount: questionsCount,
                QuestionnairesCount: questionnairesCount,
              })}
            </Typography>
            {rowItem(questionnaires)}
          </InnerAccordion>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
