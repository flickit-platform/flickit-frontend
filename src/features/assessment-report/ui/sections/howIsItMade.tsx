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
import {useMemo} from "react";
import Accordion from "@mui/material/Accordion";

export default function HowIsItMade(props: any) {
  const { lng, report } = props;
  console.log(report, "test report");
  const { lang, subjects } = report;
  const { assessmentKit } = report?.assessment;
  const { maturityLevels, questionnaires } = assessmentKit;
  const rtlLanguage = lng === "fa";
  const isRTL = lang.code.toLowerCase() === "fa";
  const items = [
    "assessmentKit",
    "maturityLevels",
    "questionnaires",
    "Indicator",
  ];
  const textStyle = {
    fontSize: "14px",
    lineHeight: "1.8",
    color: "#424242",
  };

  const attribute = useMemo(()=>{
      subjects.flatMap(
          (subject: any) => subject.attributes,
      );
  },[])

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
              <Divider orientation="vertical" flexItem sx={{ mx: "8px" }} />
              <Typography
                width="80%"
                sx={{ ...textStyle, ...styles.rtlStyle(isRTL) }}
              >
                {item.description}
              </Typography>
              <Divider orientation="vertical" flexItem sx={{ mx: "8px" }} />
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
            "& .MuiAccordionSummary-expandIconWrapper": {
              marginRight: 0,
              marginLeft: 1,
            },
          }}
          expandIcon={<ExpandMoreIcon sx={{ color: "primary.main" }} />}
        >
          <Typography variant="headlineSmall" color="primary">
            {t("assessmentReport.howIsThisReportMade", { lng })}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ mt: 1.3, p: 0 }}>
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
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                {t("assessmentKit.assessmentKit", { lng })}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
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
                  maturityLevelCount: assessmentKit.maturityLevelCount,
                  questionnairesCount: assessmentKit.questionnairesCount,
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
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{t("common.maturityLevels", { lng })}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {maturityLevels.map((level: any) => (
                <Box key={uniqueId()} sx={{ ...styles.centerV }} gap={2}>
                  <Box
                    bgcolor={
                      getMaturityLevelColors(assessmentKit.maturityLevelCount)[
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
                      getMaturityLevelColors(assessmentKit.maturityLevelCount)[
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

          {/* شاخص‌ها */}
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
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{t("common.Indicators")}</Typography>
            </AccordionSummary>
            <AccordionDetails>{rowItem(attribute)}</AccordionDetails>
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
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{t("common.questionnaires", {lng})}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                  {rowItem(questionnaires)}
              </Typography>
            </AccordionDetails>
          </Accordion>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
