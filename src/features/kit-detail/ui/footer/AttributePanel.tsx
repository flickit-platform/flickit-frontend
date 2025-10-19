import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Tabs,
  Tab,
  Chip,
  Divider,
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
import React, { useEffect, useState, useCallback } from "react";
import { useAccordion } from "@/hooks/useAccordion";
import { ExpandMoreRounded } from "@mui/icons-material";
import { OptionsSection } from "../common/OptionsSection";

const Tags = React.memo(function Tags({ mayNotBeApplicable, advisable }: any) {
  const { t } = useTranslation();
  const tags = [
    {
      title: "notAdvisable",
      bg: "primary.bgVariant",
      color: "primary.main",
      visible: !advisable,
      key: "na",
    },
    {
      title: "notApplicable",
      bg: "secondary.bgVariant",
      color: "secondary.main",
      visible: !!mayNotBeApplicable,
      key: "napp",
    },
  ];
  return (
    <>
      {tags.map((tag) =>
        tag.visible ? (
          <Chip
            key={tag.key}
            sx={{
              color: tag.color,
              border: "1px solid",
              borderColor: tag.color,
              backgroundColor: tag.bg,
              height: 28,
            }}
            label={
              <Text variant="bodySmall">{t(`questions.${tag.title}`)}</Text>
            }
          />
        ) : null,
      )}
    </>
  );
});

const sxTabs = {
  border: "none",
  "& .MuiTabs-indicator": { display: "none" },
  alignItems: "center",
};
const sxTab = {
  mr: 1,
  border: "none",
  textTransform: "none",
  color: "text.primary",
  py: 1,
  "&.Mui-selected": {
    boxShadow: "0 1px 4px rgba(0,0,0,0.25) !important",
    borderRadius: "4px !important",
    color: "primary.main",
    bgcolor: "background.containerLowest",
    "&:hover": { bgcolor: "background.containerLowest", border: "none" },
  },
};
const sxAccordion = {
  boxShadow: "none !important",
  borderRadius: "16px !important",
  border: "1px solid #C7CCD1",
  bgcolor: "initial",
  "&:before": { content: "none" },
  position: "relative",
  transition: "background-position .4s ease",
  mb: 1,
  "&.Mui-expanded": { marginTop: 0 },
};
const sxSummary = (expanded: boolean) => ({
  px: 0,
  py: 0,
  minHeight: 0,
  "&.Mui-expanded": { minHeight: 0 },
  "& .MuiAccordionSummary-content": {
    alignItems: "center",
    width: "100%",
    gap: 0,
    margin: 0,
    padding: 0,
  },
  "& .MuiAccordionSummary-content.Mui-expanded": {
    margin: 0,
    padding: 0,
  },
  "& .MuiAccordionSummary-expandIconWrapper": {
    m: 0,
    p: 0,
  },
  borderTopLeftRadius: "12px !important",
  borderTopRightRadius: "12px !important",
  backgroundColor: expanded ? "#66809914" : "",
});

const sxDetails = { display: "flex", flexDirection: "column", p: 0 };

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

