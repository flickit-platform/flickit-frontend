import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useState } from "react";
import { Trans } from "react-i18next";
import { theme } from "@config/theme";
import Grid from "@mui/material/Grid";
import data from "../data";
import Chip from "@mui/material/Chip";
import { t } from "i18next";
import { styles } from "@styles";

const StepperSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const mappedData = [
    { category: "questions", metrics: data.questions },
    { category: "insights", metrics: data.insights },
    { category: "advices", metrics: data.advices },
  ];
  return (
    <Box
      sx={{
        background: "#fff",
        borderRadius: "1rem",
        width: "100%",
        p: 3,
        backgroundColor: "#fff",
        boxShadow: "0 0 8px 0 #0A234240",
      }}
    >
      <Stepper
        sx={{ width: "70%", mx: "auto", mb: "30px" }}
        activeStep={activeStep}
      >
        {mappedData.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          return (
            <Step key={label.category} {...stepProps}>
              <StepLabel
                sx={{
                  color: "red",
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
                {...labelProps}
              />
            </Step>
          );
        })}
      </Stepper>
      <Grid container columns={12}>
        {mappedData.map((item, index) => {
          return (
            <StepBox
              key={index}
              {...item}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              Finish={mappedData.length - 1}
            />
          );
        })}
      </Grid>
    </Box>
  );
};

const StepBox = (props: any) => {
  const { category, metrics, setActiveStep, activeStep, Finish } = props;

  const questions = category == "questions";
  const insights = category == "insights";
  const advices = category == "advices";

  const calcOfIssues = () => {
    if (questions) {
      return Object.keys(metrics).filter(
        (item) => item != "total" && item != "answered",
      ).length;
    } else if (insights) {
      return Object.keys(metrics).filter((item) => item != "total").length;
    }else if (advices) {
        return Object.keys(metrics).filter((item) => item ).length;
    }
  };

  let content;

  const issuesTag = (
    <Chip
      label={t("issues").toUpperCase() + `  ${calcOfIssues()}`}
      size="small"
      sx={{
        ...theme.typography.labelMedium,
        color: "#B8144B",
        background: "#FCE8EF",
      }}
    />
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

  if (questions) {
    const {
      answered,
      hasLowConfidence,
      hasNoEvidence,
      hasUnresolvedComments,
      total,
      unanswered,
    } = metrics;
    const hasIssues =
      hasLowConfidence || hasNoEvidence || hasUnresolvedComments || unanswered;
    const completed = !hasIssues && answered == total;
    if (completed && activeStep == 0) {
      setActiveStep((prev: number) => prev + 1);
    }
    content = (
      <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
        <Typography sx={{ ...theme.typography.headlineLarge }}>
          {`${answered} / ${total} `}
        </Typography>
          <Box sx={{ ...styles.centerCVH, gap: 1 }}>
            {answered == total ? completedTag : currentTag}
            {hasIssues && !completed ? issuesTag : null}
          </Box>
      </Box>
    );
  }

  if (insights) {
    const { unapproved, expired, notGenerated, total } = metrics;
    const hasIssues = unapproved || expired || notGenerated;
    const result = total - (notGenerated + unapproved + expired);
    const completed = !hasIssues && total == result;

    if (completed && activeStep == 1) {
      setActiveStep((prev: number) => prev + 1);
    }

    content = (
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <Typography sx={{ ...theme.typography.headlineLarge }}>
          {`${result} / ${total}`}
        </Typography>
        <Box sx={{ ...styles.centerCVH, gap: 1 }}>
          {completed && completedTag}
          {!completed && activeStep == 1 && currentTag}
          {hasIssues && !completed ? issuesTag : null}
        </Box>
      </Box>
    );
  }

  if (advices) {
    const { total } = metrics;
    const completed = total != 0;
    const hasIssues = total == 0;

      if (completed && activeStep == 2) {
          setActiveStep((prev: number) => prev + 1);
      }

    content = (
      <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
        <Typography sx={{ ...theme.typography.headlineLarge }}>
          {total}
        </Typography>
          <Box sx={{ ...styles.centerCVH, gap: 1 }}>
            {completed && completedTag}
            {!completed && activeStep == 2 && currentTag}
            {hasIssues && !completed ? issuesTag : null}
          </Box>
      </Box>
    );
  }

  return (
    <Grid
      item
      md={4}
      sx={{
        px: "20px",
        py: "10px",
        height: "240px",
        borderRight: insights ? "1px solid #C7CCD1" : "",
        borderLeft: insights ? "1px solid #C7CCD1" : "",
        width: "100%",
        textAlign: "center",
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
        {questions && <Trans i18nKey={"answeredQuestions"} />}
        {insights && <Trans i18nKey={"submittedInsights"} />}
        {advices && <Trans i18nKey={"suggestedAdvices"} />}
      </Typography>
      {content}
    </Grid>
  );
};
export default StepperSection;
