import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import Typography from "@mui/material/Typography";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import { Trans } from "react-i18next";
import { theme } from "@config/theme";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import { t } from "i18next";
import { styles } from "@styles";
import uniqueId from "@/utils/uniqueId";
import { Link } from "react-router-dom";
import React, { useEffect } from "react";

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
    <Box sx={{ ...styles.boxStyle }}>
      <Stepper sx={{ width: "80%", mx: "auto", mb: "30px" }} activeStep={activeStep}>
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
                  color: "#EAF2FB",
                },
                "& .Mui-active .MuiStepIcon-text": {
                  fill: "#2466A8",
                },
                "& .Mui-disabled .MuiStepIcon-text": {
                  fill: "#fff",
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
  const { category, metrics, setActiveStep, activeStep } = props;
  const [localStep, setLocalStep] = React.useState(activeStep);

  const questions = category === "questions";
  const insights = category === "insights";
  const advices = category === "advices";
  const report = category === "report";

  useEffect(() => {
    setLocalStep(activeStep);
  }, [activeStep]);

  const calcOfIssues = () => {
    if (questions) {
      return Object.entries(metrics)
        .filter(([key]) => key !== "total" && key !== "answered" && metrics[key])
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
            key !== "totalMetadata" && key !== "providedMetadata" && metrics[key]
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
        document.querySelector(`#${text}`)?.scrollIntoView({ behavior: "smooth" });
      }}
    >
      <Chip
        label={
          <Box sx={{ ...styles.centerVH, gap: 1 }}>
            <Typography sx={{ ...theme.typography.labelMedium }}>
              {`  ${calcOfIssues()}  `}
            </Typography>
            <Typography sx={{ ...theme.typography.labelSmall }}>
              {t((calcOfIssues() ?? 0) > 1 ? "issues" : "issue").toUpperCase()}
            </Typography>
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
  );

  const currentTag = (
    <Chip
      label={t("currentStep")}
      size="small"
      sx={{
        ...theme.typography.labelMedium,
        color: "#2D80D2",
        background: "#EAF2FB",
      }}
    />
  );

  const completedTag = (
    <Chip
      label={t("completed") + "!"}
      size="small"
      sx={{
        ...theme.typography.labelMedium,
        color: "#3D8F3D",
        background: "#EDF7ED",
      }}
    />
  );

  let content = null;
  let completed = false;

  if (questions) {
    const { answered, total } = metrics;
    completed = answered === total;
    const hasIssues = calcOfIssues() > 0;

    useEffect(() => {
      if (completed && localStep === 0) {
        setActiveStep(1);
      }
    }, [completed, localStep, setActiveStep]);

    content = (
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        height: "calc(100% - 60px)",
      }}>
        <Box sx={{ width: "100%", display: "flex", justifyContent: "space-evenly" }}>
          <Typography sx={{ direction: "ltr" }} variant="headlineLarge">
            {`${answered} / ${total} `}
          </Typography>
          <Box sx={{ ...styles.centerCVH, gap: 1 }}>
            {completed ? completedTag : localStep === 0 && currentTag}
            {hasIssues && issuesTag("questions")}
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
          <Typography variant="labelMedium" sx={{ color: "#2D80D2" }}>
            {Math.floor((100 * answered) / total)}%
          </Typography>
          <Typography variant="labelMedium" sx={{ color: "#3D4D5C80" }}>
            {t("fromTotalQuestionsCount")}
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

    useEffect(() => {
      if (completed && localStep === 1) {
        setActiveStep(2);
      }
    }, [completed, localStep, setActiveStep]);

    content = (
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        width: "100%",
        height: "calc(100% - 60px)",
      }}>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Typography sx={{ direction: "ltr" }} variant="headlineLarge">
            {`${result} / ${expected}`}
          </Typography>
          <Box sx={{ ...styles.centerCVH, gap: 1 }}>
            {completed && completedTag}
            {!completed && localStep === 1 && currentTag}
            {hasIssues && issuesTag("insights")}
          </Box>
        </Box>
        <Box sx={{ ...styles.centerVH, gap: "4px" }}>
          <Typography variant="labelMedium" sx={{ color: "#2D80D2" }}>
            {Math.floor((100 * result) / expected)}%
          </Typography>
          <Typography variant="labelMedium" sx={{ color: "#3D4D5C80" }}>
            {t("totalInsightsCount")}
          </Typography>
        </Box>
      </Box>
    );
  }

  if (advices) {
    const { total } = metrics;
    completed = localStep >= 2 && total !== 0;
    const hasIssues = total === 0;

    useEffect(() => {
      if (completed && localStep === 2) {
        setActiveStep(3);
      }
    }, [completed, localStep, setActiveStep]);

    content = (
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        width: "100%",
        height: "calc(100% - 60px)",
      }}>
        <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
          <Typography sx={{ ...theme.typography.headlineLarge }}>
            {total}
          </Typography>
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
    const { unprovidedMetadata, unpublished, providedMetadata, totalMetadata } = metrics;
    completed = localStep >= 3 && providedMetadata === totalMetadata && !unpublished;
    const hasIssues = unprovidedMetadata >= 1 || unpublished;

    useEffect(() => {
      if (completed && localStep === 3) {
        setActiveStep(4);
      }
    }, [completed, localStep, setActiveStep]);

    content = (
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        height: "calc(100% - 60px)",
      }}>
        <Box sx={{ width: "100%", display: "flex", justifyContent: "space-evenly" }}>
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
        borderInlineEnd: !report ? "1px solid #C7CCD1" : "",
        borderTop: {
          xs: insights || report ? "1px solid #C7CCD1" : "",
          md: "none",
        },
        borderBottom: { xs: insights ? "1px solid #C7CCD1" : "", md: "none" },
        width: "100%",
        textAlign: "center",
        cursor: "pointer",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <Typography
        sx={{
          ...theme.typography.semiBoldLarge,
          color: "#6C8093",
          textAlign: "center",
          mb: "36px",
        }}
      >
        {questions && (
          <Typography variant="semiBoldXLarge">
            <Trans i18nKey="answeringQuestionsTitle" />
          </Typography>
        )}
        {insights && (
          <Typography variant="semiBoldXLarge">
            <Trans i18nKey="submittingInsights" />
          </Typography>
        )}
        {advices && (
          <Typography variant="semiBoldXLarge">
            <Trans i18nKey="providingAdvice" />
          </Typography>
        )}
        {report && (
          <Typography variant="semiBoldXLarge">
            <Trans i18nKey="preparingReport" />
          </Typography>
        )}
      </Typography>
      {content}
    </Grid>
  );
};

export default StepperSection;