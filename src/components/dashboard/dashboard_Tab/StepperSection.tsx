import Box from "@mui/material/Box";
import { Step, StepLabel, Stepper, Typography } from "@mui/material";
import { Trans } from "react-i18next";
import { theme } from "@config/theme";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import { t } from "i18next";
import { styles } from "@styles";
import {uniqueId} from "lodash";

interface IStepperSection {
    setActiveStep: any;
    activeStep: number;
    stepData: { category: string; metrics: { [p: string]: any }}[]
}
interface IStepBox {
    category :string;
    metrics : {[p:string] : any};
    setActiveStep: any;
    activeStep: number
}


const StepperSection = (props: IStepperSection) => {
  const { setActiveStep, activeStep, stepData } = props;

  return (
    <Box
      sx={{
        background: "#fff",
        borderRadius: "1rem",
        width: "100%",
        py: 4,
        backgroundColor: "#fff",
        boxShadow: "0 0 8px 0 #0A234240",
      }}
    >
      <Stepper
        sx={{ width: "70%", mx: "auto", mb: "30px" }}
        activeStep={activeStep}
      >
        {stepData.map((label : any, index : number) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          return (
            <Step key={uniqueId()} {...stepProps}>
              <StepLabel
                StepIconProps={{ style: { fontSize: "2rem" } }}
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
        {stepData.map((item: {category: string, metrics: any} , index: number) => {
          return (
            <StepBox
              key={uniqueId()}
              {...item}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
            />
          );
        })}
      </Grid>
    </Box>
  );
};

const StepBox = (props: IStepBox) => {
  const { category, metrics, setActiveStep, activeStep } = props;

  const questions = category == "questions";
  const insights = category == "insights";
  const advices = category == "advices";

  const calcOfIssues = () => {
    if (questions) {
      return Object.keys(metrics).filter(
        (item) => item != "total" && item != "answered" && metrics[item],
      ).length;
    } else if (insights) {
      return Object.keys(metrics).filter(
        (item) => item != "expected" && metrics[item],
      ).length;
    } else if (advices) {
      return Object.keys(metrics).filter((item) => item).length;
    }
  };

  let content;

  const issuesTag = (
    <Chip
      label={`  ${calcOfIssues()}  ` + t( (calcOfIssues() || 0) > 1 ? "issues" : "issue").toUpperCase()}
      size="small"
      sx={{
        ...theme.typography.labelMedium,
        color: "#B8144B",
        background: "#FCE8EF",
        direction: theme.direction
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
      answeredWithLowConfidence,
      withoutEvidence,
      unresolvedComments,
      total,
      unanswered,
    } = metrics;
    const hasIssues =
      answeredWithLowConfidence || withoutEvidence || unresolvedComments || unanswered;
    const completed = answered == total;
    if (completed && activeStep == 0) {
      setActiveStep((prev: number) => prev + 1);
    }
    content = (
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
          <Typography sx={{ ...theme.typography.headlineLarge }}>
            {`${answered} / ${total} `}
          </Typography>
          <Box sx={{ ...styles.centerCVH, gap: 1 }}>
            {answered == total ? completedTag : currentTag}
            {hasIssues ? issuesTag : null}
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
          }}
        >
          <Typography
            sx={{ ...theme.typography.labelMedium, color: "#2D80D2" }}
          >
            {Math.floor((100 * answered) / total)} %
          </Typography>
          <Typography
            sx={{ ...theme.typography.labelMedium, color: "#3D4D5C80" }}
          >
            {t("totalQuestionsCount", { countQuestion: total })}
          </Typography>
        </Box>
      </Box>
    );
  }

  if (insights) {
    const { unapproved, expired, notGenerated, expected } = metrics;
    const hasIssues = unapproved || expired || notGenerated;
    const result = (expected - (notGenerated + expired));
    const completed = activeStep >= 1 && expected == result;

    if (completed && activeStep == 1) {
      setActiveStep((prev: number) => prev + 1);
    }

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
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Typography sx={{ ...theme.typography.headlineLarge }}>
            {`${result} / ${expected}`}
          </Typography>
          <Box sx={{ ...styles.centerCVH, gap: 1 }}>
            {completed && completedTag}
            {!completed && activeStep == 1 && currentTag}
            {hasIssues  ? issuesTag : null}
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
          }}
        >
          <Typography
            sx={{ ...theme.typography.labelMedium, color: "#2D80D2" }}
          >
            {Math.floor((100 * result) / expected)}%
          </Typography>
          <Typography
            sx={{ ...theme.typography.labelMedium, color: "#3D4D5C80" }}
          >
            {t("totalInsightsCount", { countInsights: expected })}
          </Typography>
        </Box>
      </Box>
    );
  }

  if (advices) {
    const { total } = metrics;
    const completed = activeStep >= 2 && total != 0;
    const hasIssues = total == 0;

    if (completed && activeStep == 2) {
      setActiveStep((prev: number) => prev + 1);
    }

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
          <Typography sx={{ ...theme.typography.headlineLarge }}>
            {total}
          </Typography>
          {((completed && activeStep >= 2) || hasIssues) && (
            <Box sx={{ ...styles.centerCVH, gap: 1 }}>
              {completed && activeStep >= 2 && completedTag}
              {!completed && activeStep == 2 && currentTag}
              {hasIssues && !completed ? issuesTag : null}
            </Box>
          )}
        </Box>
        <Typography
          sx={{ ...theme.typography.labelMedium, color: "#3D4D5C80" }}
        >
          {activeStep == 0 || activeStep == 1
            ? t("suggestingAnyAdvices").toUpperCase()
            : null}
        </Typography>
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
        borderRight: { md: insights ? "1px solid #C7CCD1" : "" },
        borderLeft: { md: insights ? "1px solid #C7CCD1" : "" },
        borderTop: { xs: insights ? "1px solid #C7CCD1" : "", md: "none" },
        borderBottom: { xs: insights ? "1px solid #C7CCD1" : "", md: "none" },
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
        {questions && <Trans i18nKey={"answeredQuestionsTitle"} />}
        {insights && <Trans i18nKey={"submittedInsights"} />}
        {advices && <Trans i18nKey={"suggestedAdvices"} />}
      </Typography>
      {content}
    </Grid>
  );
};
export default StepperSection;
