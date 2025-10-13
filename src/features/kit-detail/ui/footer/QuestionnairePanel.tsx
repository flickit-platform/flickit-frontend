import { useParams } from "react-router-dom";
import { IIndexedItem } from "../../model/types";
import { useKitDetailContainer } from "../../model/useKitDetailContainer";
import QueryData from "@/components/common/QueryData";
import { useQuestionnaire } from "../../model/footer/useQuestionnaire";
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

const QuestionnairePanel = ({
  questionnaire,
}: {
  questionnaire: IIndexedItem;
}) => {
  const { assessmentKitId } = useParams();
  const { fetcQuestionnaireDetailslQuery, questionnaireDetails } =
    useQuestionnaire(assessmentKitId, questionnaire.id);
  const { t } = useTranslation();
  const { isExpanded, onChange } = useAccordion<number | string>(null);

  return (
    <QueryData
      {...fetcQuestionnaireDetailslQuery}
      render={(questionnaire) => {
        const _questionnaire = questionnaireDetails ?? questionnaire;
        return (
          <Box display="flex" flexDirection="column" gap={6}>
            <Text variant="semiBoldXLarge" color="primary">
              {t("kitDesigner.answerRanges")}
            </Text>

            <Box display="flex" flexDirection="column" gap={1}>
              {" "}
              {_questionnaire.questions.map((question) => {
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
                      <Text variant="bodyMedium">{question.title}</Text>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{ display: "flex", flexDirection: "column", p: 2 }}
                    >
                      <Text variant="titleSmall" sx={{ mb: 1 }}>
                        {t("common.options")}
                      </Text>
                      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                        {/* {question..map((opt: any) => (
                      <OptionPill key={opt.index} option={opt} />
                    ))} */}
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

export default QuestionnairePanel;
