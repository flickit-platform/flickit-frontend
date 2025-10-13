import { useParams } from "react-router-dom";
import { IIndexedItem } from "../../model/types";
import { useKitDetailContainer } from "../../model/useKitDetailContainer";
import QueryData from "@/components/common/QueryData";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
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
              {_measure.questions.map((question) => {
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
                        backgroundColor: isExpanded(question.title)
                          ? "#66809914"
                          : "",
                        borderBottom: isExpanded(question.title)
                          ? `1px solid #C7CCD1`
                          : "",
                      }}
                    >
                      <Text variant="bodyMedium">
                        {question.index}.{question.title}
                      </Text>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{ display: "flex", flexDirection: "column", p: 2 }}
                    >
                      <Text variant="titleSmall" sx={{ mb: 1 }}>
                        {t("common.options")}
                      </Text>
                      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                        {question.options?.map((opt: any) => (
                          <OptionPill key={opt.index} option={opt} />
                        ))}
                      </Box>
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