const getTranslation = (
  obj?: TTranslations | null,
  type: keyof { title?: string; description?: string } = "title",
): string | null =>
  obj && Object.keys(obj).length > 0
    ? (Object.values(obj)[0]?.[type] ?? null)
    : null;

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

  const [tabIndex, setTabIndex] = useState<number | null>(null);
  const [selectedMaturityLevelId, setSelectedMaturityLevelId] = useState<
    number | null
  >(null);

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
        maturityLevelId: selectedMaturityLevelId,
      };
      return service.assessmentKit.details.getMaturityLevelQuestions(
        finalArgs,
        config,
      );
    },
    runOnMount: false,
  });

  useEffect(() => {
    const data: IattributeData | undefined = fetchAttributeDetail?.data;
    if (!data) return;
    const idx = data.maturityLevels.findIndex((m) => m.questionCount !== 0);
    if (idx !== -1) {
      const firstML = data.maturityLevels[idx];
      setTabIndex(idx);
      setSelectedMaturityLevelId(firstML.id);
    } else {
      setTabIndex(0);
      setSelectedMaturityLevelId(data.maturityLevels[0]?.id ?? null);
    }
  }, [fetchAttributeDetail?.data]);

  useEffect(() => {
    if (selectedMaturityLevelId) {
      fetchMaturityLevelQuestions.query();
    }
  }, [selectedMaturityLevelId]);

  const handleTabChange = useCallback(
    (_: React.SyntheticEvent, newIdx: number) => {
      setTabIndex(newIdx);
      const ml = fetchAttributeDetail?.data?.maturityLevels?.[newIdx];
      if (ml && ml.questionCount !== 0) {
        setSelectedMaturityLevelId(ml.id);
      } else {
        setSelectedMaturityLevelId(null);
      }
    },
    [fetchAttributeDetail?.data?.maturityLevels],
  );

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

        return (
          <Box sx={{ ...styles.centerCV, gap: "32px" }}>
            <InfoHeader
              title={attribute?.title}
              translations={getTranslation(translations, "title")}
              sectionName={t("kitDetail.attribute")}
              tags={[
                `${questionCount} ${t("kitDetail.questions")}`,
                `${t("common.weight")}: ${weight}`,
              ]}
            />

            <Box>
              <Text variant="semiBoldLarge" color={"background.secondaryDark"}>
                {t("common.description")}:
              </Text>
              <Box sx={{ px: 2, pt: 1 }}>
                <TitleWithTranslation
                  title={description}
                  translation={getTranslation(translations, "description")}
                  titleSx={{ color: "background.secondaryDark" }}
                  translationSx={{ color: "background.secondaryDark" }}
                />
              </Box>
            </Box>

            {Boolean(questionCount) && (
              <Box>
                <Text variant="titleSmall" color={"background.secondaryDark"}>
                  {t("kitDetail.impactfulQuestions")}:
                </Text>

                <Box
                  bgcolor="primary.states.selected"
                  width="100%"
                  borderRadius="12px"
                  my={2}
                  paddingBlock={1}
                  sx={{ ...styles.centerVH }}
                >
                  <Tabs
                    value={tabIndex}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="attribute maturity tabs"
                    sx={sxTabs}
                  >
                    {maturityLevels.map((item) => {
                      const { title, id, index, questionCount } = item;
                      return (
                        <Tab
                          key={id}
                          sx={sxTab}
                          disabled={questionCount === 0}
                          label={
                            <Box gap={0.5} sx={{ ...styles.centerVH }}>
                              <Text variant="semiBoldMedium">{`${index}.`}</Text>
                              <Text variant="semiBoldMedium">{title}</Text>
                              <Text variant="semiBoldMedium">
                                ({questionCount})
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
                    const { questions = [] } = maturityData ?? {};

                    return (
                      <Box>
                        {questions.map((q: any, i: number) => {
                          const {
                            id,
                            title,
                            questionnaire,
                            weight,
                            mayNotBeApplicable,
                            advisable,
                            answerOptions,
                            measure,
                            answerRange,
                          } = q;

                          const expanded = isExpanded(i);

                          return (
                            <Accordion
                              key={id ?? i}
                              expanded={expanded}
                              onChange={onChange(i)}
                              sx={sxAccordion}
                            >
                              <AccordionSummary
                                expandIcon={
                                  <ExpandMoreRounded
                                    sx={{ color: "surface.on" }}
                                  />
                                }
                                sx={sxSummary(expanded)}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    width: "100%",
                                    px: 0,
                                    gap: 0,
                                    flexWrap: { xs: "wrap", md: "nowrap" },
                                  }}
                                >
                                  <Box
                                    width={{ xs: "100%", md: "70%" }}
                                    sx={{
                                      minWidth: 0,
                                      py: "12px",
                                      px: "16px",
                                    }}
                                  >
                                    <Grid
                                      container
                                      rowSpacing={{ xs: 0, md: 0 }}
                                      alignItems="center"
                                      sx={{ m: 0, width: "100%" }}
                                    >
                                      <Grid
                                        item
                                        xs={12}
                                        md={
                                          mayNotBeApplicable || !advisable
                                            ? 8
                                            : 12
                                        }
                                      >
                                        <Box display="flex" gap={0.5}>
                                          <Text variant="bodyMedium">
                                            {i + 1}.{" "}
                                          </Text>
                                          <Text
                                            variant="bodyMedium"
                                            textAlign="justify"
                                          >
                                            {title}
                                          </Text>
                                        </Box>
                                      </Grid>
                                      {(mayNotBeApplicable || !advisable) && (
                                        <Grid
                                          item
                                          xs={12}
                                          md={3}
                                          sx={{ ...styles.centerVH, gap: 1 }}
                                        >
                                          <Tags
                                            mayNotBeApplicable={
                                              mayNotBeApplicable
                                            }
                                            advisable={advisable}
                                          />
                                        </Grid>
                                      )}
                                    </Grid>
                                  </Box>

                                  <Divider
                                    orientation="vertical"
                                    flexItem
                                    sx={{
                                      display: { xs: "none", md: "block" },
                                      alignSelf: "stretch",
                                      borderColor: "#C7CCD1",
                                      m: 0,
                                    }}
                                  />

                                  <Box
                                    width={{ xs: "100%", md: "20%" }}
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      px: 1,
                                      py: 1,
                                      borderTop: {
                                        xs: "1px solid #C7CCD1",
                                        md: "none",
                                      },
                                    }}
                                  >
                                    <Text
                                      sx={{
                                        textAlign: "center",
                                        borderRadius: "8px",
                                        px: 1,
                                        py: 0.5,
                                        display: "inline-block",
                                        bgcolor: "secondary.bg",
                                      }}
                                      variant="bodyMedium"
                                    >
                                      {questionnaire}
                                    </Text>
                                  </Box>

                                  <Divider
                                    orientation="vertical"
                                    flexItem
                                    sx={{
                                      display: { xs: "none", md: "block" },
                                      alignSelf: "stretch",
                                      borderColor: "#C7CCD1",
                                      m: 0,
                                    }}
                                  />

                                  <Box
                                    width={{ xs: "100%", md: "10%" }}
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      py: 0,
                                      borderTop: {
                                        xs: "1px solid #C7CCD1",
                                        md: "none",
                                      },
                                    }}
                                  >
                                    <Text
                                      variant="bodyMedium"
                                      sx={{ textAlign: "center" }}
                                    >
                                      {t("common.weight")}: {weight}
                                    </Text>
                                  </Box>
                                </Box>
                              </AccordionSummary>

                              <AccordionDetails sx={sxDetails}>
                                <Grid container p={2} pt={2}>
                                  <Grid item xs={answerRange ? 6 : 12}>
                                    <Text variant="titleSmall" sx={{ mb: 1 }}>
                                      {t("common.measure")}
                                    </Text>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        px: 2,
                                        py: 0.5,
                                        borderRadius: 1,
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
                                    <Grid item xs={6}>
                                      <Text variant="titleSmall" sx={{ mb: 1 }}>
                                        {t("kitDesigner.answerRanges")}
                                      </Text>
                                      <Box
                                        sx={{
                                          px: 2,
                                          py: 0.5,
                                          borderRadius: 1,
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
                                  )}
                                </Grid>

                                <OptionsSection options={answerOptions} />
                              </AccordionDetails>
                            </Accordion>
                          );
                        })}
                      </Box>
                    );
                  }}
                />
              </Box>
            )}
          </Box>
        );
      }}
    />
  );
};

export default AttributePanel;
