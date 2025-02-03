import Box from "@mui/material/Box";
import { Step, StepLabel, Stepper, Typography } from "@mui/material";
import { Trans } from "react-i18next";
import { theme } from "@config/theme";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import { t } from "i18next";
import { styles } from "@styles";
import { uniqueId } from "lodash";
import { Link } from "react-router-dom";
import MLink from "@mui/material/Link";

interface IStepperSection {
  setActiveStep: any;
  activeStep: number;
  stepData: { category: string; metrics: { [p: string]: any } }[];
}
interface IStepBox {
  category: string;
  metrics: { [p: string]: any };
  setActiveStep: any;
  activeStep: number;
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
        {stepData.map((label: any, index: number) => {
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
        {stepData.map(
          (item: { category: string; metrics: any }, index: number) => {
            return (
              <StepBox
                key={uniqueId()}
                {...item}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
              />
            );
          },
        )}
      </Grid>
    </Box>
  );
};

const StepBox = (props: IStepBox) => {
  const { category, metrics, setActiveStep, activeStep } = props;

  const questions = category == "questions";
  const insights = category == "insights";
  const advices = category == "advices";
  const report = category == "report";

  const calcOfIssues = () => {
    if (questions) {
      return Object.entries(metrics)
        .filter(
          ([key]) => key !== "total" && key !== "answered" && metrics[key],
        )
        .reduce((acc, [_, value]) => acc + value, 0);
    } else if (insights) {
      return Object.entries(metrics)
        .filter(([key]) => key != "expected" && metrics[key])
        .reduce((acc, [_, value]) => acc + value, 0);
    } else if (advices) {
      return Object.keys(metrics).filter((item) => item).length;
    } else if (report) {
      return Object.entries(metrics)
        .filter(
          ([key]) =>
            key != "totalMetadata" && key != "providedMetadata" && metrics[key],
        )
        .reduce((acc, [_, value]) => acc + value, 0);
    }
  };

  let content;

  const issuesTag = (text: string) => {
    return (
      <MLink
        sx={{ textDecoration: "none" }}
        onClick={(e) => e.stopPropagation()}
        href={`#${text}`}
      >
        <Chip
          label={
            <Box sx={{ ...styles.centerVH, gap: 1 }}>
              <Typography
                sx={{ ...theme.typography.labelMedium }}
              >{`  ${calcOfIssues()}  `}</Typography>
              <Typography sx={{ ...theme.typography.labelSmall }}>
                {t(
                  (calcOfIssues() || 0) > 1 ? "issues" : "issue",
                ).toUpperCase()}
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
      </MLink>
    );
  };

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
      answeredWithLowConfidence ||
      withoutEvidence ||
      unresolvedComments ||
      unanswered;
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
          <Typography variant="headlineLarge">
            {`${answered} / ${total} `}
          </Typography>
          <Box sx={{ ...styles.centerCVH, gap: 1 }}>
            {answered == total ? completedTag : currentTag}
            {hasIssues ? issuesTag("questions") : null}
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
    const hasIssues = unapproved || expired || notGenerated;
    const result = expected - notGenerated;
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
          <Typography variant="headlineLarge">
            {`${result} / ${expected}`}
          </Typography>
          <Box sx={{ ...styles.centerCVH, gap: 1 }}>
            {completed && completedTag}
            {!completed && activeStep == 1 && currentTag}
            {hasIssues ? issuesTag("insights") : null}
          </Box>
        </Box>
        <Box
          sx={{
            ...styles.centerVH,
            gap: "4px",
          }}
        >
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
              {hasIssues && !completed ? issuesTag("advices") : null}
            </Box>
          )}
        </Box>
      </Box>
    );
  }

  if (report) {
    const { unprovidedMetadata, unpublished, providedMetadata, totalMetadata } =
      metrics;
    const completed =
      activeStep >= 3 &&
      providedMetadata == totalMetadata &&
      unpublished === false;

    const hasIssues = unprovidedMetadata >= 1 || unpublished;

    if (completed && activeStep == 3) {
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
          <Typography variant="headlineLarge">
            {`${providedMetadata} / ${totalMetadata} `}
          </Typography>
          <Box sx={{ ...styles.centerCVH, gap: 1 }}>
            {completed && activeStep >= 3 && completedTag}
            {!completed && activeStep == 3 && currentTag}
            {hasIssues ? issuesTag("report") : null}
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
          ? `../questionnaires/`
          : insights
            ? "../insights"
            : advices
              ? "../advices"
              : "../report"
      }
      item
      md={3}
      sx={{
        px: "20px",
        py: "10px",
        height: "190px",
        borderRight: { md: insights || report  ? "1px solid #C7CCD1" : "" },
        borderLeft: { md: insights || report ? "1px solid #C7CCD1" : "" },
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
            <Trans i18nKey={"answeredQuestionsTitle"} />
          </Typography>
        )}
        {insights && (
          <Typography variant="semiBoldXLarge">
            <Trans i18nKey={"submittedInsights"} />
          </Typography>
        )}
        {advices && (
          <Typography variant="semiBoldXLarge">
            <Trans i18nKey={"suggestedAdvices"} />
          </Typography>
        )}
        {report && (
          <Typography variant="semiBoldXLarge">
            <Trans i18nKey={"preparingReport"} />
          </Typography>
        )}
      </Typography>
      {content}
    </Grid>
  );
};
export default StepperSection;
