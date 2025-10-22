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
  Stack,
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
import TitleWithTranslation from "@/components/common/fields/TranslationText";
import { OptionsSection } from "../common/OptionsSection";
import { sxAccordion } from "./AttributePanel";
import { InfoField } from "../common/InfoField";
import { getTranslation } from "@/utils/helpers";

const QuestionnairePanel = ({
  questionnaire,
  maturityLevelsCount,
}: {
  questionnaire: IIndexedItem;
  maturityLevelsCount: number;
}) => {
  const bgColors = getSemanticColors(maturityLevelsCount, "bg");
  const textColors = getSemanticColors(maturityLevelsCount, "text");

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
          <Box display="flex" flexDirection="column" gap={4}>
            <InfoHeader
              title={questionnaire.title}
              translations={getTranslation(
                questionnaire?.translations,
                "title",
              )}
              sectionName={t("common.questionnaire")}
              tags={[
                `${_questionnaire.questions.length} ${t("kitDetail.questions")}`,
              ]}
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
                  title={_questionnaire.description}
                  translation={getTranslation(
                    questionnaire.translations,
                    "description",
                  )}
                  titleSx={{ color: "background.secondaryDark" }}
                  translationSx={{ color: "background.secondaryDark" }}
                />
              </Box>
            </Box>
            <Box display="flex" flexDirection="column" gap={1}>
              <Text variant="titleSmall" color={"background.secondaryDark"}>
                {t("common.questions")} ({_questionnaire.questions.length}{" "}
                {t("kitDetail.questions")})
              </Text>
              {_questionnaire.questions.map((question) => {
                return (
                  <Accordion
                    key={question.id}
                    expanded={isExpanded(question.id)}
                    onChange={onChange(question.id)}
                    sx={sxAccordion}
                  >
                    <AccordionSummary
                      expandIcon={
                        <ExpandMoreRounded sx={{ color: "surface.on" }} />
                      }
                      sx={{
                        "&.Mui-expanded": { minHeight: "unset" },
                        "& .MuiAccordionSummary-content": {
                          alignItems: "center",
                          width: "100%",
                          gap: 2,
                        },
                        "& .MuiAccordionSummary-content.Mui-expanded": {
                          marginBlock: "12px !important",
                          marginInline: "0px !important",
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
                        alignItems="center"
                        justifyContent="space-between"
                        width="100%"
                      >
                        <Box>
                          <Text variant="bodyMedium">{question.index}.</Text>{" "}
                          <Text variant="bodyMedium" textAlign="justify">
                            {" "}
                            {question.title}
                          </Text>
                        </Box>
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
                                <>
                                  <Grid size={{md: 12}}>
                                    <Text variant="titleSmall" mb={0.5}>
                                      {t("kitDetail.questionTranslation")}
                                    </Text>
                                  </Grid>
                                  <Grid size={{md:12}}>
                                    <Text variant="bodyMedium" mb={1}>
                                      {getTranslation(
                                        ques?.translations,
                                        "title",
                                      )}
                                    </Text>
                                  </Grid>
                                </>
                              )}

                              {ques?.hint && (
                                <Grid size={{md: 12}} mb={2}>
                                  <Text variant="titleSmall" mb={0.5}>
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

                              <Grid size={{xs: 12, md: 6}}>
                                <InfoField
                                  label={t("common.measure")}
                                  value={ques.measure?.title}
                                />
                              </Grid>
                              <Grid size={{xs: 12, md: 6}}>
                                <InfoField
                                  label={t("common.answerRange")}
                                  value={ques.answerRange?.title}
                                />
                              </Grid>
                              {Boolean(ques.options?.length) && (
                                <Box mt={2}>
                                  <OptionsSection options={ques.options} />
                                </Box>
                              )}
                              <Box my={2}>
                                <Text variant="titleSmall" sx={{ mb: 2 }}>
                                  {t("kitDetail.affectedAttributes")}
                                </Text>
                                <Stack
                                  direction="row"
                                  flexWrap="wrap"
                                  rowGap={1}
                                  columnGap={2}
                                  divider={
                                    <Divider
                                      orientation="vertical"
                                      flexItem
                                      sx={{
                                        mx: 1.5,
                                        alignSelf: "stretch",
                                        borderColor: "outline.variant",
                                      }}
                                    />
                                  }
                                >
                                  {ques.attributeImpacts?.map((impact) => (
                                    <Stack
                                      key={impact.id ?? impact.title}
                                      alignItems="center"
                                      gap={1.25}
                                      sx={{ minWidth: 180 }}
                                    >
                                      <Box
                                        sx={{
                                          px: "18px",
                                          py: "8px",
                                          textAlign: "center",
                                        }}
                                      >
                                        <Text
                                          variant="semiBoldLarge"
                                          color="primary"
                                        >
                                          {impact.title}
                                        </Text>
                                      </Box>

                                      <Stack
                                        direction="column"
                                        alignItems="center"
                                        gap={1}
                                      >
                                        {impact.affectedLevels.map((level) => {
                                          const idx = Math.max(
                                            0,
                                            (level.maturityLevel.index ?? 1) -
                                              1,
                                          );
                                          return (
                                            <Chip
                                              key={level.maturityLevel.id}
                                              label={
                                                <Box
                                                  display="flex"
                                                  alignItems="center"
                                                >
                                                  <Text variant="semiBoldMedium">
                                                    {level.maturityLevel.title}
                                                  </Text>

                                                  <Divider
                                                    orientation="vertical"
                                                    flexItem
                                                    sx={{
                                                      mx: 1,
                                                      height: 16,
                                                      alignSelf: "center",
                                                      borderColor:
                                                        "text.primary",
                                                    }}
                                                  />

                                                  <Text variant="semiBoldMedium">
                                                    {t("common.weight")}:{" "}
                                                    {level.weight}
                                                  </Text>
                                                </Box>
                                              }
                                              sx={{
                                                width: "fit-content",
                                                border: "1px solid",
                                                background: bgColors[idx],
                                                borderColor: textColors[idx],
                                                ".MuiChip-label": {
                                                  px: "12px",
                                                  py: "4px",
                                                  color:
                                                    "background.contrastText",
                                                  display: "flex",
                                                  alignItems: "center",
                                                  gap: 1,
                                                },
                                              }}
                                            />
                                          );
                                        })}
                                      </Stack>
                                    </Stack>
                                  ))}
                                </Stack>
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
