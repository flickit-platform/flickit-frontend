import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Trans } from "react-i18next";
import { theme } from "@config/theme";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Grid from "@mui/material/Grid";
import uniqueId from "@/utils/uniqueId";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate, useParams } from "react-router-dom";
import { styles } from "@styles";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import { ICustomError } from "@utils/CustomError";
import toastError from "@utils/toastError";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import LoadingButton from "@mui/lab/LoadingButton";
import useCalculate from "@/hooks/useCalculate";
import { ErrorCodes } from "@/types/index";

const TodoBox = (props: any) => {
  const { todoBoxData, fetchDashboard } = props;
  const { now, next } = todoBoxData;
  return (
    <Box sx={{ mt: "40px" }}>
      {now?.length > 0 && (
        <Box
          sx={{
            ...styles.boxStyle,
          }}
        >
          {" "}
          <Box sx={{ ...styles.centerV, mt: "-6px" }}>
            <Typography
              sx={{
                ...theme.typography.headlineSmall,
              }}
            >
              <Trans i18nKey="dashboard.whatToDoNow" />
            </Typography>
            <Tooltip title={<Trans i18nKey="dashboard.whatToDoNowTooltip" />}>
              <IconButton size="small" color="primary">
                <InfoOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Box>
          {now.map((item: any) => {
            return (
              <React.Fragment key={uniqueId()}>
                <Box
                  id={item.name}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: "23px",
                    mt: "32px",
                  }}
                >
                  <Typography
                    sx={{ ...theme.typography.semiBoldLarge, color: "#2B333B" }}
                  >
                    {item.name == "questions" && (
                      <Trans i18nKey="dashboard.questionsIssues" />
                    )}
                    {item.name == "insights" && (
                      <Trans i18nKey="dashboard.insightsIssues" />
                    )}
                    {item.name == "advices" && (
                      <Trans i18nKey="advice.advicesIssues" />
                    )}
                    {item.name == "report" && (
                      <Trans i18nKey="assessmentReport.reportIssues" />
                    )}
                  </Typography>
                </Box>
                <Grid container columns={12} spacing={2}>
                  {Object.entries(item)
                    .filter(([key]) => key !== "name")
                    .map(([key, value]) => {
                      return (
                        <Grid item xs={12} md={6} key={uniqueId()}>
                          <IssuesItem
                            originalName={item.name}
                            key={key}
                            name={key}
                            value={value}
                            fetchDashboard={fetchDashboard.query}
                            py={1}
                            px={2}
                            issues={fetchDashboard.data?.questions}
                          />
                        </Grid>
                      );
                    })}
                </Grid>
              </React.Fragment>
            );
          })}
        </Box>
      )}
      {next?.length > 0 && (
        <Box
          sx={{
            ...styles.boxStyle,
          }}
        >
          {" "}
          <Box sx={{ ...styles.centerV, mt: "-6px" }}>
            <Typography
              sx={{
                ...theme.typography.headlineSmall,
                color: now.length < 0 ? "#2B333B" : "#3D4D5C80",
              }}
            >
              <Trans i18nKey="dashboard.whatToDoNext" />
            </Typography>
            <Tooltip title={<Trans i18nKey="dashboard.whatToDoNextTooltip" />}>
              <IconButton
                size="small"
                color={now.length < 0 ? "primary" : "default"}
              >
                <InfoOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Box>
          {next.map((item: any) => {
            return (
              <Box key={uniqueId()}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: "23px",
                    mt: "32px",
                  }}
                  id={item.name}
                >
                  <Typography
                    sx={{
                      ...theme.typography.semiBoldLarge,
                      color: now.length < 0 ? "#2B333B" : "#3D4D5C80",
                    }}
                  >
                    {item.name == "questions" && (
                      <Trans i18nKey="dashboard.questionsIssues" />
                    )}
                    {item.name == "insights" && (
                      <Trans i18nKey="dashboard.insightsIssues" />
                    )}
                    {item.name == "advices" && (
                      <Trans i18nKey="advice.advicesIssues" />
                    )}
                    {item.name == "report" && (
                      <Trans i18nKey="assessmentReport.reportIssues" />
                    )}
                  </Typography>
                </Box>
                <Grid container columns={12} spacing={2}>
                  {Object.entries(item)
                    .filter(([key]) => key !== "name")
                    .map(([key, value]) => {
                      return (
                        <Grid key={uniqueId()} item xs={12} md={6}>
                          <IssuesItem
                            name={key}
                            value={value}
                            now={now}
                            next={next}
                            originalName={item.name}
                            fetchDashboard={fetchDashboard}
                            color={
                              now?.length > 0 && next?.length > 0
                                ? "info"
                                : "primary"
                            }
                            py={1}
                            px={2}
                            issues={fetchDashboard.data?.questions}
                          />
                        </Grid>
                      );
                    })}
                </Grid>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export const IssuesItem = ({
  name,
  value,
  originalName,
  fetchDashboard,
  color = "primary",
  textVariant = "semiBoldMedium",
  issues,
  disableGenerateButtons,
  ...rest
}: any) => {
  const navigate = useNavigate();
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const { calculate, calculateConfidence } = useCalculate();

  const approveInsights = useQuery({
    service: (args, config) =>
      service.assessments.insight.approveAll(args ?? { assessmentId }, config),
    runOnMount: false,
  });

  const generateInsights = useQuery({
    service: (args, config) =>
      service.assessments.insight.generateAll(args ?? { assessmentId }, config),
    runOnMount: false,
  });

  const regenerateInsights = useQuery({
    service: (args, config) =>
      service.assessments.insight.regenerateExpired(
        args ?? { assessmentId },
        config,
      ),
    runOnMount: false,
  });

  const approveExpiredInsights = useQuery({
    service: (args, config) =>
      service.assessments.insight.approveExpired(
        args ?? { assessmentId },
        config,
      ),
    runOnMount: false,
  });

  const resolvedAllComments = useQuery({
    service: (args, config) =>
      service.assessments.questionnaire.resolveAllComments(
        args ?? { assessmentId },
        config,
      ),
    runOnMount: false,
  });

  const approveAllAnswers = useQuery({
    service: (args, config) =>
      service.assessments.answer.approveAll(args ?? { assessmentId }, config),
    runOnMount: false,
  });

  const handleNavigation = () => {
    if (originalName === "questions") {
      navigate(`../questionnaires`, {
        state: name === "withoutEvidence" ? "answeredWithoutEvidence" : name,
      });
    }
  };

  const handleApproveAll = async () => {
    try {
      await approveInsights.query();
      await fetchDashboard();
    } catch (e) {
      toastError(e as ICustomError);
    }
  };

  const handleGenerateAll = async () => {
    await generateInsights.query();
    await fetchDashboard();
  };

  const regeneratedAll = async () => {
    try {
      await regenerateInsights.query();
      await fetchDashboard();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  const handleApproveAllAnswers = async (event: any) => {
    try {
      event.stopPropagation();
      event.preventDefault();
      await approveAllAnswers.query();
      await fetchDashboard();
    } catch (e) {
      toastError(e as ICustomError);
    }
  };

  const handleApproveAllExpired = async () => {
    try {
      await approveExpiredInsights.query();
      await fetchDashboard();
    } catch (e) {
      toastError(e as ICustomError);
    }
  };
  const handleSolvedComments = async (event: any) => {
    try {
      event.stopPropagation();
      event.preventDefault();
      await resolvedAllComments.query();
      await fetchDashboard();
    } catch (e) {
      toastError(e as ICustomError);
    }
  };

  useEffect(() => {
    const { errorObject } = generateInsights;
    if (!errorObject) return;
    const errorCode = errorObject?.response?.data?.code;

    if (errorCode === ErrorCodes.CalculateNotValid)
      calculate(handleGenerateAll);
    if (errorCode === ErrorCodes.ConfidenceCalculationNotValid)
      calculateConfidence(handleGenerateAll);
  }, [generateInsights.errorObject]);

  const issueTextMap = {
    unanswered: value > 1 ? "dashboard.needForAnswers" : "dashboard.needsForAnswer",
    unapprovedAnswers:
      value > 1 ? "dashboard.answersNeedApproval" : "dashboard.answerNeedsApproval",
    answeredWithLowConfidence:
      value > 1 ? "dashboard.questionsConfidenceAnswers" : "dashboard.questionConfidenceAnswer",
    withoutEvidence: value > 1 ? "dashboard.lackForEvidences" : "dashboard.lackForEvidence",
    unresolvedComments: value > 1 ? "dashboard.commentsAreUnresolved" : "dashboard.commentIsUnresolved",
    notGenerated: "dashboard.insightsNeedToBeGenerated",
    unapproved: value > 1 ? "dashboard.insightsNeedApproval" : "dashboard.insightNeedsApproval",
    expired: value > 1 ? "dashboard.expiredDueToNewAnswers" : "dashboard.expiredDueToNewAnswer",
    unprovidedMetadata:
      value > 1 ? "dashboard.metadataAreNotProvided" : "dashboard.metadataIsNotProvided",
    unpublished: "dashboard.unpublishedReport",
    total: "dashboard.suggestAnyAdvicesSoFar",
  } as any;

  const colorPalette = (theme.palette as any)[color] ?? theme.palette.primary;

  return (
    <Box
      onClick={handleNavigation}
      sx={{
        borderRadius: 2,
        border: `0.1px solid ${colorPalette.main}`,
        background: colorPalette.light,
        display: "flex",
        alignItems: "center",
        gap: 1,
        textDecoration: "none",
        cursor: originalName === "questions" ? "pointer" : "unset",
      }}
      {...rest}
    >
      <ErrorOutlineIcon
        style={{
          fill: color === "info" ? theme.palette.error.main : colorPalette.main,
        }}
      />
      <Typography
        sx={{
          color: colorPalette.dark,
          display: "flex",
          gap: 1,
        }}
        variant={textVariant}
      >
        {typeof value === "number" && value !== 0 && (
          <Box component="span">{value.toString()}</Box>
        )}
        {issueTextMap[name] && <Trans i18nKey={issueTextMap[name]} />}
      </Typography>

      {name === "unapproved" && (
        <Button
          onClick={handleApproveAll}
          sx={{
            padding: "4px 10px",
            marginInlineStart: "auto",
          }}
          color={color === "info" ? "primary" : color}
          variant="outlined"
        >
          <Typography sx={{ ...theme.typography.labelMedium }}>
            <Trans i18nKey="common.approveAll" />
          </Typography>
        </Button>
      )}

      {name === "notGenerated" && (
        <Tooltip
          disableHoverListener={issues?.unanswered < 1}
          title={<Trans i18nKey="dashboard.allQuestonsMustBeAnsweredFirst" />}
        >
          <div style={{ marginInlineStart: "auto" }}>
            <LoadingButton
              onClick={handleGenerateAll}
              variant="outlined"
              disabled={issues?.unanswered > 0 || disableGenerateButtons}
              loading={generateInsights.loading}
              color={color}
              sx={{
                padding: "4px 10px",
              }}
            >
              <Typography sx={{ ...theme.typography.labelMedium }}>
                <Trans i18nKey="dashboard.generateAll" />
              </Typography>
            </LoadingButton>
          </div>
        </Tooltip>
      )}
      {name == "expired" && (
        <>
          <Tooltip
            disableHoverListener={issues?.unanswered < 1}
            title={<Trans i18nKey="dashboard.allQuestonsMustBeAnsweredFirst" />}
          >
            <div
              style={{
                marginInlineStart: "auto",
                color: theme.palette.primary.main,
              }}
            >
              <LoadingButton
                onClick={regeneratedAll}
                variant={"outlined"}
                disabled={issues?.unanswered > 0 || disableGenerateButtons}
                loading={regenerateInsights.loading}
                color={color === "info" ? "primary" : color}
              >
                <Typography
                  sx={{ ...theme.typography.labelMedium, whiteSpace: "nowrap" }}
                >
                  <Trans i18nKey={"common.regenerateAll"} />
                </Typography>
              </LoadingButton>
            </div>
          </Tooltip>
          <Box>
            <LoadingButton
              onClick={handleApproveAllExpired}
              loading={approveExpiredInsights.loading}
              sx={{
                padding: "4px 10px",
                marginInlineStart: "auto",
              }}
              color={color === "info" ? "primary" : color}
              variant="outlined"
            >
              <Typography
                sx={{ ...theme.typography.labelMedium, whiteSpace: "nowrap" }}
              >
                <Trans i18nKey="common.approveAll" />
              </Typography>
            </LoadingButton>
          </Box>
        </>
      )}
      {name === "unresolvedComments" && (
        <Button
          onClick={(event) => handleSolvedComments(event)}
          sx={{
            padding: "4px 10px",
            marginInlineStart: "auto",
          }}
          color={color === "info" ? "primary" : color}
          variant="outlined"
        >
          <Typography sx={{ ...theme.typography.labelMedium }}>
            <Trans i18nKey="common.resolveAll" />
          </Typography>
        </Button>
      )}
      {name === "unapprovedAnswers" && (
        <Box style={{ marginInlineStart: "auto" }}>
          <LoadingButton
            onClick={(event) => handleApproveAllAnswers(event)}
            variant="outlined"
            loading={approveAllAnswers.loading}
            color={color}
            sx={{
              padding: "4px 10px",
            }}
          >
            <Typography sx={{ ...theme.typography.labelMedium }}>
              <Trans i18nKey="common.approveAll" />
            </Typography>
          </LoadingButton>
        </Box>
      )}
    </Box>
  );
};

export default TodoBox;
