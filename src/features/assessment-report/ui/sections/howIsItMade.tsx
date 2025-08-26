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
import uniqueId from "@utils/uniqueId";
import { getMaturityLevelColors, styles } from "@styles";
import { v3Tokens } from "@config/tokens";

interface Props {
  title: string;
  children: React.ReactNode;
}

function InnerAccordion({ title, children }: Props) {
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
          background: "#E8EBEE",
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
        <Typography variant="titleMedium" color="primary">
          {title}
        </Typography>
      </AccordionSummary>

      <AccordionDetails
        sx={{ backgroundColor: "#F3F5F6", px: { sm: "40px" }, py: 2 }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
}

export default function HowIsItMade({ lng, report }: any) {
  const { lang, subjects } = report;
  const { assessmentKit } = report?.assessment;
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
            color={v3Tokens.surface.on}
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
          <Typography variant="headlineSmall" color="primary">
            {t("assessmentReport.howIsThisReportMade", { lng })}
          </Typography>
        </AccordionSummary>

        <AccordionDetails sx={{ mt: 1.2, p: 0 }}>
          <InnerAccordion title={t("assessmentKit.assessmentKit", { lng })}>
            <Typography variant="bodyMedium" color={v3Tokens.surface.on}>
              {t("assessmentKit.assessmentKitDescription", {
                lng,
                title: assessmentKit.title,
                attributesCount: assessmentKit.attributesCount,
                subjectsLength: subjects.length,
                subjects: subjects
                  ?.map((elem: ISubject, index: number) =>
                    index === subjects?.length - 1 && subjects?.length !== 1
                      ? t("common.and", { lng: lang?.code.toLowerCase() }) +
                        elem?.title
                      : index === 0
                        ? elem?.title
                        : ", " + elem?.title,
                  )
                  ?.join(""),
                maturityLevelCount,
                questionnairesCount,
              })}
            </Typography>
          </InnerAccordion>

          <InnerAccordion title={t("common.maturityLevels", { lng })}>
            <Typography variant="bodyMedium" color={v3Tokens.surface.on} mb={2}>
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
                  color={v3Tokens.surface.on}
                  sx={{ ...styles.rtlStyle(rtlLanguage) }}
                >
                  {level.description}
                </Typography>
              </Box>
            ))}
          </InnerAccordion>

          <InnerAccordion
            title={t("assessmentReport.subjectsAndAttributes", { lng })}
          >
            <Typography variant="bodyMedium" color={v3Tokens.surface.on}>
              {t("assessmentReport.assessmentStructured", {
                lng,
                count: attributes.length,
              })}
            </Typography>
            {rowItem(attributes)}
          </InnerAccordion>

          <InnerAccordion title={t("common.questionnaires", { lng })}>
            <Typography variant="bodyMedium" color={v3Tokens.surface.on}>
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
