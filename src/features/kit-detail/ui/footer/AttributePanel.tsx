import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { InfoHeader } from "../common/InfoHeader";
import { styles } from "@styles";
import { Text } from "@common/Text";
import TitleWithTranslation from "@common/fields/TranslationText";
import { useQuery } from "@/hooks/useQuery";
import { useServiceContext } from "@providers/service-provider";
import { useParams } from "react-router-dom";
import QueryData from "@common/QueryData";
import { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import uniqueId from "@utils/unique-id";
import languageDetector from "@utils/language-detector";
import { farsiFontFamily, primaryFontFamily } from "@config/theme";
import { useAccordion } from "@/hooks/useAccordion";
import { ExpandMoreRounded } from "@mui/icons-material";
import Chip from "@mui/material/Chip";
import { OptionPill } from "@/features/kit-detail/ui/footer/AnswerRangesPanel";

type TTranslations = Record<string, { title?: string; description?: string }>;
type TAttribute = { title: string; weight: number; id: number; index: number };
type TMaturityLevels = {
  questionCount: number;
  title: string;
  weight: number;
  id: number;
  index: number;
};

interface IattributeData {
  id: number;
  index: number;
  maturityLevels: TMaturityLevels[];
  description: string;
  questionCount: number;
  translations?: TTranslations;
  weight: number;
  title: string;
}

interface IsubjectProp {
  attributes: TAttribute[];
  id: number;
  index: number;
  translations: TTranslations;
  title: string;
}
type IattributeProp = Omit<IsubjectProp, "attributes">;

const AttributePanel = ({
  subject,
  attribute,
}: {
  subject: IsubjectProp;
  attribute: IattributeProp;
}) => {
  const { service } = useServiceContext();
  const { t } = useTranslation();
  const { assessmentKitId = "" } = useParams();

  const [TopNavValue, setTopNavValue] = useState<number | null>(null);
  const [selectedMaturityLevel, setSelectedMaturityLevel] = useState<any>();
  const { isExpanded, onChange } = useAccordion<number>(null);

  const fetchAttributeDetail = useQuery({
    service: (args, config) => {
      const finalArgs = args ?? { assessmentKitId, attributeId: attribute?.id };
      return service.assessmentKit.details.getAttribute(finalArgs, config);
    },
  });

  const fetchMaturityLevelQuestions = useQuery({
    service: (args, config) => {
      const finalArgs = args ?? {
        assessmentKitId,
        attributeId: attribute?.id,
        maturityLevelId: selectedMaturityLevel,
      };
      return service.assessmentKit.details.getMaturityLevelQuestions(
        finalArgs,
        config,
      );
    },
    runOnMount: false,
  });

  useEffect(() => {
    if (selectedMaturityLevel) {
      fetchMaturityLevelQuestions.query();
    }
  }, [selectedMaturityLevel]);

  const getTranslation = (
    obj?: TTranslations | null,
    type: keyof { title?: string; description?: string } = "title",
  ): string | null => {
    return obj && Object.keys(obj).length > 0
      ? (Object.values(obj)[0]?.[type] ?? null)
      : null;
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTopNavValue(newValue);
  };

  const maturityHandelClick = (id: number) => {
    setSelectedMaturityLevel(id);
  };

  return (
    <QueryData
      {...fetchAttributeDetail}
      render={(data: IattributeData) => {
        const {
          weight,
          description,
          translations,
          questionCount,
          maturityLevels,
        } = data;
        useEffect(() => {
          const index = maturityLevels.findIndex(
            (item) => item.questionCount != 0,
          );
          const findMaturityLevelItem =
            index !== -1 ? { index, id: maturityLevels[index].id } : null;

          if (findMaturityLevelItem) {
            setTopNavValue(findMaturityLevelItem.index);
            setSelectedMaturityLevel(findMaturityLevelItem.id);
          }
        }, []);

        return (
          <Box sx={{ ...styles.centerCV, gap: "32px" }}>
            <InfoHeader
              title={attribute?.title}
              translations={getTranslation(translations, "title")}
              sectionName={t("kitDetail.attribute")}
              firstTag={`${questionCount} ${t("kitDetail.questions")}`}
              secondTag={`${t("common.weight")}: ${weight}`}
            />

            <Box>
              <Text variant="bodyLarge" color={"background.secondaryDark"}>
                {t("common.description")}:
              </Text>
              <Box
                sx={{
                  px: 2,
                  pt: 1,
                }}
              >
                <TitleWithTranslation
                  title={description}
                  translation={getTranslation(translations, "description")}
                  titleSx={{ color: "background.secondaryDark" }}
                  translationSx={{ color: "background.secondaryDark" }}
                />
              </Box>
            </Box>
            <Box>
              <Text variant="bodyLarge" color={"background.secondaryDark"}>
                {t("kitDetail.includedAttribute")}:
              </Text>
              <Box>
                <Box
                  bgcolor="background.variant"
                  width="100%"
                  borderRadius="12px"
                  my={2}
                  paddingBlock={1}
                  sx={{ ...styles.centerVH }}
                >
                  <Tabs
                    value={TopNavValue}
                    onChange={(event, newValue) =>
                      handleChangeTab(event, newValue)
                    }
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                    sx={{
                      border: "none",
                      "& .MuiTabs-indicator": {
                        display: "none",
                      },
                      alignItems: "center",
                    }}
                  >
                    {maturityLevels.map((item: any) => {
                      const { title, id, index, questionCount } = item;
                      return (
                        <Tab
                          onClick={() => maturityHandelClick(id)}
                          key={uniqueId()}
                          sx={{
                            // ...theme.typography.semiBoldLarge,
                            mr: 1,
                            border: "none",
                            textTransform: "none",
                            color: "text.primary",
                            py: 1,
                            "&.Mui-selected": {
                              boxShadow: "0 1px 4px rgba(0,0,0,25%) !important",
                              borderRadius: "4px !important",
                              color: "primary.main",
                              bgcolor: "background.containerLowest",
                              "&:hover": {
                                bgcolor: "background.containerLowest",
                                border: "none",
                              },
                            },
                          }}
                          disabled={questionCount == 0}
                          label={
                            <Box
                              gap={1}
                              fontFamily={
                                languageDetector(title)
                                  ? farsiFontFamily
                                  : primaryFontFamily
                              }
                              sx={{ ...styles.centerVH }}
                            >
                              <Text variant={"bodyMedium"}>{`${index}.`}</Text>
                              <Text variant={"bodyMedium"}>
                                {`(${questionCount})`} {`${title}`}
                              </Text>
                            </Box>
                          }
                        />
                      );
                    })}
                  </Tabs>
                </Box>

                <QueryData
                  {...fetchMaturityLevelQuestions}
                  render={(maturityData) => {
                    const { questions, questionsCount } = maturityData;

                    return (
                      <Box>
                        {questions.map((question: any, index: number) => {
                          const {
                            title,
                            questionnaire,
                            weight,
                            mayNotBeApplicable,
                            advisable,
                            answerOptions,
                            measure,
                            answerRange,
                          } = question;
                          return (
                            <Accordion
                              key={uniqueId()}
                              expanded={isExpanded(index)}
                              onChange={onChange(index)}
                              sx={{
                                boxShadow: "none !important",
                                borderRadius: "16px !important",
                                border: `1px solid #C7CCD1`,
                                bgcolor: "initial",
                                "&:before": { content: "none" },
                                position: "relative",
                                transition: "background-position .4s ease",
                                mb: 1,
                              }}
                            >
                              <AccordionSummary
                                expandIcon={
                                  <ExpandMoreRounded
                                    sx={{ color: "surface.on" }}
                                  />
                                }
                                sx={{
                                  "& .MuiAccordionSummary-content": {
                                    alignItems: "center",
                                    width: "100%",
                                    gap: 2,
                                    // m: 0
                                  },
                                  "& .MuiAccordionSummary-content.Mui-expanded":
                                    {
                                      margin: "0px !important",
                                    },
                                  borderTopLeftRadius: "12px !important",
                                  borderTopRightRadius: "12px !important",
                                  backgroundColor: isExpanded(index)
                                    ? "#66809914"
                                    : "",
                                  borderBottom: isExpanded(index)
                                    ? `1px solid #C7CCD1`
                                    : "",
                                }}
                              >
                                <Grid
                                  container
                                  rowSpacing={{ xs: 1, md: 0 }}
                                  justifyContent={"center"}
                                  alignItems={"center"}
                                >
                                  <Grid
                                    item
                                    xs={12}
                                    justifyContent={"flex-start"}
                                    md={
                                      mayNotBeApplicable || !advisable ? 5 : 8
                                    }
                                  >
                                    <Text>
                                      {index + 1}. {title}
                                    </Text>
                                  </Grid>
                                  {(mayNotBeApplicable || !advisable) && (
                                    <Grid
                                      item
                                      xs={12}
                                      md={3}
                                      sx={{ ...styles.centerVH, gap: 1 }}
                                    >
                                      <Tags
                                        mayNotBeApplicable={mayNotBeApplicable}
                                        advisable={advisable}
                                      />
                                    </Grid>
                                  )}

                                  <Grid
                                    item
                                    sx={{
                                      textAlign: "center",
                                      borderInline: { md: "1px solid #C7CCD1" },
                                    }}
                                    xs={6}
                                    md={3}
                                  >
                                    <Text
                                      bgcolor={"secondary.bg"}
                                      sx={{
                                        textAlign: "center",
                                        borderRadius: 1,
                                        px: 1,
                                        py: 0.5,
                                      }}
                                    >
                                      {questionnaire}
                                    </Text>
                                  </Grid>
                                  <Grid
                                    item
                                    sx={{ ...styles.centerVH }}
                                    xs={6}
                                    md={1}
                                  >
                                    <Text sx={{ textAlign: "center" }}>
                                      {t("common.weight")}: {weight}
                                    </Text>
                                  </Grid>
                                </Grid>
                              </AccordionSummary>
                              <AccordionDetails
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  p: 2,
                                }}
                              >
                                <Grid container>
                                  <Grid item xs={answerRange ? 6 : 12}>
                                    <Text variant="titleSmall" sx={{ mb: 1 }}>
                                      {t("common.measure")}
                                    </Text>
                                  </Grid>
                                  <Grid item xs={6}>
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
                                        {measure?.title}
                                      </Text>
                                    </Box>
                                  </Grid>
                                  {answerRange && (
                                    <>
                                      <Grid item xs={6}>
                                        <Text
                                          variant="titleSmall"
                                          sx={{ mb: 1 }}
                                        >
                                          {t("kitDesigner.answerRanges")}
                                        </Text>
                                      </Grid>
                                      <Grid item xs={6}>
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
                                            {answerRange?.title}
                                          </Text>
                                        </Box>
                                      </Grid>
                                    </>
                                  )}
                                </Grid>
                                <Grid container mt={"10px"}>
                                  <Grid item xs={12}>
                                    {answerOptions?.length && (
                                      <>
                                        <Text
                                          sx={{ mb: "10px" }}
                                          variant="titleSmall"
                                        >
                                          {t("common.options")}
                                        </Text>
                                        <Box
                                          sx={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                          }}
                                        >
                                          {answerOptions?.map((opt: any) => (
                                            <OptionPill
                                              key={opt.index}
                                              option={opt}
                                            />
                                          ))}
                                        </Box>
                                      </>
                                    )}
                                  </Grid>
                                </Grid>
                              </AccordionDetails>
                            </Accordion>
                          );
                        })}
                      </Box>
                    );
                  }}
                />
              </Box>
            </Box>
          </Box>
        );
      }}
    />
  );
};

const Tags = ({ mayNotBeApplicable, advisable } : any) => {
  const { t } = useTranslation();

  const tagsMap = [
    {
      title: "notAdvisable",
      backgroundColor: "primary.bgVariant",
      color: "primary.main",
      visible: !advisable,
    },
    {
      title: "notApplicable",
      backgroundColor: "secondary.bgVariant",
      color: "secondary.main",
      visible: mayNotBeApplicable,
    },
  ];
  return (
    <>
      {tagsMap.map((tag) => {
        const { color, backgroundColor, title, visible } = tag;
        return visible && (
          <Chip
            sx={{
              color: color,
              border: `1px solid`,
              borderColor: color,
              backgroundColor: backgroundColor,
              height: "28px",
            }}
            label={<Text variant={"bodySmall"}>{t(`questions.${title}`)}</Text>}
          />
        );
      })}
    </>
  );
};

export default AttributePanel;
