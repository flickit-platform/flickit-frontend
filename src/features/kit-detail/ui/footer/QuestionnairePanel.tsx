import { useParams } from "react-router-dom";
import { IIndexedItem, QuestionDetailss } from "../../model/types";
import QueryData from "@/components/common/QueryData";
import { useQuestionnaire } from "../../model/footer/useQuestionnaire";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Divider,
  Grid,
} from "@mui/material";
import { useAccordion } from "@/hooks/useAccordion";
import { ExpandMoreRounded } from "@mui/icons-material";
import { Text } from "@/components/common/Text";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useServiceContext } from "@/providers/service-provider";
import { useQuery } from "@/hooks/useQuery";
import { getSemanticColors } from "@/config/colors";
import { InfoHeader } from "../common/InfoHeader";
import { getTranslation } from "./SubjectPanel";
import TitleWithTranslation from "@/components/common/fields/TranslationText";
import { OptionPill } from "./AnswerRangesPanel";

const QuestionnairePanel = ({
  questionnaire,
  maturityLevelsCount,
}: {
  questionnaire: IIndexedItem;
  maturityLevelsCount: number;
}) => {
  const { service } = useServiceContext();
  const { assessmentKitId } = useParams();
  const { fetcQuestionnaireDetailslQuery, questionnaireDetails } =
    useQuestionnaire(assessmentKitId, questionnaire.id);
  const { t } = useTranslation();
  const { isExpanded, onChange, expandedId } = useAccordion<number | string>(
    null,
  );
  const fetchQuestionDetailsQuery = useQuery<QuestionDetailss>({
    service: (args, config) =>
      service.assessmentKit.details.getQuestion(args, config),
    runOnMount: false,
  });

  useEffect(() => {
    if (expandedId) {
      fetchQuestionDetailsQuery.query({
        assessmentKitId,
        questionId: expandedId,
      });
    }
  }, [expandedId]);
  return (
    <QueryData
      {...fetcQuestionnaireDetailslQuery}
      render={(questionnaire_element) => {
        const _questionnaire = questionnaireDetails ?? questionnaire_element;
        return (
          <Box display="flex" flexDirection="column" gap={6}>
            <InfoHeader
              title={questionnaire.title}
              translations={getTranslation(
                questionnaire?.translations,
                "title",
              )}
              sectionName={t("common.questionnaire")}
              firstTag={`${_questionnaire.questions.length} ${t("common.question")}`}
            />

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
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        width="100%"
                      >
                        <Text variant="bodyMedium">
                          {question.index}.{question.title}
                        </Text>
                        <Box display="flex" gap={1}>
                          {question.mayNotBeApplicable && (
                            <Chip
                              sx={{
                                ".MuiChip-label": {
                                  color: "primary.main",
                                },
                                bgcolor: "primary.bg",
                                border: "1px solid ",
                                borderColor: "primary.main",
                              }}
                              label={
                                <Text variant="semiBoldSmall">
                                  {t("questions.notApplicable")}
                                </Text>
                              }
                            />
                          )}
                          {!question.advisable && (
                            <Chip
                              sx={{
                                ".MuiChip-label": {
                                  color: "secondary.main",
                                },
                                bgcolor: "secondary.bg",
                                border: "1px solid ",
                                borderColor: "secondary.main",
                              }}
                              label={
                                <Text variant="semiBoldSmall">
                                  {t("questions.notAdvisable")}
                                </Text>
                              }
                            />
                          )}
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{ display: "flex", flexDirection: "column", p: 2 }}
                    >
                      <QueryData
                        {...fetchQuestionDetailsQuery}
                        render={(ques: QuestionDetailss) => {
                          return (
                            <Grid container>
                              {getTranslation(ques?.translations, "title") && (
                                <Grid item md={12}>
                                  <Text variant="semiBoldLarge">
                                    {getTranslation(
                                      ques?.translations,
                                      "title",
                                    )}
                                  </Text>
                                </Grid>
                              )}

                              {ques?.hint && (
                                <Grid item md={12} mb={2}>
                                  <Text variant="titleSmall">
                                    {t("common.hint")}
                                  </Text>
                                  <TitleWithTranslation
                                    title={ques.hint}
                                    translation={getTranslation(
                                      ques.translations,
                                      "hint",
                                    )}
                                    titleSx={{
                                      color: "background.secondaryDark",
                                    }}
                                    translationSx={{
                                      color: "background.secondaryDark",
                                    }}
                                  ></TitleWithTranslation>
                                </Grid>
                              )}

                              <Grid item md={6}>
                                {ques?.measure?.title && (
                                  <>
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
                                        {ques.measure.title}
                                      </Text>
                                    </Box>
                                  </>
                                )}
                              </Grid>
                              <Grid item md={6}>
                                {ques?.answerRange && (
                                  <>
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
                                      <Text variant="bodyMedium">
                                        {ques?.answerRange?.title}
                                      </Text>
                                    </Box>
                                  </>
                                )}
                              </Grid>
                              {ques.options?.length && (
                                <Box  mt={2}>
                                  <Text variant="titleSmall">
                                    {t("common.options")}
                                  </Text>
                                  <Box
                                    sx={{ display: "flex", flexWrap: "wrap" }}
                                  >
                                    {ques.options?.map((opt: any) => (
                                      <OptionPill
                                        key={opt.index}
                                        option={opt}
                                      />
                                    ))}
                                  </Box>
                                </Box>
                              )}
                              <Box my={2}>
                                <Text variant="titleSmall" sx={{ mb: 1 }}>
                                  {t("kitDetail.affectedAttributes")}
                                </Text>
                                <Box display="flex" flexWrap="wrap" rowGap={1}>
                                  {ques?.attributeImpacts?.map((impact) => {
                                    return (
                                      <Box display="flex">
                                        <Box
                                          display="flex"
                                          flexDirection="column"
                                          alignItems="center"
                                          gap="10px"
                                        >
                                          <Box px="18px" py="8px 0px">
                                            <Text
                                              textAlign="center"
                                              variant="semiBoldLarge"
                                              color="primary"
                                            >
                                              {" "}
                                              {impact.title}
                                            </Text>
                                          </Box>
                                          {impact.affectedLevels.map(
                                            (level) => {
                                              return (
                                                <Chip
                                                  sx={{
                                                    width: "fit-content",
                                                    ".MuiChip-label": {
                                                      px: "12px",
                                                      py: "4px",
                                                      color:
                                                        "background.contrastText",
                                                    },
                                                    background:
                                                      getSemanticColors(
                                                        maturityLevelsCount,
                                                        "bg",
                                                      )[
                                                        level.maturityLevel
                                                          .index - 1
                                                      ],
                                                    border: "1px solid",
                                                    borderColor:
                                                      getSemanticColors(
                                                        maturityLevelsCount,
                                                        "text",
                                                      )[
                                                        level.maturityLevel
                                                          .index - 1
                                                      ],
                                                  }}
                                                  label={
                                                    <Box display="flex">
                                                      <Text variant="semiBoldMedium">
                                                        {
                                                          level.maturityLevel
                                                            .title
                                                        }
                                                      </Text>
                                                      <Divider
                                                        flexItem
                                                        orientation="vertical"
                                                        sx={{
                                                          mx: 1,
                                                          borderColor:
                                                            "text.primary",
                                                          height: 16,
                                                          display: "flex",
                                                          alignSelf: "center",
                                                        }}
                                                      />

                                                      <Text variant="semiBoldMedium">
                                                        {t("common.weight")}
                                                        {": "}
                                                        {level.weight}
                                                      </Text>
                                                    </Box>
                                                  }
                                                />
                                              );
                                            },
                                          )}
                                        </Box>
                                        <Divider
                                          flexItem
                                          orientation="vertical"
                                          sx={{
                                            mx: 1,
                                            height: 36,
                                            borderColor: "outline.variant",
                                          }}
                                        />
                                      </Box>
                                    );
                                  })}
                                </Box>
                              </Box>
                            </Grid>
                          );
                        }}
                      />
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
