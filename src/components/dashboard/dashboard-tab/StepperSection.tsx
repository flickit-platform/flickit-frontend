import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import Typography from "@mui/material/Typography";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import { Trans } from "react-i18next";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import { t } from "i18next";
import { styles } from "@styles";
import uniqueId from "@/utils/uniqueId";
import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import useScreenResize from "@utils/useScreenResize";
import { useTheme } from "@mui/material";

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
                  border: (theme) => `1px dashed ${theme.palette.primary.main}`,
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
  const [localStep, setLocalStep] = React.useState(activeStep);

  const questions = category === "questions";
  const insights = category === "insights";
  const advices = category === "advices";
  const report = category === "report";

  useEffect(() => {
    setLocalStep(activeStep);
  }, [activeStep]);

  useEffect(() => {
    if (questions) {
      const { answered, total } = metrics;
      if (answered === total && localStep === 0) {
        setActiveStep(1);
      }
    }

    if (insights) {
      const { expected, notGenerated } = metrics;
      const result = expected - notGenerated;
      if (expected === result && localStep === 1) {
        setActiveStep(2);
      }
    }

    if (advices) {
      const { total } = metrics;
      if (total !== 0 && localStep === 2) {
        setActiveStep(3);
      }
    }

    if (report) {
      const { providedMetadata, totalMetadata, unpublished } = metrics;
      if (
        providedMetadata === totalMetadata &&
        !unpublished &&
        localStep === 3
      ) {
        setActiveStep(4);
      }
    }
  }, [metrics, localStep, setActiveStep, questions, insights, advices, report]);

  useEffect(() => {
    setLocalStep(activeStep);
  }, [activeStep]);

  const calcOfIssues = () => {
    if (questions) {
      return Object.entries(metrics)
        .filter(
          ([key]) => key !== "total" && key !== "answered" && metrics[key],
        )
        .reduce((acc, [_, value]) => acc + value, 0);
    }
    if (insights) {
      return Object.entries(metrics)
        .filter(([key]) => key !== "expected" && metrics[key])
        .reduce((acc, [_, value]) => acc + value, 0);
    }
    if (advices) {
      return Object.keys(metrics).filter((item) => item).length;
    }
    if (report) {
      return Object.entries(metrics)
        .filter(
          ([key]) =>
            key !== "totalMetadata" &&
            key !== "providedMetadata" &&
            metrics[key],
        )
        .reduce((acc, [_, value]) => acc + value, 0);
    }
    return 0;
  };

  const issuesTag = (text: string) => (
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
            <Typography variant="labelMedium">
              {`  ${calcOfIssues()}  `}
            </Typography>
            <Typography variant="labelSmall">
              {t(
                (calcOfIssues() ?? 0) > 1 ? "common.issues" : "common.issue",
              ).toUpperCase()}
            </Typography>
          </Box>
        }
        size="small"
        sx={{
          ...theme.typography.labelMedium,
          color: "secondary.main",
          bgcolor: "secondary.bg",
          direction: theme.direction,
          cursor: "pointer",
        }}
      />
    </Box>
  );

  const currentTag = (
    <Chip
      label={t("dashboard.currentStep")}
      size="small"
      sx={{
        ...theme.typography.labelMedium,
        color: "#2D80D2",
        bgcolor: "primary.bg",
      }}
    />
  );

  const completedTag = (
    <Chip
      label={t("common.completed") + "!"}
      size="small"
      sx={{
        ...theme.typography.labelMedium,
        color: "success.bg",
        bgcolor: "success.bg",
      }}
    />
  );

  let content = null;
  let completed = false;

  if (questions) {
    const { answered, total } = metrics;
    completed = answered === total;
    const hasIssues = calcOfIssues() > 0;

    content = (
      <Box
        justifyContent="space-between"
        height="calc(100% - 60px)"
        sx={{ ...styles.centerCH }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          <Typography sx={{ direction: "ltr" }} variant="headlineLarge">
            {`${answered} / ${total} `}
          </Typography>
          <Box sx={{ ...styles.centerCVH, gap: 1 }}>
            {completed ? completedTag : localStep === 0 && currentTag}
            {hasIssues && issuesTag("questions")}
          </Box>
        </Box>
        <Box gap="4px" sx={{ ...styles.centerVH }}>
          <Typography variant="labelMedium" color="#2D80D2">
            {Math.floor((100 * answered) / total)}%
          </Typography>
          <Typography variant="labelMedium" color="#3D4D5C80">
            {t("dashboard.fromTotalQuestionsCount")}
          </Typography>
        </Box>
      </Box>
    );
  }

  if (insights) {
    const { unapproved, expired, notGenerated, expected } = metrics;
    const result = expected - notGenerated;
    completed = localStep >= 1 && expected === result;
    const hasIssues = unapproved || expired || notGenerated;

    content = (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          width: "100%",
          height: "calc(100% - 60px)",
        }}
      >
        <Box gap={2} sx={{ ...styles.centerH }}>
          <Typography sx={{ direction: "ltr" }} variant="headlineLarge">
            {`${result} / ${expected}`}
          </Typography>
          <Box sx={{ ...styles.centerCVH, gap: 1 }}>
            {completed && completedTag}
            {!completed && localStep === 1 ? currentTag : ""}
            {hasIssues ? issuesTag("insights") : ""}
          </Box>
        </Box>
        <Box sx={{ ...styles.centerVH, gap: "4px" }}>
          <Typography variant="labelMedium" color="#2D80D2">
            {Math.floor((100 * result) / expected)}%
          </Typography>
          <Typography variant="labelMedium" color="#3D4D5C80">
            {t("dashboard.totalInsightsCount")}
          </Typography>
        </Box>
      </Box>
    );
  }

  if (advices) {
    const { total } = metrics;
    completed = localStep >= 2 && total !== 0;
    const hasIssues = total === 0;

    content = (
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
          <Typography variant="headlineLarge">{total}</Typography>
          {(completed || hasIssues) && (
            <Box sx={{ ...styles.centerCVH, gap: 1 }}>
              {completed && completedTag}
              {!completed && localStep === 2 && currentTag}
              {hasIssues && !completed && issuesTag("advices")}
            </Box>
          )}
        </Box>
      </Box>
    );
  }

  if (report) {
    const { unprovidedMetadata, unpublished, providedMetadata, totalMetadata } =
      metrics;
    completed =
      localStep >= 3 && providedMetadata === totalMetadata && !unpublished;
    const hasIssues = unprovidedMetadata >= 1 || unpublished;

    content = (
      <Box
        justifyContent="space-between"
        height="calc(100% - 60px)"
        sx={{ ...styles.centerCH }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          <Typography sx={{ direction: "ltr" }} variant="headlineLarge">
            {`${providedMetadata} / ${totalMetadata} `}
          </Typography>
          <Box sx={{ ...styles.centerCVH, gap: 1 }}>
            {completed && completedTag}
            {!completed && localStep === 3 && currentTag}
            {hasIssues && issuesTag("report")}
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Grid
      component={Link}
      to={
        questions
          ? "../questionnaires/"
          : insights
            ? "../insights"
            : advices
              ? "../advice"
              : "../report"
      }
      item
      md={3}
      sx={{
        px: "20px",
        py: "10px",
        height: "190px",
        borderInlineEnd: !report
          ? `1px solid ${theme.palette.outline?.variant}`
          : "",
        borderTop: {
          xs:
            insights || report
              ? `1px solid ${theme.palette.outline?.variant}`
              : "",
          md: "none",
        },
        borderBottom: {
          xs: insights ? `1px solid ${theme.palette.outline?.variant}` : "",
          md: "none",
        },
        width: "100%",
        textAlign: "center",
        cursor: "pointer",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <Typography
        variant="semiBoldLarge"
        color="background.onVariant"
        sx={{
          textAlign: "center",
          mb: "36px",
        }}
      >
        {questions && (
          <Typography variant="semiBoldXLarge">
            <Trans i18nKey="dashboard.answeringQuestionsTitle" />
          </Typography>
        )}
        {insights && (
          <Typography variant="semiBoldXLarge">
            <Trans i18nKey="dashboard.submittingInsights" />
          </Typography>
        )}
        {advices && (
          <Typography variant="semiBoldXLarge">
            <Trans i18nKey="dashboard.providingAdvice" />
          </Typography>
        )}
        {report && (
          <Typography variant="semiBoldXLarge">
            <Trans i18nKey="dashboard.preparingReport" />
          </Typography>
        )}
      </Typography>
      {content}
    </Grid>
  );
};

export default StepperSection;
