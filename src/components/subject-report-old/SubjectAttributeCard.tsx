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
import QueryData from "@common/QueryData";
import { useQuery } from "@utils/useQuery";
import { useParams } from "react-router-dom";
import { useServiceContext } from "@providers/ServiceProvider";
import Tooltip from "@mui/material/Tooltip";
import languageDetector from "@utils/languageDetector";
import toastError from "@/utils/toastError";
import { ICustomError } from "@/utils/CustomError";
import { toast } from "react-toastify";
import IconButton from "@mui/material/IconButton";
import EditRounded from "@mui/icons-material/EditRounded";
import { IPermissions } from "@/types";
import AIGenerated from "../common/tags/AIGenerated";
import RichEditorField from "@common/fields/RichEditorField";
import FormProviderWithForm from "@common/FormProviderWithForm";
import { useForm } from "react-hook-form";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import FlatGauge from "@/components/common/charts/flatGauge/FlatGauge";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import DoneIcon from "@mui/icons-material/Done";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Skeleton } from "@mui/material";
import MaturityLevelTable from "./MaturityLevelTable";
import TableSkeleton from "../common/loadings/TableSkeleton";
import { uniqueId } from "lodash";
import QueryBatchData from "../common/QueryBatchData";
import { LoadingButton } from "@mui/lab";
import { t } from "i18next";

