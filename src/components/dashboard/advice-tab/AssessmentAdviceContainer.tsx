import { useEffect, useMemo, useState } from "react";
import { Trans } from "react-i18next";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import { useParams } from "react-router-dom";
import { useQuery } from "@utils/useQuery";
import { IAssessmentReportModel, ISubjectReportModel } from "@types";
import { useServiceContext } from "@providers/ServiceProvider";
import toastError from "@utils/toastError";
import { ICustomError } from "@utils/CustomError";
import languageDetector from "@utils/languageDetector";
import { LoadingButton } from "@mui/lab";
import { primaryFontFamily } from "@config/theme";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { AssessmentReportNarrator } from "@components/dashboard/advice-tab/assessmentReportNarrator";
import AdviceDialog from "./AdviceDialog";
import QueryBatchData from "@common/QueryBatchData";
import EmptyState from "./EmptyState";
import AdviceItems from "./advice-items/AdviceItems";
import { styles } from "@styles";
import { Divider, Typography } from "@mui/material";

const AssessmentAdviceContainer = (props: any) => {
  const queryData = useQuery<IAssessmentReportModel>({
    service: (args, config) =>
      service.fetchAssessment({ assessmentId }, config),
    toastError: false,
  });

  const calculateMaturityLevelQuery = useQuery({
    service: (args = { assessmentId }, config) =>
      service.calculateMaturityLevel(args, config),
    runOnMount: false,
  });
  const calculate = async () => {
    try {
      await calculateMaturityLevelQuery.query();
      await queryData.query();
    } catch (e) {}
  };

  const calculateConfidenceLevelQuery = useQuery({
    service: (args = { assessmentId }, config) =>
      service.calculateConfidenceLevel(args, config),
    runOnMount: false,
  });

  const calculateConfidenceLevel = async () => {
    try {
      await calculateConfidenceLevelQuery.query();
      await queryData.query();
    } catch (e) {}
  };

  useEffect(() => {
    if (queryData.errorObject?.response?.data?.code == "CALCULATE_NOT_VALID") {
      calculate();
    }
    if (
      queryData.errorObject?.response?.data?.code ==
      "CONFIDENCE_CALCULATION_NOT_VALID"
    ) {
      calculateConfidenceLevel();
    }
    if (queryData?.errorObject?.response?.data?.code === "DEPRECATED") {
      service.migrateKitVersion({ assessmentId }).then(() => {
        queryData.query();
      });
    }
  }, [queryData.errorObject]);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [isWritingAdvice, setIsWritingAdvice] = useState<boolean>(false);
  const [adviceResult, setAdviceResult] = useState<any>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [AIGenerated, setAIGenerated] = useState<boolean>(false);
  const [emptyState, setEmptyState] = useState<boolean>(true);

  const { assessmentId = "" } = useParams();

  const { service } = useServiceContext();
  const itemsPerPage = 5;
  const totalPages = useMemo(
    () => Math.ceil(adviceResult?.length / itemsPerPage),
    [adviceResult],
  );
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setCurrentPage(page);
  };
  const paginatedAdvice = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return adviceResult?.slice(startIndex, endIndex);
  }, [adviceResult, currentPage]);
  const handleClickOpen = () => {
    setExpanded(true);
  };

  const handleClose = () => {
    setExpanded(false);
  };
  const createAdviceQueryData = useQuery<ISubjectReportModel>({
    service: (args, config) => service.createAdvice(args, config),
    runOnMount: false,
  });
  const createAINarrationQueryData = useQuery<ISubjectReportModel>({
    service: (args, config) => service.createAINarration(args, config),
    runOnMount: false,
  });

  const fetchAdviceNarration = useQuery<any>({
    service: (args, config) =>
      service.fetchAdviceNarration({ assessmentId }, config),
    toastError: false,
  });
  const createAdvice = async () => {
    try {
      if (target) {
        const data = await createAdviceQueryData.query({
          assessmentId: assessmentId,
          attributeLevelTargets: target,
        });
        setAdviceResult(data?.items);
        setIsFarsi(languageDetector(data?.items[0]?.question?.title));
        handleClose();
      }
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };
  const generateAdviceViaAI = async () => {
    try {
      if (target) {
        await createAINarrationQueryData.query({
          assessmentId: assessmentId,
          attributeLevelTargets: target,
          adviceListItems: adviceResult,
        });
        setAdviceResult(null);
        setAIGenerated(true);
        setIsWritingAdvice(false);
        handleClose();
      }
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };
  const [target, setTarget] = useState<any>([]);
  const [isFarsi, setIsFarsi] = useState<boolean>(false);
  const attributeColorPallet = ["#D81E5B", "#F9A03F", "#0A2342"];
  const attributeBGColorPallet = ["#FDF1F5", "#FEF5EB", "#EDF4FC"];

  return (
    <QueryBatchData
      queryBatchData={[fetchAdviceNarration, queryData]}
      renderLoading={() => <Skeleton height={160} />}
      render={([narrationComponent, data]) => {
        const { assessment, subjects, permissions } = data || {};
        const filteredMaturityLevels = useMemo(() => {
          const filteredData = assessment?.assessmentKit?.maturityLevels.sort(
            (elem1: any, elem2: any) => elem1.index - elem2.index,
          );
          return filteredData;
        }, [assessment]);

        useEffect(() => {
          const adviceEmptyState = !(
            narrationComponent?.aiNarration ||
            narrationComponent?.assessorNarration
          );
          setEmptyState(adviceEmptyState);
        }, []);
        return (
          <>
            <AdviceDialog
              open={expanded}
              handleClose={handleClose}
              subjects={subjects}
              target={target}
              setTarget={setTarget}
              filteredMaturityLevels={filteredMaturityLevels}
              createAdvice={createAdvice}
              loading={createAdviceQueryData.loading}
            />
            {emptyState && !isWritingAdvice && !AIGenerated ? (
              <EmptyState
                adviceResult={adviceResult}
                isWritingAdvice={isWritingAdvice}
                permissions={permissions}
                setIsWritingAdvice={setIsWritingAdvice}
                handleClickOpen={handleClickOpen}
                narrationComponent={narrationComponent}
              />
            ) : (
              <Box sx={{ ...styles.boxStyle }}>
                {!adviceResult && (
                  <>
                    <Box display="flex" justifyContent="space-between" mt={2}>
                      <Typography variant="semiBoldLarge">
                        <Trans i18nKey="approachToAdvice" />
                      </Typography>
                      <Tooltip
                        title={
                          !narrationComponent.aiEnabled && (
                            <Trans i18nKey="AIDisabled" />
                          )
                        }
                      >
                        <div>
                          <Button
                            variant="contained"
                            sx={{
                              display: "flex",
                              gap: 1,
                            }}
                            size="small"
                            onClick={handleClickOpen}
                            disabled={!narrationComponent.aiEnabled}
                          >
                            <Trans
                              i18nKey={
                                AIGenerated
                                  ? "regenerateAdvicesViaAI"
                                  : "generateAdvicesViaAI"
                              }
                            />
                            <FaWandMagicSparkles />
                          </Button>
                        </div>
                      </Tooltip>
                    </Box>

                    <AssessmentReportNarrator
                      isWritingAdvice={isWritingAdvice}
                      setIsWritingAdvice={setIsWritingAdvice}
                      setEmptyState={setEmptyState}
                      setAIGenerated={setAIGenerated}
                    />
                  </>
                )}
                <Divider />
                <AdviceItems />
              </Box>
            )}
            {adviceResult && (
              <>
                <Grid
                  container
                  spacing={2}
                  sx={{
                    mb: 4,
                    textAlign: "center",
                    fontWeight: "700",
                    color: "#9DA7B3",
                  }}
                >
                  <Grid item xs={1} md={1}>
                    <Trans i18nKey="index" />
                  </Grid>
                  <Grid item xs={5} md={3}>
                    <Trans i18nKey="question" />
                  </Grid>
                  <Grid item xs={2} md={2}>
                    <Trans i18nKey="whatIsNow" />
                  </Grid>
                  <Grid item xs={2} md={2}>
                    <Trans i18nKey="whatShouldBe" />
                  </Grid>
                  <Grid item xs={2} md={2}>
                    <Trans i18nKey="targetedAttributes" />
                  </Grid>
                  <Grid
                    item
                    xs={0}
                    md={2}
                    sx={{
                      display: {
                        md: "block",
                        xs: "none",
                      },
                    }}
                  >
                    <Trans i18nKey="questionnaire" />
                  </Grid>
                </Grid>

                {paginatedAdvice?.map((item: any, index: number) => {
                  const {
                    question,
                    answeredOption,
                    recommendedOption,
                    attributes,
                    questionnaire,
                  } = item;
                  return (
                    <Grid
                      container
                      spacing={2}
                      sx={{ alignItems: "center", mb: 2 }}
                      key={item?.id}
                    >
                      <Grid
                        item
                        xs={1}
                        md={1}
                        sx={{
                          textAlign: "center",
                          fontWeight: "700",
                          color: "#004F83",
                        }}
                      >
                        {index + 1 + (currentPage - 1) * itemsPerPage}
                      </Grid>
                      <Grid
                        item
                        xs={5}
                        md={3}
                        sx={{
                          alignItems: "center",
                          textAlign: { xs: "left", md: "left" },
                          fontWeight: "700",
                          color: "#0A2342",
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          WebkitLineClamp: 3,
                          whiteSpace: "normal",
                        }}
                      >
                        <Tooltip
                          title={
                            question?.title.length > 100 ? question?.title : ""
                          }
                        >
                          <Box
                            sx={{
                              textAlign: "center",
                              unicodeBidi: "plaintext",
                            }}
                          >
                            {question?.title}
                          </Box>
                        </Tooltip>
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        md={2}
                        sx={{
                          textAlign: "center",
                          fontWeight: "300",
                          color: "#0A2342",
                        }}
                      >
                        {answeredOption &&
                          `${answeredOption.index}. ${answeredOption.title}`}
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        md={2}
                        sx={{
                          textAlign: "center",
                          fontWeight: "300",
                          color: "#0A2342",
                        }}
                      >
                        {recommendedOption &&
                          `${recommendedOption.index}. ${recommendedOption.title}`}
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        md={2}
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "center",
                        }}
                      >
                        {attributes.map((attribute: any, index: number) => (
                          <Box
                            key={attribute.id}
                            sx={{
                              px: "10px",
                              color: attributeColorPallet[Math.ceil(index % 3)],
                              background:
                                attributeBGColorPallet[Math.ceil(index % 3)],
                              fontSize: "11px",
                              border: `1px solid ${attributeColorPallet[Math.ceil(index % 3)]}`,
                              borderRadius: "8px",
                              m: "4px",
                              textAlign: "center",
                              fontFamily: `${isFarsi ? "Vazirmatn" : primaryFontFamily}`,
                            }}
                          >
                            {attribute.title}
                          </Box>
                        ))}
                      </Grid>
                      <Grid
                        item
                        xs={0}
                        md={2}
                        sx={{
                          textAlign: "center",
                          fontWeight: "500",
                          color: "#004F83",
                          display: { md: "block", xs: "none" },
                        }}
                      >
                        <Box>{questionnaire.title}</Box>
                        <Box>Q.{question?.index}</Box>
                      </Grid>
                    </Grid>
                  );
                })}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 4,
                  }}
                >
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                  />
                  {permissions?.createAdvice && (
                    <LoadingButton
                      variant="contained"
                      sx={{
                        display: "flex",
                        gap: 1,
                      }}
                      onClick={generateAdviceViaAI}
                      loading={createAINarrationQueryData.loading}
                    >
                      <Trans i18nKey="generateAdviceViaAI" />
                      <FaWandMagicSparkles />
                    </LoadingButton>
                  )}
                </Box>
              </>
            )}
          </>
        );
      }}
    />
  );
};

export default AssessmentAdviceContainer;
