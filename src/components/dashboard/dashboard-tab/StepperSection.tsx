import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import { Trans } from "react-i18next";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import { t } from "i18next";
import { styles } from "@styles";
import uniqueId from "@/utils/unique-id";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useScreenResize from "@/hooks/useScreenResize";
import { useTheme } from "@mui/material";
import { Text } from "@/components/common/Text";

interface IStepperSection {
  setActiveStep: (value: React.SetStateAction<number>) => void;
  activeStep: number;
  stepData: { category: string; metrics: { [p: string]: any } }[];
}

interface IStepBox {
  category: string;
  metrics: { [p: string]: any };
  setActiveStep: (value: React.SetStateAction<number>) => void;
  activeStep: number;
}

const StepperSection = (props: IStepperSection) => {
  const { setActiveStep, activeStep, stepData } = props;

  return (
    <Box
      sx={{
        ...styles.boxStyle,
        display: "flex",
        flexDirection: { xs: "row", md: "column" },
      }}
    >
      <Stepper
        sx={{
          width: { md: "80%" },
          mx: "auto",
          mt: { xs: 8, md: "unset" },
          mb: { xs: 8, md: "30px" },
          "& .MuiStepConnector-line": {
            height: "100%",
          },
        }}
        activeStep={activeStep}
        orientation={useScreenResize("md") ? "vertical" : "horizontal"}
      >
        {stepData.map((label: any) => (
          <Step key={uniqueId()}>
            <StepLabel
              StepIconProps={{ style: { fontSize: "2rem" } }}
              sx={{
                ".MuiSvgIcon-root.Mui-active": {
                  padding: "0",
                  borderRadius: "50%",
                  border: "1px dashed #2466A8",
                  marginY: "-4px",
                  color: "primary.bg",
                },
                "& .Mui-active .MuiStepIcon-text": {
                  fill: (theme) => theme.palette.primary.main,
                },
                "& .Mui-disabled .MuiStepIcon-text": {
                  fill: (theme) => theme.palette.background.containerLowest,
                },
              }}
            />
          </Step>
        ))}
      </Stepper>
      <Grid container columns={12}>
        {stepData.map((item) => (
          <StepBox
            key={uniqueId()}
            {...item}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
          />
        ))}
      </Grid>
    </Box>
  );
};