const SUbjectAttributeCard = (props: any) => {
  const {
    description,
    title,
    maturityLevel,
    maturity_levels_count,
    maturityScores,
    confidenceValue,
    id,
    progress,
  } = props;

  const { permissions }: { permissions: IPermissions } = props;
  const { assessmentId = "" } = useParams();
  const [TopNavValue, setTopNavValue] = React.useState<number>(0);
  const [selectedMaturityLevel, setSelectedMaturityLevel] = React.useState<any>(
    maturityScores[0].maturityLevel.id,
  );

  const [expandedAttribute, setExpandedAttribute] = useState<string | false>(
    false,
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { service } = useServiceContext();

  const fetchAffectedQuestionsOnAttributeQueryData = useQuery({
    service: (
      args = {
        assessmentId,
        attributeId: expandedAttribute,
        levelId: selectedMaturityLevel,
        sort: "questionnaire",
        order: "asc",
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
  }, [expandedAttribute, selectedMaturityLevel, page]);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedAttribute(isExpanded ? panel : false);
    };
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTopNavValue(newValue);
  };

  const updateSortOrder = (newSort: string, newOrder: string) => {
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
        mb: 5,
        padding: "0px !important",
      }}
    >
      <Accordion
        sx={{
          boxShadow: "none !important",
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
            boxShadow: "inset 0 0 0 1px #C7CCD1",
            margin: "0 !important",
            padding: "0 !important",
            alignItems: "flex-start",
            "&.Mui-expanded": {
              backgroundColor: "#EDF0F3",
              boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
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
              boxShadow: "inset 0 0 0 1px #C7CCD1",
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
              </Title>
              <Typography
                sx={{
                  ...theme.typography.bodyMedium,
                  color: "#6C8093",
                  mb: 2,
                  fontFamily: languageDetector(description)
                    ? farsiFontFamily
                    : primaryFontFamily,
                }}
              >
                {description}
              </Typography>
              <AttributeInsight progress={progress} id={id} />
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
                  boxShadow: "inset 0 0 0 1px #C7CCD1",
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
            backgroundColor: "#F9FAFB",
            borderRadius: "16px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              justifyItems: "center",
              flexDirection: "column",
              padding: 2,
            }}
          >
            <Box
              sx={{
                background: "#E2E5E9",
                width: "100%",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 4px rgba(0,0,0,25%)",
                my: 2,
                paddingBlock: 2,
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
                {maturityScores.map((item: any) => {
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
                        paddingY: 1.5,
                        color:
                          maturityLevelOfScores?.value > maturityLevel?.value
                            ? "#6C8093"
                            : "#2B333B",
                        "&.Mui-selected": {
                          boxShadow: "0 1px 4px rgba(0,0,0,25%) !important",
                          borderRadius: 1,
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
        // ml: { xs: -1.5, sm: -3, md: -4 },
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

const AttributeInsight = (props: any) => {
  const { id, progress } = props;
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();

  const ApprovedAIAttribute = useQuery({
    service: (
      args = {
        assessmentId,
        attributeId: id,
      },
      config,
    ) => service.ApprovedAIAttribute(args, config),
    runOnMount: false,
  });
  const loadAttributeInsight = useQuery({
    service: (
      args = {
        assessmentId,
        attributeId: id,
      },
      config,
    ) => service.loadAttributeInsight(args, config),
    runOnMount: true,
  });

  const generateAIInsight = useQuery({
    service: (
      args = {
        assessmentId,
        attributeId: id,
      },
      config,
    ) => service.generateAIInsight(args, config),
    runOnMount: false,
  });

  const onCreateInsight = async (title: string) => {
    await service
      .createAttributeInsight(
        {
          assessmentId,
          attributeId: id,
          data: { assessorInsight: title },
        },
        {},
      )
      .then(() => {
        loadAttributeInsight.query();
      });
  };

  const onGenerateAIInsight = async () => {
    generateAIInsight
      .query()
      .then(() => {
        loadAttributeInsight.query();
      })
      .catch((e) => {
        const err = e as ICustomError;
        toastError(err);
      });
  };
  const approveAttribute = async (event: React.SyntheticEvent) => {
    try {
      event.stopPropagation();
      await ApprovedAIAttribute.query();
      await loadAttributeInsight.query();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };
  return (
    <QueryData
      {...loadAttributeInsight}
      renderLoading={() => (
        <Skeleton
          variant="rectangular"
          sx={{ borderRadius: 2, height: "60px", mb: 1 }}
        />
      )}
      errorComponent={<></>}
      render={(data) => {
        return (
          <>
            {(data.editable ||
              data?.assessorInsight?.insight ||
              data?.aiInsight?.insight) && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography color="#2466A8" variant="titleSmall">
                    <Trans i18nKey="insight" />
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    {data?.aiInsight &&
                    data?.aiInsight?.isValid &&
                    !data.approved ? (
                      <Tooltip title={<Trans i18nKey="invalidAIInsight" />}>
                        <div>
                          <AIGenerated />
                        </div>
                      </Tooltip>
                    ) : (
                      ((data?.assessorInsight &&
                        !data?.assessorInsight?.isValid) ||
                        (data?.aiInsight && !data?.aiInsight?.isValid)) && (
                        <Tooltip title={<Trans i18nKey="invalidInsight" />}>
                          <div>
                            <AIGenerated
                              title="outdated"
                              type="warning"
                              icon={<></>}
                            />
                          </div>
                        </Tooltip>
                      )
                    )}
                    {(data?.assessorInsight &&
                      !data?.assessorInsight?.isValid) ||
                    (data?.aiInsight && !data?.aiInsight?.isValid) ||
                    ((data?.aiInsight || data?.assessorInsight) &&
                      !data.approved) ? (
                      <Box sx={{ ...styles.centerVH, gap: 2 }}>
                        {data?.editable && (
                          <LoadingButton
                            onClick={(event) => approveAttribute(event)}
                            variant="contained"
                            loading={ApprovedAIAttribute.loading}
                            size="small"
                          >
                            <Trans i18nKey="approve" />
                          </LoadingButton>
                        )}
                      </Box>
                    ) : (
                      <></>
                    )}{" "}
                    {data?.editable && (
                      <Box sx={{ ...styles.centerVH, gap: 2 }}>
                        <Tooltip
                          title={
                            <Trans i18nKey="questionsArentCompleteSoAICantBeGenerated" />
                          }
                          disableHoverListener={progress === 100}
                        >
                          <div>
                            <LoadingButton
                              onClick={(event) => {
                                event.stopPropagation();
                                onGenerateAIInsight();
                              }}
                              variant={"contained"}
                              loading={generateAIInsight.loading}
                              size="small"
                              disabled={progress !== 100}
                            >
                              <Trans
                                i18nKey={
                                  data?.aiInsight ? "regenerate" : "generate"
                                }
                              />
                            </LoadingButton>
                          </div>
                        </Tooltip>
                      </Box>
                    )}
                  </Box>
                </Box>

                <Box
                  display="flex"
                  alignItems="center"
                  onClick={(event) => event.stopPropagation()}
                  mt={1}
                >
                  <OnHoverInput
                    attributeId={id}
                    data={
                      data?.assessorInsight?.insight || data?.aiInsight?.insight
                    }
                    infoQuery={onCreateInsight}
                    type="summary"
                    editable={data?.editable}
                  />
                </Box>
              </>
            )}
          </>
        );
      }}
    />
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
  const width = `${score != null ? score : 100}%`;
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

const OnHoverInput = (props: any) => {
  const [show, setShow] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = () => {
    editable && setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };
  const { data, editable, type, infoQuery } = props;
  const [hasError, setHasError] = useState<boolean>(false);
  const [error, setError] = useState<any>({});
  const handleCancel = () => {
    setShow(false);
    setError({});
    setHasError(false);
  };

  const updateAssessmentKit = async (data: any) => {
    try {
      const res = await infoQuery(data.title);
      res?.message && toast.success(res?.message);
      setShow(false);
    } catch (e) {
      const err = e as ICustomError;
      if (Array.isArray(err.response?.data?.message)) {
        toastError(err.response?.data?.message[0]);
      } else if (
        err.response?.data &&
        err.response?.data.hasOwnProperty("message")
      ) {
        toastError(error);
      }
      setError(err);
      setHasError(true);
    }
  };
  const formMethods = useForm({ shouldUnregister: true });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        cursor: "text !important",
        direction: languageDetector(data) ? "rtl" : "ltr",
      }}
    >
      {editable && show ? (
        <FormProviderWithForm formMethods={formMethods}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <RichEditorField
              name="title"
              label={<Box></Box>}
              placeholder={t("writeHere", {
                title: t("insight").toLowerCase(),
              })}
              defaultValue={data || ""}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <IconButton
                sx={{
                  background: theme.palette.primary.main,
                  "&:hover": {
                    background: theme.palette.primary.dark,
                  },
                  borderRadius: languageDetector(data)
                    ? "8px 0 0 0"
                    : "0 8px 0 0",
                  height: "49%",
                }}
                onClick={formMethods.handleSubmit(updateAssessmentKit)}
              >
                <CheckCircleOutlineRoundedIcon sx={{ color: "#fff" }} />
              </IconButton>
              <IconButton
                sx={{
                  background: theme.palette.primary.main,
                  "&:hover": {
                    background: theme.palette.primary.dark,
                  },
                  borderRadius: languageDetector(data)
                    ? "0 0 0 8px"
                    : "0 0 8px 0",
                  height: "49%",
                }}
                onClick={handleCancel}
              >
                <CancelRoundedIcon sx={{ color: "#fff" }} />
              </IconButton>
            </Box>
            {hasError && (
              <Typography color="#ba000d" variant="caption">
                {error?.data?.about}
              </Typography>
            )}
          </Box>
        </FormProviderWithForm>
      ) : (
        <Box
          sx={{
            minHeight: "38px",
            borderRadius: "8px",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            wordBreak: "break-word",
            pr: languageDetector(data) ? 1 : 5,
            pl: languageDetector(data) ? 5 : 1,
            border: "1px solid #fff",
            "&:hover": {
              border: editable ? "1px solid #1976d299" : "unset",
              borderColor: editable ? theme.palette.primary.main : "unset",
            },
            position: "relative",
          }}
          onClick={() => setShow(!show)}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          <Typography
            sx={{
              width: "100%",
            }}
          >
            <Typography
              dangerouslySetInnerHTML={{
                __html:
                  data ?? t("writeHere", { title: t("insight").toLowerCase() }),
              }}
              style={{
                whiteSpace: "pre-wrap",
                ...theme.typography.titleMedium,
                fontWeight: "400",
                unicodeBidi: "plaintext",
                fontFamily: languageDetector(data)
                  ? farsiFontFamily
                  : primaryFontFamily,
              }}
              sx={{
                "& > p": {
                  unicodeBidi: "plaintext",
                  textAlign: "initial",
                },
              }}
            ></Typography>
          </Typography>
          {isHovering && (
            <IconButton
              title="Edit"
              sx={{
                background: theme.palette.primary.main,
                "&:hover": {
                  background: theme.palette.primary.dark,
                },
                borderRadius: languageDetector(data)
                  ? "8px 0 0 8px"
                  : "0 8px 8px 0",
                height: "100%",
                position: "absolute",
                right: languageDetector(data) ? "unset" : 0,
                left: languageDetector(data) ? 0 : "unset",
                top: 0,
              }}
              onClick={() => setShow(!show)}
            >
              <EditRounded sx={{ color: "#fff" }} />
            </IconButton>
          )}
        </Box>
      )}
    </Box>
  );
};

export default SUbjectAttributeCard;
