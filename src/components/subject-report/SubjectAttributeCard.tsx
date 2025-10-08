import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import { getMaturityLevelColors, styles } from "@styles";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Divider from "@mui/material/Divider";
import { farsiFontFamily, primaryFontFamily } from "@config/theme";
import { useEffect, useState } from "react";
import { useQuery } from "@/hooks/useQuery";
import { useParams } from "react-router-dom";
import { useServiceContext } from "@/providers/service-provider";
import languageDetector from "@/utils/language-detector";
import FlatGauge from "@/components/common/charts/flat-gauge/FlatGauge";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import DoneIcon from "@mui/icons-material/Done";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import MaturityLevelTable, {
  ItemServerFieldsColumnMapping,
} from "./MaturityLevelTable";
import TableSkeleton from "../common/loadings/TableSkeleton";
import uniqueId from "@/utils/unique-id";
import QueryBatchData from "../common/QueryBatchData";
import { useAssessmentContext } from "@/providers/assessment-provider";
import AttributeInsight from "./AttributeInsight";
import i18next, { t } from "i18next";
import ScoreImpactBarChart from "./ScoreImpactBarChart";
import DropDownContent from "./DropDownContent";
import { useTheme } from "@mui/material";
import Title from "@common/Title";
import { Text } from "../common/Text";

