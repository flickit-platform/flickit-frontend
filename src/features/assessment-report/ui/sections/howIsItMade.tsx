import * as React from "react";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { t } from "i18next";
import { ISubject } from "@/types";
import uniqueId from "@utils/uniqueId";
import { getMaturityLevelColors, styles } from "@styles";
import Divider from "@mui/material/Divider";
import Accordion from "@mui/material/Accordion";
import {v3Tokens} from "@config/tokens";

export default function HowIsItMade(props: any) {
  const { lng, report } = props;
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

  const attribute = subjects.flatMap((subject: any) => subject.attributes);

  const rowItem = (data: any) => {
    return (
      <>
        {data?.map((item: any) => {
          return (
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
              <Divider orientation="vertical" flexItem color={v3Tokens.outline.outline} sx={{ mx: "8px" }} />
              <Typography
                width="80%"
                variant={"bodyMedium"}
                color={v3Tokens.surface.on}
                sx={{ ...styles.rtlStyle(isRTL) }}
              >
                {item.description}
              </Typography>
              <Divider orientation="vertical" flexItem color={v3Tokens.outline.outline} sx={{ mx: "8px" }} />
            </Box>
          );
        })}
      </>
    );
  };

  return (
    <Box
      sx={{ width: "100%", mx: "auto", direction: lng == "fa" ? "rtl" : "ltr" }}
    >
      <Accordion
        sx={{
          background: "inherit",
          boxShadow: "none",
        }}
      >
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
        <AccordionDetails sx={{ mt: 1.2, p: 0, }}>
          <Accordion
            disableGutters
            elevation={0}
            square
            sx={{
              bgcolor: "grey.50",
              borderRadius: 2,
              mb: 1,
              "&:before": { display: "none" },
              boxShadow: "inset 0 0 0 1px rgba(0,0,0,.08)",
            }}
          >
            <AccordionSummary
              sx={{ background: "#E8EBEE", flexDirection: "row-reverse",
                  px: 0,
                  "& .MuiAccordionSummary-expandIconWrapper": {
                      paddingInlineStart: "8px",
                      paddingInlineEnd: "8px",
                  },
              }}
              expandIcon={<ExpandMoreIcon sx={{ color: "primary.main" }} />}
            >
              <Typography variant={"titleMedium"} color={"primary"}>
                {t("assessmentKit.assessmentKit", { lng })}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: "#F3F5F6 !important" , px: {sm:"40px"} }}>
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
                  maturityLevelCount: maturityLevelCount,
                  questionnairesCount: questionnairesCount,
                })}
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion
            disableGutters
            elevation={0}
            square
            sx={{
              bgcolor: "grey.50",
              borderRadius: 2,
              mb: 1,
              "&:before": { display: "none" },
              boxShadow: "inset 0 0 0 1px rgba(0,0,0,.08)",
            }}
          >
            <AccordionSummary
              sx={{ background: "#E8EBEE", flexDirection: "row-reverse",
                  px: 0,
                  "& .MuiAccordionSummary-expandIconWrapper": {
                      paddingInlineStart: "8px",
                      paddingInlineEnd: "8px",
                  },
              }}
              expandIcon={<ExpandMoreIcon sx={{ color: "primary.main" }} />}
            >
              <Typography variant={"titleMedium"} color={"primary"}>
                {t("common.maturityLevels", { lng })}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: "#F3F5F6 !important", px: {sm:"40px"}  }}>
                <Typography variant="bodyMedium" color={v3Tokens.surface.on}>
                    {t("assessmentReport.assessmentKitEvaluatesMaturity", { lng })}
                </Typography>
              {maturityLevels.map((level: any) => (
                <Box key={uniqueId()} sx={{ ...styles.centerV }} gap={2}>
                  <Box
                    bgcolor={
                      getMaturityLevelColors(maturityLevelCount)[
                        level.value - 1
                      ]
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
                      getMaturityLevelColors(maturityLevelCount)[
                        level.value - 1
                      ]
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
            </AccordionDetails>
          </Accordion>

          <Accordion
            disableGutters
            elevation={0}
            square
            sx={{
              bgcolor: "grey.50",
              borderRadius: 2,
              mb: 1,
              "&:before": { display: "none" },
              boxShadow: "inset 0 0 0 1px rgba(0,0,0,.08)",
            }}
          >
            <AccordionSummary
              sx={{ background: "#E8EBEE", flexDirection: "row-reverse",
                  px: 0,
                  "& .MuiAccordionSummary-expandIconWrapper": {
                      paddingInlineStart: "8px",
                      paddingInlineEnd: "8px",
                  }
              }}
              expandIcon={<ExpandMoreIcon sx={{ color: "primary.main" }} />}
            >
              <Typography variant={"titleMedium"} color={"primary"}>
                {t("assessmentReport.subjectsAndAttributes")}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: "#F3F5F6 !important", px: {sm:"40px"}  }}>
              <Typography variant="bodyMedium" color={v3Tokens.surface.on}>
                {t("assessmentReport.assessmentStructured", {
                  lng,
                  count: attribute.length,
                })}
              </Typography>
              {rowItem(attribute)}
            </AccordionDetails>
          </Accordion>
          <Accordion
            disableGutters
            elevation={0}
            square
            sx={{
              bgcolor: "grey.50",
              borderRadius: 2,
              mb: 1,
              "&:before": { display: "none" },
              boxShadow: "inset 0 0 0 1px rgba(0,0,0,.08)",
            }}
          >
            <AccordionSummary
              sx={{ background: "#E8EBEE", flexDirection: "row-reverse",
                  px: 0,
                  "& .MuiAccordionSummary-expandIconWrapper": {
                      paddingInlineStart: "8px",
                      paddingInlineEnd: "8px",
                  }
              }}
              expandIcon={<ExpandMoreIcon sx={{ color: "primary.main" }} />}
            >
              <Typography variant={"titleMedium"} color={"primary"}>
                {t("common.questionnaires", { lng })}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: "#F3F5F6 !important", px: {sm:"40px"}  }}>
              <Typography variant="bodyMedium" color={v3Tokens.surface.on}>
                {t("assessmentReport.measureMaturityLevel", {
                  lng,
                  QuestionCount: questionsCount,
                  QuestionnairesCount: questionnairesCount,
                })}
              </Typography>
              {rowItem(questionnaires)}
            </AccordionDetails>
          </Accordion>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