const StepBox = (props: IStepBox) => {
  const theme = useTheme();
  const { category, metrics, setActiveStep, activeStep } = props;
  const [localStep, setLocalStep] = useState(activeStep);

  const isCategory = (name: string) => category === name;
  const questions = isCategory("questions");
  const insights = isCategory("insights");
  const advices = isCategory("advices");
  const report = isCategory("report");

  useEffect(() => {
    setLocalStep(activeStep);
  }, [activeStep]);

  useEffect(() => {
    const stepProgressMap: Record<string, () => boolean> = {
      questions: () => metrics.answered === metrics.total && localStep === 0,
      insights: () => {
        const { expected, notGenerated } = metrics;
        const result = expected - notGenerated;
        return expected === result && localStep === 1;
      },
      advices: () => metrics.total !== 0 && localStep === 2,
      report: () => {
        const { providedMetadata, totalMetadata, unpublished } = metrics;
        return (
          providedMetadata === totalMetadata && !unpublished && localStep === 3
        );
      },
    };
    if (stepProgressMap[category]?.()) {
      setActiveStep(localStep + 1);
    }
  }, [metrics, localStep, setActiveStep, category]);

  const calcOfIssues = () => {
    const filters: Record<string, (key: string) => boolean> = {
      questions: (key) => key !== "total" && key !== "answered",
      insights: (key) => key !== "expected",
      advices: () => true,
      report: (key) => key !== "totalMetadata" && key !== "providedMetadata",
    };

    const filterFn = filters[category] || (() => false);
    if (advices) {
      return Object.keys(metrics).filter((item) => item).length;
    }
    return Object.entries(metrics)
      .filter(([key]) => filterFn(key) && metrics[key])
      .reduce((acc, [, value]) => acc + value, 0);
  };

  const issuesTag = (text: string) => {
    const count = calcOfIssues();
    return (
      count > 0 && (
        <Box
          sx={{ textDecoration: "none", cursor: "pointer" }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            document
              .querySelector(`#${text}`)
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <Chip
            label={
              <Box sx={{ ...styles.centerVH, gap: 1 }}>
                <Text variant="labelMedium">{count}</Text>
                <Text variant="labelSmall">
                  {t(
                    count > 1 ? "common.issues" : "common.issue",
                  ).toUpperCase()}
                </Text>
              </Box>
            }
            size="small"
            sx={{
              ...theme.typography.labelMedium,
              color: "#B8144B",
              background: "#FCE8EF",
              direction: theme.direction,
              cursor: "pointer",
            }}
          />
        </Box>
      )
    );
  };

  const currentTag = (
    <Chip
      label={t("dashboard.currentStep")}
      size="small"
      sx={{
        ...theme.typography.labelMedium,
        color: "#2D80D2",
        bgcolor: "primary.states.hover",
      }}
    />
  );
  const completedTag = (
    <Chip
      label={t("common.completed") + "!"}
      size="small"
      sx={{
        ...theme.typography.labelMedium,
        color: "success.main",
        bgcolor: "success.bg",
      }}
    />
  );

  const renderQuestions = () => {
    const { answered, total } = metrics;
    const completed = answered === total;
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          height: "calc(100% - 60px)",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          <Text
            sx={{ direction: "ltr" }}
            variant="headlineLarge"
          >{`${answered} / ${total} `}</Text>
          <Box sx={{ ...styles.centerCVH, gap: 1 }}>
            {completed ? completedTag : localStep === 0 && currentTag}
            {issuesTag("questions")}
          </Box>
        </Box>
        <Box gap="4px" sx={{ ...styles.centerVH }}>
          <Text variant="labelMedium" color="#2D80D2">
            {Math.floor((100 * answered) / total)}%
          </Text>
          <Text variant="labelMedium" color="#3D4D5C80">
            {t("dashboard.fromTotalQuestionsCount")}
          </Text>
        </Box>
      </Box>
    );
  };

  const renderInsights = () => {
    const { unapproved, expired, notGenerated, expected } = metrics;
    const result = expected - notGenerated;
    const completed = localStep >= 1 && expected === result;
    const hasIssues = unapproved || expired || notGenerated;
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          width: "100%",
          height: "calc(100% - 60px)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Text
            sx={{ direction: "ltr" }}
            variant="headlineLarge"
          >{`${result} / ${expected}`}</Text>
          {(completed || (!completed && localStep === 1) || !!hasIssues) && (
            <Box sx={{ ...styles.centerCVH, gap: 1 }}>
              {completed && completedTag}
              {!completed && localStep === 1 && currentTag}
              {!!hasIssues && issuesTag("insights")}
            </Box>
          )}
        </Box>
        <Box sx={{ ...styles.centerVH, gap: "4px" }}>
          <Text variant="labelMedium" color="#2D80D2">
            {Math.floor((100 * result) / expected)}%
          </Text>
          <Text variant="labelMedium" color="#3D4D5C80">
            {t("dashboard.totalInsightsCount")}
          </Text>
        </Box>
      </Box>
    );
  };
  const renderAdvices = () => {
    const { total } = metrics;
    const completed = localStep >= 2 && total !== 0;
    const hasIssues = total === 0;
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          width: "100%",
          height: "calc(100% - 60px)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
          <Text variant="headlineLarge">{total}</Text>
          {(completed ||
            (!completed && localStep === 2) ||
            (hasIssues && !completed)) && (
            <Box sx={{ ...styles.centerCVH, gap: 1 }}>
              {completed && completedTag}
              {!completed && localStep === 2 && currentTag}
              {hasIssues && !completed && issuesTag("advices")}
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  const renderReport = () => {
    const { unprovidedMetadata, unpublished, providedMetadata, totalMetadata } =
      metrics;
    const completed =
      localStep >= 3 && providedMetadata === totalMetadata && !unpublished;
    const hasIssues = unprovidedMetadata >= 1 || unpublished;
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          height: "calc(100% - 60px)",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          <Text
            sx={{ direction: "ltr" }}
            variant="headlineLarge"
          >{`${providedMetadata} / ${totalMetadata} `}</Text>
          {(hasIssues || completed || (!completed && localStep === 3)) && (
            <Box sx={{ ...styles.centerCVH, gap: 1 }}>
              {completed && completedTag}
              {!completed && localStep === 3 && currentTag}
              {hasIssues && issuesTag("report")}
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  const content = (() => {
    if (questions) return renderQuestions();
    if (insights) return renderInsights();
    if (advices) return renderAdvices();
    return renderReport();
  })();

  const titleMap: Record<string, string> = {
    questions: "dashboard.answeringQuestionsTitle",
    insights: "dashboard.submittingInsights",
    advices: "dashboard.providingAdvice",
    report: "dashboard.preparingReport",
  };

  const linkMap: Record<string, string> = {
    questions: "../questionnaires/",
    insights: "../insights",
    advices: "../advice",
    report: "../report",
  };

  return (
    <Grid
      component={Link}
      to={linkMap[category]}
      size={{md: 3}}
      sx={{
        px: "20px",
        py: "10px",
        height: "190px",
        borderInlineEnd: !report ? `1px solid #8F99A3` : "",
        borderTop: {
          xs: insights || report ? `1px solid #8F99A3` : "",
          md: "none",
        },
        borderBottom: {
          xs: insights ? `1px solid #8F99A3` : "",
          md: "none",
        },
        width: "100%",
        textAlign: "center",
        cursor: "pointer",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <Text
        variant="semiBoldLarge"
        color="background.onVariant"
        sx={{ mb: "36px", textAlign: "center", display: "inline-block" }}
      >
        <Text variant="semiBoldXLarge">
          <Trans i18nKey={titleMap[category]} />
        </Text>
      </Text>
      {content}
    </Grid>
  );
};

export default StepperSection;
