import Grid from "@mui/material/Grid";
import Title from "@common/Title";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import { getMaturityLevelColors, styles } from "@styles";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Divider from "@mui/material/Divider";
import { farsiFontFamily, primaryFontFamily, theme } from "@config/theme";
import React, { useEffect, useState } from "react";
import { useQuery } from "@utils/useQuery";
import { useParams } from "react-router-dom";
import { useServiceContext } from "@providers/ServiceProvider";
import languageDetector from "@utils/languageDetector";
import { IPermissions } from "@/types";
import FlatGauge from "@/components/common/charts/flatGauge/FlatGauge";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import DoneIcon from "@mui/icons-material/Done";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import MaturityLevelTable, {
  ItemServerFieldsColumnMapping,
} from "./MaturityLevelTable";
import TableSkeleton from "../common/loadings/TableSkeleton";
import uniqueId from "@/utils/uniqueId";
import QueryBatchData from "../common/QueryBatchData";
import { useAssessmentContext } from "@/providers/AssessmentProvider";
import AttributeInsight from "./AttributeInsight";

const SUbjectAttributeCard = (props: any) => {
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
  } = props;
  const { permissions } = useAssessmentContext();

  const { assessmentId = "" } = useParams();
  const [TopNavValue, setTopNavValue] = React.useState<number>(0);
  const [selectedMaturityLevel, setSelectedMaturityLevel] = React.useState<any>(
    maturityScoreModels[0].maturityLevel.id,
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
    service: (
      args = {
        assessmentId,
        attributeId: expandedAttribute,
        levelId: selectedMaturityLevel,
        sort: sortBy,
        order: sortOrder,
        page,
        size: rowsPerPage,
      },
      config,
    ) => service.fetchAffectedQuestionsOnAttribute(args, config),
    runOnMount: false,
  });

  const fetchScoreState = useQuery({
    service: (
      args = {
        assessmentId,
        attributeId: expandedAttribute,
        levelId: selectedMaturityLevel,
      },
      config,
    ) => service.fetchScoreState(args, config),
    runOnMount: false,
  });

  useEffect(() => {
    if (expandedAttribute && selectedMaturityLevel) {
      fetchAffectedQuestionsOnAttributeQueryData.query();
      fetchScoreState.query();
    }
  }, [expandedAttribute, selectedMaturityLevel, page, rowsPerPage]);

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

  const colorPallet = getMaturityLevelColors(maturity_levels_count, true);
  const backgroundColor = colorPallet[maturityLevel.value - 1];

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
          permissions.viewAttributeScoreDetail && expandedAttribute === id
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
              backgroundColor: "#EDF0F3",
              boxShadow: "none",
            },
            "&.Mui-focusVisible": {
              background: "#fff",
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
            }}
          >
            <Grid item xs={12} sm={9} sx={{ p: 4 }}>
              <Title>
                <Typography
                  sx={{
                    ...theme.typography.headlineSmall,
                    textTransform: "none",
                    fontFamily: languageDetector(title)
                      ? farsiFontFamily
                      : primaryFontFamily,
                  }}
                >
                  {title}
                </Typography>
                <Typography
                  sx={{
                    ...theme.typography.bodyMedium,
                    textTransform: "none",
                  }}
                  marginX={2}
                >
                  {"("}
                  <Trans i18nKey="weight" />: {maturityLevel?.value}
                  {")"}
                </Typography>
              </Title>
              <Typography
                sx={{
                  ...theme.typography.bodyMedium,
                  color: "#6C8093",
                  mt: 1,
                  fontFamily: languageDetector(description)
                    ? farsiFontFamily
                    : primaryFontFamily,
                }}
              >
                {description}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: backgroundColor,
                  borderEndEndRadius: "16px",
                  borderStartEndRadius: {
                    sm: "16px",
                    xs: 0,
                  },
                  mt: {
                    sm: 0,
                    xs: 2,
                  },
                  borderEndStartRadius: {
                    sm: 0,
                    xs: "16px",
                  },
                  boxShadow: "0 0 4px 0 #0A234240",
                }}
              >
                <FlatGauge
                  maturityLevelNumber={maturity_levels_count}
                  levelValue={maturityLevel.value}
                  text={maturityLevel.title}
                  confidenceLevelNum={Math.floor(confidenceValue)}
                  textPosition="top"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    borderRadius:
                      expandedAttribute == id ? "0 8px 0 0" : "0 8px 8px 0",
                  }}
                />
                {permissions.viewAttributeScoreDetail && (
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
            backgroundColor: "#fff",
            borderRadius: "16px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              justifyItems: "center",
              flexDirection: "column",
              padding: 5,
            }}
          >
            {expandedAttribute && (
              <AttributeInsight
                progress={progress}
                attributeId={id}
                defaultInsight={insight}
              />
            )}

            <Box
              sx={{
                background: "#E2E5E9",
                width: "100%",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                my: 2,
                paddingBlock: 0.5,
                pt: 1,
              }}
            >
              <Tabs
                value={TopNavValue}
                onChange={(event, newValue) => handleChangeTab(event, newValue)}
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
                  const { maturityLevel: maturityLevelOfScores, score } = item;
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
                        color:
                          maturityLevelOfScores?.value > maturityLevel?.value
                            ? "#6C8093"
                            : "#2B333B",
                        "&.Mui-selected": {
                          boxShadow: "0 1px 4px rgba(0,0,0,25%) !important",
                          borderRadius: "8px !important",
                          color: theme.palette.primary.main,
                          background: "#fff",
                          "&:hover": {
                            background: "#fff",
                            border: "none",
                          },
                        },
                      }}
                      label={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            fontFamily: languageDetector(
                              maturityLevelOfScores.title,
                            )
                              ? farsiFontFamily
                              : primaryFontFamily,
                          }}
                        >
                          {maturityLevelOfScores?.value ==
                            maturityLevel?.value && (
                            <WorkspacePremiumIcon fontSize={"small"} />
                          )}
                          {maturityLevelOfScores?.value <
                            maturityLevel?.value && (
                            <DoneIcon fontSize={"small"} />
                          )}
                          {maturityLevelOfScores.title} ({Math.ceil(score)}%)
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
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export const AttributeStatusBarContainer = (props: any) => {
  const { status, ml, cl, mn, document } = props;
  const colorPallet = getMaturityLevelColors(mn);
  const statusColor = colorPallet[ml - 1];
  return (
    <Box
      display={"flex"}
      sx={{
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Box display={"flex"} flex={document ? 0.8 : 1}>
        <Box width="100%">
          {ml && <AttributeStatusBar ml={ml} isMl={true} mn={mn} />}
          {(cl == 0 || cl) && <AttributeStatusBar cl={cl} mn={mn} />}
        </Box>
      </Box>
      <Box
        sx={{ ...styles.centerV, pl: 2, pr: { xs: 0, sm: 2 } }}
        minWidth={"245px"}
        flex={document ? 0.2 : 0}
      >
        <Typography
          variant="headlineLarge"
          sx={{
            borderLeft:
              theme.direction == "ltr" ? `2px solid ${statusColor}` : "unset",
            borderRight:
              theme.direction == "rtl" ? `2px solid ${statusColor}` : "unset",
            pl: theme.direction == "ltr" ? 1 : "unset",
            pr: theme.direction == "rtl" ? 1 : "unset",
            ml: theme.direction == "ltr" ? { xs: -2, sm: 0 } : "unset",
            mr: theme.direction == "ltr" ? { xs: 0, sm: 1 } : "unset",
            color: statusColor,
          }}
        >
          <Trans i18nKey={`${status}`} />
        </Typography>
      </Box>
    </Box>
  );
};

export const AttributeStatusBar = (props: any) => {
  const { ml, cl, isMl, mn } = props;
  const width = isMl
    ? ml
      ? `${(ml / mn) * 100}%`
      : "0%"
    : cl
      ? `${cl}%`
      : "0%";
  return (
    <Box
      height={"38px"}
      width="100%"
      sx={{
        my: 0.5,
        background: "gray",
        borderTopRightRadius: theme.direction == "rtl" ? "unset" : "8px",
        borderTopLeftRadius: theme.direction == "ltr" ? "unset" : "8px",
        borderBottomRightRadius: theme.direction == "rtl" ? "unset" : "8px",
        borderBottomLeftRadius: theme.direction == "ltr" ? "unset" : "8px",
        position: "relative",
        color: "white",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        height="100%"
        width={width}
        sx={{
          background: isMl ? "#6035A1" : "#3596A1",
          borderTopRightRadius: theme.direction == "rtl" ? "unset" : "8px",
          borderTopLeftRadius: theme.direction == "ltr" ? "unset" : "8px",
          borderBottomRightRadius: theme.direction == "rtl" ? "unset" : "8px",
          borderBottomLeftRadius: theme.direction == "ltr" ? "unset" : "8px",
        }}
      ></Box>
      <Typography
        sx={{
          position: "absolute",
          zIndex: 1,
          left: theme.direction === "ltr" ? "12px" : "unset",
          right: theme.direction === "rtl" ? "12px" : "unset",
          opacity: 0.8,
        }}
        textTransform="uppercase"
        variant="h6"
      >
        <Trans i18nKey={isMl ? "maturityLevel" : "confidenceLevel"} />
      </Typography>
      <Typography
        sx={{
          position: "absolute",
          zIndex: 1,
          right: theme.direction == "rtl" ? "unset" : "12px",
          left: theme.direction == "ltr" ? "unset" : "12px",
        }}
        variant="h6"
      >
        {isMl ? `${ml} / ${mn}` : `${cl !== null ? cl : "--"}%`}
      </Typography>
    </Box>
  );
};

export const MaturityLevelDetailsBar = (props: any) => {
  const { score, is_passed, text } = props;
  const width = `${score ?? 100}%`;
  const bg_color = is_passed ? "#1769aa" : "#545252";
  const color = is_passed ? "#d1e6f8" : "#808080";
  return (
    <Box
      height={"38px"}
      width="100%"
      sx={{
        my: 0.5,
        background: color,
        borderTopRightRadius: theme.direction == "rtl" ? "unset" : "8px",
        borderBottomRightRadius: theme.direction == "rtl" ? "unset" : "8px",
        borderTopLeftRadius: theme.direction == "ltr" ? "unset" : "8px",
        borderBottomLeftRadius: theme.direction == "ltr" ? "unset" : "8px",
        position: "relative",
        color: "white",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        height="70%"
        width={width}
        sx={{
          background: `${score != null ? bg_color : ""}`,
          borderTopRightRadius: "8px",
          borderBottomRightRadius: "8px",
        }}
      ></Box>
      <Typography
        sx={{
          position: "absolute",
          zIndex: 1,
          left: theme.direction === "ltr" ? "12px" : "unset",
          right: theme.direction === "rtl" ? "12px" : "unset",
          opacity: 0.8,
          fontSize: { xs: "12px", sm: "16px" },
          color: theme.palette.getContrastText(color),
        }}
        textTransform="uppercase"
        variant="h6"
      >
        {text}
      </Typography>
      <Typography
        sx={{
          position: "absolute",
          zIndex: 1,
          right: theme.direction === "ltr" ? "12px" : "unset",
          left: theme.direction === "rtl" ? "12px" : "unset",
          color: theme.palette.getContrastText(color),
        }}
        variant="h6"
      >
        {score != null && Math.ceil(score)}
        {score != null ? "%" : ""}
      </Typography>
    </Box>
  );
};

export default SUbjectAttributeCard;
