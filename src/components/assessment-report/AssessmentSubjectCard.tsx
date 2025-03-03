import React, { useState, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Trans } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import toastError from "@utils/toastError";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import { getMaturityLevelColors, styles } from "@styles";
import { ISubjectInfo, IMaturityLevel, TId } from "@types";
import { ICustomError } from "@/utils/CustomError";
import ConfidenceLevel from "@/utils/confidenceLevel/confidenceLevel";
import languageDetector from "@/utils/languageDetector";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import DonutChart from "../common/charts/donutChart/donutChart";
import SubjectContainer from "../subject-report-old/SubjectContainer";

interface IAssessmentSubjectCardProps extends ISubjectInfo {
  maturity_level?: IMaturityLevel;
  confidenceValue?: number;
  attributes?: any;
  maturityLevelCount?: number;
}

interface IAssessmentSubjectProgress {
  id: TId;
  title: string;
  questionCount: number;
  answerCount: number;
}

export const AssessmentSubjectAccordion = (
  props: IAssessmentSubjectCardProps,
) => {
  const {
    title,
    maturityLevel,
    maturityLevelCount,
    confidenceValue,
    id,
    attributes,
    description = "",
  } = props;
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const [progress, setProgress] = useState<number>(0);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [subjectAttributes, setSubjectAttributes] = useState<any>([]);
  const isMobileScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down("md"),
  );
  const subjectProgressQueryData = useQuery<IAssessmentSubjectProgress>({
    service: (args = { subjectId: id, assessmentId }, config) =>
      service.fetchSubjectProgress(args, config),
    runOnMount: false,
  });

  const fetchProgress = async () => {
    try {
      const data = await subjectProgressQueryData.query();
      const { answerCount, questionCount } = data;
      const total_progress = ((answerCount ?? 0) / (questionCount ?? 1)) * 100;
      setProgress(total_progress);
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  useEffect(() => {
    fetchProgress();
    fetchAttributes();
  }, []);

  const fetchAttributes = async () => {
    setSubjectAttributes(attributes);
  };

  const theme = useTheme();

  const handleAccordionChange = (
    event: React.SyntheticEvent,
    isExpanded: boolean,
  ) => {
    setExpanded(isExpanded);
    if (isExpanded) {
      fetchAttributes();
    }
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={handleAccordionChange}
      sx={{
        borderRadius: "12px !important",
        boxShadow: "0px 0px 8px 0px rgba(10, 35, 66, 0.25)",
        transition: "background-position .4s ease",
        position: "relative",
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        sx={{
          borderTopLeftRadius: "12px !important",
          borderTopRightRadius: "12px !important",
          textAlign: "center",
          backgroundColor: expanded ? "#E9ECF0" : "",
          "& .MuiAccordionSummary-content": {
            maxHeight: { md: "160px", lg: "160px" },
            paddingLeft: { md: "1rem", lg: "1rem" },
          },
        }}
      >
        <Grid
          container
          alignItems="center"
          onClick={(e) => e.stopPropagation()}
          component={Link}
          to={progress === 100 ? `./${id}#insight` : `./${id}`}
          sx={{ textDecoration: "none", color: "inherit" }}
        >
          <Grid item xs={12} lg={3.5} md={3.5} sm={12}>
            <Box sx={{ ...styles.centerCVH }} gap={1}>
              <Box
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                <Typography
                  color="#243342"
                  sx={{
                    textTransform: "none",
                    whiteSpace: "pre-wrap",
                    fontFamily: languageDetector(title)
                      ? farsiFontFamily
                      : primaryFontFamily,
                  }}
                  variant="headlineMedium"
                >
                  {title}
                </Typography>
              </Box>
              <Typography variant="bodyMedium">
                {"("}
                <Trans i18nKey="weight" />: {maturityLevel?.value} {")"}
              </Typography>
            </Box>
          </Grid>

          {!isMobileScreen && (
            <Grid item xs={12} lg={4.5} md={4.5} sm={12}>
              <Box
                sx={{
                  maxHeight: "100px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textAlign: "start",
                  width: "100%",
                  whiteSpace: "pre-wrap",
                }}
              >
                <Typography
                  variant="titleMedium"
                  fontWeight={400}
                  color="#243342"
                  sx={{
                    textTransform: "none",
                    whiteSpace: "break-spaces",
                    fontFamily: languageDetector(description)
                      ? farsiFontFamily
                      : primaryFontFamily,
                  }}
                >
                  {description}
                </Typography>
              </Box>
            </Grid>
          )}
          <Grid item xs={12} lg={1} md={1} sm={12}></Grid>
          {isMobileScreen && (
            <Grid item xs={12} lg={2} md={2} sm={12}>
              <SubjectStatus title={title} maturity_level={maturityLevel} />
            </Grid>
          )}
          <Grid item xs={12} lg={1.5} md={1.5} sm={12}>
            <Box
              sx={{
                ...styles.centerCVH,
                gap: 1,
                width: "100%",
              }}
            >
              <Typography
                sx={{
                  display: "flex",
                  gap: "5px",
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  color: getMaturityLevelColors(maturityLevelCount ?? 5)[
                    (maturityLevel?.value ?? 1) - 1
                  ],
                  fontFamily: languageDetector(maturityLevel?.title ?? "")
                    ? farsiFontFamily
                    : primaryFontFamily,
                }}
              >
                {maturityLevel?.title}
              </Typography>
              <Box
                sx={{
                  ...styles.centerVH,
                  gap: 0.1,
                  width: "100%",
                }}
              >
                <Typography variant="bodyMedium" color="#6C8093">
                  <Trans i18nKey="confidence" />:
                </Typography>
                <ConfidenceLevel
                  inputNumber={confidenceValue}
                  displayNumber
                  variant="titleSmall"
                />
              </Box>
            </Box>
          </Grid>
          {!isMobileScreen && (
            <Grid item xs={6} lg={1.5} md={1.5} sm={12}>
              <SubjectStatus
                title={title}
                maturity_level={maturityLevel}
                maturityLevelCount={maturityLevelCount}
              />
            </Grid>
          )}
        </Grid>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: 4 }}>
        {expanded && <SubjectContainer subjectId={id} />}{" "}
      </AccordionDetails>
    </Accordion>
  );
};

const SubjectStatus = (
  props: Pick<
    IAssessmentSubjectCardProps,
    "title" | "maturity_level" | "maturityLevelCount"
  >,
) => {
  const { maturity_level, maturityLevelCount } = props;
  const hasStats = Boolean(maturity_level?.index);

  return (
    <Box>
      {hasStats ? (
        <DonutChart
          maturityLevelNumber={maturityLevelCount ?? 5}
          levelValue={maturity_level?.value ?? 1}
          text={maturity_level?.title ?? ""}
          displayTitle={false}
          height="100"
        />
      ) : (
        <Typography>
          <Trans i18nKey="notEvaluated" />
        </Typography>
      )}
    </Box>
  );
};
