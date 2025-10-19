import { Fragment, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { Trans } from "react-i18next";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Grid from "@mui/material/Grid";
import uniqueId from "@/utils/unique-id";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate, useParams } from "react-router-dom";
import { styles } from "@styles";
import { useQuery } from "@/hooks/useQuery";
import { useServiceContext } from "@/providers/service-provider";
import { ICustomError } from "@/utils/custom-error";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import LoadingButton from "@mui/lab/LoadingButton";
import useCalculate from "@/hooks/useCalculate";
import { ErrorCodes } from "@/types/index";
import showToast from "@/utils/toast-error";
import { useTheme } from "@mui/material";
import { Text } from "@/components/common/Text";

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
            <Text variant="headlineSmall">
              <Trans i18nKey="dashboard.whatToDoNow" />
            </Text>
            <Tooltip title={<Trans i18nKey="dashboard.whatToDoNowTooltip" />}>
              <IconButton size="small" color="primary">
                <InfoOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Box>
          {now.map((item: any) => {
            return (
              <Fragment key={uniqueId()}>
                <Box
                  id={item.name}
                  justifyContent="space-between"
                  mb="23px"
                  mt="32px"
                  sx={{ ...styles.centerV }}
                >
                  <Text variant="semiBoldLarge" color="text.primary">
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
                  </Text>
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
              </Fragment>
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
            <Text
              color={now.length < 0 ? "text.primary" : "#3D4D5C80"}
              variant="headlineSmall"
            >
              <Trans i18nKey="dashboard.whatToDoNext" />
            </Text>
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
                  justifyContent="space-between"
                  mb="23px"
                  mt="32px"
                  sx={{ ...styles.centerV }}
                  id={item.name}
                >
                  <Text
                    variant="semiBoldLarge"
                    color={now.length < 0 ? "text.primary" : "#3D4D5C80"}
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
                  </Text>
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
                            fetchDashboard={fetchDashboard.query}
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

  const approveAdvice = useQuery({
    service: (args, config) =>
      service.assessments.advice.approveAI(args ?? { assessmentId }, config),
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

  const handleApproveAll = async (type: any) => {
    try {
      type === "insight"
        ? await approveInsights.query()
        : await approveAdvice.query();
      await fetchDashboard();
    } catch (e) {
      showToast(e as ICustomError);
    }
  };

  const handleGenerateAll = async () => {
    await generateInsights.query();
    await fetchDashboard();
  };

  const regeneratedAll = async () => {
    if (name == "expiredAdvices") {
      return navigate(`../advice`);
    }
    try {
      await regenerateInsights.query();
      await fetchDashboard();
    } catch (e) {
      const err = e as ICustomError;
      showToast(err);
    }
  };

  const handleApproveAllAnswers = async (event: any) => {
    try {
      event.stopPropagation();
      event.preventDefault();
      await approveAllAnswers.query();
      await fetchDashboard();
    } catch (e) {
      showToast(e as ICustomError);
    }
  };

  const handleApproveAllExpired = async (type: any) => {
    try {
      type === "insight"
        ? await approveExpiredInsights.query()
        : await approveAdvice.query();
      await fetchDashboard();
    } catch (e) {
      showToast(e as ICustomError);
    }
  };
  const handleSolvedComments = async (event: any) => {
    try {
      event.stopPropagation();
      event.preventDefault();
      await resolvedAllComments.query();
      await fetchDashboard();
    } catch (e) {
      showToast(e as ICustomError);
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
  const theme = useTheme();

  const issueTextMap = {
    unanswered:
      value > 1 ? "dashboard.needForAnswers" : "dashboard.needsForAnswer",
    unapprovedAnswers:
      value > 1
        ? "dashboard.answersNeedApproval"
        : "dashboard.answerNeedsApproval",
    answeredWithLowConfidence:
      value > 1
        ? "dashboard.questionsConfidenceAnswers"
        : "dashboard.questionConfidenceAnswer",
    withoutEvidence:
      value > 1 ? "dashboard.lackForEvidences" : "dashboard.lackForEvidence",
    unresolvedComments:
      value > 1
        ? "dashboard.commentsAreUnresolved"
        : "dashboard.commentIsUnresolved",
    notGenerated: "dashboard.insightsNeedToBeGenerated",
    unapproved:
      value > 1
        ? "dashboard.insightsNeedApproval"
        : "dashboard.insightNeedsApproval",
    expired:
      value > 1
        ? "dashboard.expiredDueToNewAnswers"
        : "dashboard.expiredDueToNewAnswer",
    unprovidedMetadata:
      value > 1
        ? "dashboard.metadataAreNotProvided"
        : "dashboard.metadataIsNotProvided",
    unpublished: "dashboard.unpublishedReport",
    total: "dashboard.suggestAnyAdvicesSoFar",
    unapprovedAdvices: "dashboard.unapprovedAdvices",
    expiredAdvices: "dashboard.expiredAdvices",
  } as any;

  const colorPalette = (theme.palette as any)[color] ?? theme.palette.primary;
  const isUnapproved = name === "unapproved" || name === "unapprovedAdvices";
  const isExpired = name === "expired" || name === "expiredAdvices";

  return (
    <Box
      onClick={handleNavigation}
      borderRadius={2}
      border={`0.1px solid ${colorPalette.main}`}
      bgcolor={colorPalette.states.hover}
      gap={1}
      sx={{
        ...styles.centerV,
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
      <Text
        sx={{
          display: "flex",
          gap: 1,
        }}
        color={colorPalette.dark}
        variant={textVariant}
      >
        {typeof value === "number" &&
          value !== 0 &&
          name != "unapprovedAdvices" &&
          name != "expiredAdvices" && (
            <Box component="span">{value.toString()}</Box>
          )}
        {issueTextMap[name] && <Trans i18nKey={issueTextMap[name]} />}
      </Text>

      {isUnapproved && (
        <Button
          onClick={() =>
            handleApproveAll(name === "unapproved" ? "insight" : "advice")
          }
          sx={{ padding: "4px 10px", marginInlineStart: "auto" }}
          color={color === "info" ? "primary" : color}
          variant="outlined"
        >
          <Text variant="labelMedium">
            <Trans
              i18nKey={
                name === "unapproved" ? "common.approveAll" : "common.approve"
              }
            />
          </Text>
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
              <Text variant="labelMedium">
                <Trans i18nKey="dashboard.generateAll" />
              </Text>
            </LoadingButton>
          </div>
        </Tooltip>
      )}
      {isExpired && (
        <>
          <Tooltip
            disableHoverListener={issues?.unanswered < 1}
            title={
              name === "expired" ? (
                <Trans i18nKey="dashboard.allQuestonsMustBeAnsweredFirst" />
              ) : (
                ""
              )
            }
          >
            <div
              style={{
                marginInlineStart: "auto",
                color: theme.palette.primary.main,
              }}
            >
              <LoadingButton
                onClick={regeneratedAll}
                variant="outlined"
                disabled={
                  name === "expired"
                    ? issues?.unanswered > 0 || disableGenerateButtons
                    : false
                }
                loading={regenerateInsights.loading}
                color={color === "info" ? "primary" : color}
              >
                <Text variant="labelMedium" sx={{ whiteSpace: "nowrap" }}>
                  {name === "expired" && (
                    <Trans i18nKey="common.regenerateAll" />
                  )}
                  {name === "expiredAdvices" && (
                    <Trans i18nKey="common.regenerate" />
                  )}
                </Text>
              </LoadingButton>
            </div>
          </Tooltip>

          <Box>
            <LoadingButton
              onClick={() =>
                handleApproveAllExpired(
                  name === "expired" ? "insight" : "advice",
                )
              }
              loading={approveExpiredInsights.loading}
              sx={{ padding: "4px 10px", marginInlineStart: "auto" }}
              color={color === "info" ? "primary" : color}
              variant="outlined"
            >
              <Text variant="labelMedium" sx={{ whiteSpace: "nowrap" }}>
                {name === "expired" && <Trans i18nKey="common.approveAll" />}
                {name === "expiredAdvices" && (
                  <Trans i18nKey="common.approve" />
                )}
              </Text>
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
          <Text variant="labelMedium">
            <Trans i18nKey="common.resolveAll" />
          </Text>
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
            <Text variant="labelMedium">
              <Trans i18nKey="common.approveAll" />
            </Text>
          </LoadingButton>
        </Box>
      )}
    </Box>
  );
};

export default TodoBox;