const SubjectAttributeCard = (props: any) => {
  const {
    description,
    title,
    maturityLevel,
    maturity_levels_count,
    maturityScoreModels,
    confidenceValue,
    id,
    progress,
    insight,
    reloadQuery,
  } = props;
  const { permissions } = useAssessmentContext();
  const { assessmentId = "" } = useParams();

  const [topTab, setTopTab] = useState(0);
  const [TopNavValue, setTopNavValue] = useState<number>(
    maturityScoreModels.findIndex((item: any) => item.score !== null) ?? 0,
  );
  const [selectedMaturityLevel, setSelectedMaturityLevel] = useState<any>(
    maturityScoreModels.find((item: any) => item.score !== null)?.maturityLevel
      .id ?? null,
  );

  const [expandedAttribute, setExpandedAttribute] = useState<string | false>(
    false,
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { service } = useServiceContext();
  const [sortBy, setSortBy] = useState<
    keyof ItemServerFieldsColumnMapping | null
  >(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined | null>(
    null,
  );

  const fetchAffectedQuestionsOnAttributeQueryData = useQuery({
    service: (args, config) =>
      service.assessments.attribute.getAffectedQuestions(
        args ?? {
          assessmentId,
          attributeId: expandedAttribute,
          levelId: selectedMaturityLevel,
          sort: sortBy,
          order: sortOrder,
          page,
          size: rowsPerPage,
        },
        config,
      ),
    runOnMount: false,
  });

  const fetchScoreState = useQuery({
    service: (args, config) =>
      service.assessments.attribute.getScoreState(
        args ?? {
          assessmentId,
          attributeId: expandedAttribute,
          levelId: selectedMaturityLevel,
        },
        config,
      ),
    runOnMount: false,
  });

  const fetchMeasures = useQuery({
    service: (args, config) =>
      service.assessments.attribute.getMeasures(
        args ?? {
          assessmentId,
          attributeId: expandedAttribute,
          sort: sortBy,
          order: sortOrder,
        },
        config,
      ),
    runOnMount: false,
  });

  useEffect(() => {
    if (expandedAttribute && selectedMaturityLevel) {
      fetchAffectedQuestionsOnAttributeQueryData.query();
      fetchScoreState.query();
    }
  }, [expandedAttribute, selectedMaturityLevel, page, rowsPerPage]);

  useEffect(() => {
    if (expandedAttribute) {
      fetchMeasures.query({
        assessmentId,
        attributeId: expandedAttribute,
        sort: sortBy,
        order: sortOrder,
      });
    }
  }, [expandedAttribute, sortBy, sortOrder]);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedAttribute(isExpanded ? panel : false);
    };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTopNavValue(newValue);
  };

  const updateSortOrder = (newSort: string, newOrder: string) => {
    setPage(0);
    fetchAffectedQuestionsOnAttributeQueryData.query({
      assessmentId,
      attributeId: expandedAttribute,
      levelId: selectedMaturityLevel,
      sort: newSort,
      order: newOrder,
      page,
      size: rowsPerPage,
    });
  };

  const maturityHandelClick = (id: number) => {
    setSelectedMaturityLevel(id);
  };

  const handleTopTabChange = (event: any, newValue: any) => {
    setTopTab(newValue);
    setSortBy(null);
    setSortOrder(null);
  };

  const colorPallet = getMaturityLevelColors(
    maturity_levels_count,
    "background",
  );
  const backgroundColor = colorPallet[maturityLevel.value - 1];

  const handleSortChange = (sortBy: any, sortOrder: any) => {
    setSortBy(sortBy);
    setSortOrder(sortOrder);
    fetchMeasures.query({
      assessmentId,
      attributeId: expandedAttribute,
      sort: sortBy,
      order: sortOrder,
    });
  };
  const theme = useTheme();

  return (
    <Box
      sx={{
        borderRadius: "16px !important",
        py: { xs: 3, sm: 4 },
        mb: 2,
        padding: "0px !important",
      }}
    >
      <Accordion
        sx={{
          boxShadow: "0 0 8px 0 #0A234240",
          borderRadius: "16px !important",
          "& .MuiAccordionSummary-content": {
            margin: "0px !important",
          },
          "& .MuiDivider-root": {
            display: "none",
          },
        }}
        expanded={
          permissions?.viewAttributeScoreDetail && expandedAttribute === id
        }
        onChange={handleChange(id)}
      >
        <AccordionSummary
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{
            borderRadius: "16px",
            boxShadow: "none",
            margin: "0 !important",
            padding: "0 !important",
            alignItems: "flex-start",
            "&.Mui-expanded": {
              bgcolor: "#EDF0F3",
              boxShadow: "none",
            },
            "&.Mui-focusVisible": {
              bgcolor: "background.containerLowest",
            },
            "& .MuiAccordionSummary-content .Mui-expanded": {
              margin: "0px !important",
              padding: "0px !important",
            },
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <Grid
            container
            sx={{
              width: "100%",
              direction: theme.direction,
              borderRadius: "16px",
              alignItems: "center",
            }}
          >
            <Grid item xs={12} sm={9} sx={{ p: 4 }}>
              <Title>
                <Text
                  variant="headlineSmall"
                  sx={{
                    textTransform: "none",
                  }}
                >
                  {title}
                </Text>
                <Text
                  variant="bodyMedium"
                  sx={{
                    textTransform: "none",
                  }}
                  marginX={2}
                >
                  {"("}
                  <Trans i18nKey="common.weight" />: {maturityLevel?.value}
                  {")"}
                </Text>
              </Title>
              <Text
                variant="bodyMedium"
                color="background.onVariant"
                sx={{
                  mt: 1,
                }}
              >
                {description}
              </Text>
            </Grid>
            <Grid item xs={12} sm={3} height={{ sm: "100%", xs: "unset" }}>
              {" "}
              <Box
                width="100%"
                height="100%"
                bgcolor={backgroundColor}
                mt={0}
                boxShadow="0 0 4px 0 #0A234240"
                sx={{
                  ...styles.centerVH,
                  py: 2,
                  borderEndEndRadius: "16px",
                  borderStartEndRadius: {
                    sm: "16px",
                    xs: 0,
                  },
                  borderEndStartRadius: {
                    sm: 0,
                    xs: "16px",
                  },
                }}
              >
                <FlatGauge
                  maturityLevelNumber={maturity_levels_count}
                  levelValue={maturityLevel.value}
                  text={maturityLevel.title}
                  confidenceLevelNum={Math.floor(confidenceValue)}
                  confidenceText={t("common.confidence") + ":"}
                  segment={{
                    width: 30,
                    height: 18,
                  }}
                  sx={{
                    ...styles.centerVH,
                    width: "100%",
                    height: "100%",
                    borderRadius:
                      expandedAttribute == id ? "0 8px 0 0" : "0 8px 8px 0",
                  }}
                />
                {permissions?.viewAttributeScoreDetail && (
                  <ExpandMoreIcon
                    sx={{
                      position: "absolute",
                      bottom: "16px",
                      right: theme.direction === "rtl" ? "unset" : "16px",
                      left: theme.direction === "rtl" ? "16px" : "unset",
                      transform:
                        expandedAttribute === id ? "scaleY(-1)" : "none",
                    }}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </AccordionSummary>
        <Divider sx={{ mx: 2 }} />
        <AccordionDetails
          sx={{
            padding: "0 !important",
            bgcolor: "background.containerLowest",
            borderRadius: "16px",
          }}
        >
          <Box p={{ xs: 2, sm: 5 }} sx={{ ...styles.centerCVH }} width="100%">
            <AttributeInsight
              progress={progress}
              attributeId={id}
              defaultInsight={insight}
              reloadQuery={reloadQuery}
            />
            <Box display={{ xs: "none", sm: "block" }} width="100%">
              <Tabs
                value={topTab}
                onChange={handleTopTabChange}
                sx={{
                  color: "rgba(0, 0, 0, 0.6)",

                  "& .Mui-selected": {
                    color: "primary.main !important",
                  },

                  "& .MuiTabs-indicator": {
                    backgroundColor: "primary.main",
                  },
                }}
              >
                <Tab label={t("subject.impactTable")} />
                <Tab
                  label={t("subject.measureChart")}
                  disabled={!fetchMeasures?.data?.measures?.length}
                />
              </Tabs>

              {topTab === 0 && (
                <Box>
                  <Box
                    bgcolor="background.variant"
                    width="100%"
                    borderRadius="16px"
                    my={2}
                    paddingBlock={0.5}
                    pt={1}
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
                      }}
                    >
                      {maturityScoreModels.map((item: any) => {
                        const { maturityLevel: maturityLevelOfScores, score } =
                          item;
                        return (
                          <Tab
                            onClick={() =>
                              maturityHandelClick(maturityLevelOfScores.id)
                            }
                            key={uniqueId()}
                            sx={{
                              ...theme.typography.semiBoldLarge,
                              mr: 1,
                              border: "none",
                              textTransform: "none",
                              color: "text.primary",
                              "&.Mui-selected": {
                                boxShadow:
                                  "0 1px 4px rgba(0,0,0,25%) !important",
                                borderRadius: "8px !important",
                                color: "primary.main",
                                bgcolor: "background.containerLowest",
                                "&:hover": {
                                  bgcolor: "background.containerLowest",
                                  border: "none",
                                },
                              },
                            }}
                            disabled={score === null}
                            label={
                              <Box
                                gap={1}
                                fontFamily={
                                  languageDetector(maturityLevelOfScores.title)
                                    ? farsiFontFamily
                                    : primaryFontFamily
                                }
                                sx={{ ...styles.centerVH }}
                              >
                                {maturityLevelOfScores?.value ==
                                  maturityLevel?.value && (
                                  <WorkspacePremiumIcon fontSize={"small"} />
                                )}
                                {maturityLevelOfScores?.value <
                                  maturityLevel?.value && (
                                  <DoneIcon fontSize={"small"} />
                                )}
                                {maturityLevelOfScores.title} (
                                {Math.ceil(score)}%)
                              </Box>
                            }
                          />
                        );
                      })}
                    </Tabs>
                  </Box>
                  <QueryBatchData
                    queryBatchData={[
                      fetchAffectedQuestionsOnAttributeQueryData,
                      fetchScoreState,
                    ]}
                    loadingComponent={<TableSkeleton />}
                    render={([
                      affectedQuestionsOnAttribute = {},
                      scoreState = {},
                    ]) => {
                      return (
                        <MaturityLevelTable
                          tempData={affectedQuestionsOnAttribute}
                          scoreState={scoreState}
                          updateSortOrder={updateSortOrder}
                          setPage={setPage}
                          page={page}
                          rowsPerPage={rowsPerPage}
                          setRowsPerPage={setRowsPerPage}
                          sortBy={sortBy}
                          setSortBy={setSortBy}
                          sortOrder={sortOrder}
                          setSortOrder={setSortOrder}
                        />
                      );
                    }}
                  />
                </Box>
              )}

              {topTab === 1 && (
                <Grid container>
                  <Grid item xs={12} sm={9.5}></Grid>
                  <Grid item xs={12} sm={2.5}>
                    <DropDownContent
                      onSortChange={handleSortChange}
                      sortBy={sortBy}
                      sortOrder={sortOrder}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <ScoreImpactBarChart
                      measures={fetchMeasures.data.measures}
                      language={i18next.language}
                    />{" "}
                  </Grid>
                </Grid>
              )}
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default SubjectAttributeCard;
