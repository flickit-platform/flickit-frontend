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
      render={(measure) => {
        const _measure = measureDetails ?? measure;
        return (
          <Box display="flex" flexDirection="column" gap={6}>
            <Text variant="semiBoldXLarge" color="primary">
              {t("kitDesigner.answerRanges")}
            </Text>

            <Box display="flex" flexDirection="column" gap={1}>
              {" "}
              {_measure.questions.map((question, index) => {
                return (
                  <Accordion
                    key={question.id}
                    expanded={isExpanded(question.id)}
                    onChange={onChange(question.id)}
                    sx={{
                      boxShadow: "none !important",
                      borderRadius: "16px !important",
                      border: `1px solid #C7CCD1`,
                      bgcolor: "initial",
                      "&:before": { content: "none" },
                      position: "relative",
                      transition: "background-position .4s ease",
                    }}
                  >
                    <AccordionSummary
                      expandIcon={
                        <ExpandMoreRounded sx={{ color: "surface.on" }} />
                      }
                      sx={{
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
                        backgroundColor: isExpanded(question.id)
                          ? "#66809914"
                          : "",
                        borderBottom: isExpanded(question.id)
                          ? `1px solid #C7CCD1`
                          : "",
                      }}
                    >
                      <Text variant="bodyMedium">
                        {index + 1}.{question.title}
                      </Text>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{ display: "flex", flexDirection: "column", p: 2 }}
                    >
                      <Grid container>
                        <Grid item md={6}>
                          <Text variant="titleSmall" sx={{ mb: 1 }}>
                            {t("common.questionnaire")}
                          </Text>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              marginInlineEnd: 3,
                              mb: 2,
                              py: 1,
                              px: 2,
                              borderRadius: 2,
                              border: "1px solid",
                              borderColor: "outline.variant",
                              bgcolor: "primary.bg",
                              width: "fit-content",
                              color: "primary.main",
                            }}
                          >
                            {question.questionnaire.title}
                          </Box>
                        </Grid>
                        <Grid item md={6}>
                          <Text variant="titleSmall" sx={{ mb: 1 }}>
                            {t("common.answerRange")}
                          </Text>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              marginInlineEnd: 3,
                              mb: 2,
                              py: 1,
                              px: 2,
                              borderRadius: 2,
                              border: "1px solid",
                              borderColor: "outline.variant",
                              bgcolor: "primary.bg",
                              width: "fit-content",
                              color: "primary.main",
                            }}
                          >
                            {question.answerRange.title}
                          </Box>
                        </Grid>
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
