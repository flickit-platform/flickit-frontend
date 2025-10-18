import { useParams } from "react-router-dom";
import { IIndexedItem } from "../../model/types";
import QueryData from "@/components/common/QueryData";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
} from "@mui/material";
import { useAccordion } from "@/hooks/useAccordion";
import { ExpandMoreRounded } from "@mui/icons-material";
import { Text } from "@/components/common/Text";
import { useTranslation } from "react-i18next";
import { useMeasures } from "../../model/footer/useMeasures";
import { OptionPill } from "./AnswerRangesPanel";
import { InfoHeader } from "../common/InfoHeader";
import { getTranslation } from "./SubjectPanel";
import TitleWithTranslation from "@/components/common/fields/TranslationText";

const MeasurePanel = ({ measure }: { measure: IIndexedItem }) => {
  const { assessmentKitId } = useParams();
  const { fetcMeasureDetailslQuery, measureDetails } = useMeasures(
    assessmentKitId,
    measure.id,
  );
  const { t } = useTranslation();
  const { isExpanded, onChange } = useAccordion<number | string>(null);

  return (
    <QueryData
      {...fetcMeasureDetailslQuery}
      render={(measure_element) => {
        const _measure = measureDetails ?? measure_element;
        return (
          <Box display="flex" flexDirection="column" gap={4}>
            <InfoHeader
              title={_measure.title}
              translations={getTranslation(measure?.translations, "title")}
              sectionName={t("common.measure")}
              firstTag={`${_measure.questions.length} ${t("common.question")}`}
            />
            <Box>
              <Text variant="semiBoldLarge" color={"background.secondaryDark"}>
                {t("common.description")}:
              </Text>
              <Box
                sx={{
                  px: 2,
                }}
              >
                <TitleWithTranslation
                  title={_measure.description}
                  translation={getTranslation(
                    _measure.translations,
                    "description",
                  )}
                  titleSx={{ color: "background.secondaryDark" }}
                  translationSx={{ color: "background.secondaryDark" }}
                />
              </Box>
            </Box>
            <Box display="flex" flexDirection="column" gap={1}>
              <Text variant="titleSmall" color={"background.secondaryDark"}>
                {t("common.questions")} ({_measure.questions.length}{" "}
                {t("kitDetail.questions")})
              </Text>{" "}
              {_measure.questions.map((question, index) => {
                return (
                  <Accordion
                    key={question.title}
                    expanded={isExpanded(question.title)}
                    onChange={onChange(question.title)}
                    sx={{
                      boxShadow: "none !important",
                      borderRadius: "16px !important",
                      border: `1px solid #C7CCD1`,
                      bgcolor: "initial",
                      "&:before": { content: "none" },
                      position: "relative",
                      transition: "background-position .4s ease",
                      "&.Mui-expanded": { margin: 0 },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={
                        <ExpandMoreRounded sx={{ color: "surface.on" }} />
                      }
                      sx={{
                        "&.Mui-expanded": { minHeight: "48px" },

                        "& .MuiAccordionSummary-content": {
                          alignItems: "center",
                          width: "100%",
                          gap: 2,
                        },
                        "& .MuiAccordionSummary-content.Mui-expanded": {
                          margin: "0px !important",
                        },
                        borderTopLeftRadius: "12px !important",
                        borderTopRightRadius: "12px !important",
                        backgroundColor: isExpanded(question.title)
                          ? "#66809914"
                          : "",
                        borderBottom: isExpanded(question.title)
                          ? `1px solid #C7CCD1`
                          : "",
                      }}
                    >
                      <Box>
                        <Text variant="bodyMedium">{index + 1}.</Text>{" "}
                        <Text variant="bodyMedium" textAlign="justify">
                          {" "}
                          {question.title}
                        </Text>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        p: 2,
                        gap: 2,
                      }}
                    >
                      <Grid container>
                        {question?.questionnaire.title && (
                          <Grid item md={6}>
                            <Text variant="titleSmall" sx={{ mb: 1 }}>
                              {t("common.questionnaire")}
                            </Text>
                            <Box
                              sx={{
                                padding: "4px 16px",
                                borderRadius: "4px",
                                border: "1px solid",
                                borderColor: "outline.variant",
                                bgcolor: "primary.bg",
                                width: "fit-content",
                                color: "primary.main",
                              }}
                            >
                              <Text variant="bodyMedium">
                                {question.questionnaire.title}
                              </Text>
                            </Box>
                          </Grid>
                        )}
                        {question?.answerRange && (
                          <Grid item md={6}>
                            <Text variant="titleSmall" sx={{ mb: 1 }}>
                              {t("common.answerRange")}
                            </Text>
                            <Box
                              sx={{
                                padding: "4px 16px",
                                borderRadius: "4px",
                                border: "1px solid",
                                borderColor: "outline.variant",
                                bgcolor: "primary.bg",
                                width: "fit-content",
                                color: "primary.main",
                              }}
                            >
                              {question?.answerRange?.title}
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                      {question?.options?.length && (
                        <>
                          <Text variant="titleSmall" sx={{ mb: 1 }}>
                            {t("common.options")}
                          </Text>
                          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                            {question.options?.map((opt: any) => (
                              <OptionPill key={opt.index} option={opt} />
                            ))}
                          </Box>
                        </>
                      )}
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Box>
          </Box>
        );
      }}
    />
  );
};

export default MeasurePanel;
