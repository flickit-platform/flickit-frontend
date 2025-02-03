import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import SubjectOverallStatusLevelChart from "./SubjectOverallStatusLevelChart";
import { SubjectInsight } from "./SubjectInsight";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import { ICustomError } from "@utils/CustomError";
import toastError from "@utils/toastError";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import { useParams } from "react-router-dom";
import { styles } from "@styles";
const SubjectOverallInsight = (props: any) => {
  return (
    <Box>
      <Box display="flex" sx={{ flexDirection: { xs: "column", sm: "row" } }}>
        <OverallInsightText {...props} />
        <Box sx={{ pl: { xs: 0, sm: 3, md: 6 }, mt: { xs: 4, sm: 0 } }}>
          <SubjectOverallStatusLevelChart {...props} />
        </Box>
      </Box>
    </Box>
  );
};

const OverallInsightText = (props: any) => {
  const { data = {}, loading } = props;
  const [isApproved, setIsApproved] = useState(true);
  const [insight, setInsight] = useState<any>(null);
  const [isAccessorInsight, setIsAccessorInsight] = useState<any>(false);
  const [editable, setEditable] = useState(false);
  const [AssessmentLoading, setAssessmentLoading] = useState(true);

  const { service } = useServiceContext();

  const { subject, attributes, maturityLevelsCount } = data;
  const { title, maturityLevel, confidenceValue } = subject;
  const { assessmentId = "", subjectId = "" } = useParams();

  const ApproveAISubject = useQuery({
    service: (
      args = {
        assessmentId,
        subjectId,
      },
      config,
    ) => service.ApproveAISubject(args, config),
    runOnMount: false,
  });

  const InitInsight = useQuery({
    service: (
      args = {
        assessmentId,
        subjectId,
      },
      config,
    ) => service.InitInsight(args, config),
    runOnMount: false,
  });

  const fetchAssessment = () => {
    service
      .fetchSubjectInsight({ assessmentId, subjectId }, {})
      .then((res) => {
        const data = res.data;
        const selectedInsight = data.assessorInsight || data.defaultInsight;
        if (selectedInsight) {
          setIsApproved(data.approved);
          setInsight(selectedInsight);
          setEditable(data.editable ?? false);
          setIsAccessorInsight(data.assessorInsight ? true : false);
        }
      })
      .catch((error) => {
        console.error("Error fetching assessment insight:", error);
      })
      .finally(() => {
        setAssessmentLoading(false);
      });
  };

  const ApproveSubject = async (event: React.SyntheticEvent) => {
    try {
      event.stopPropagation();
      await ApproveAISubject.query();
      fetchAssessment();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  return (
    <Box display="flex" flexDirection={"column"} flex={1}>
      <Typography variant="titleLarge" sx={{ opacity: 0.96 }}>
        {loading ? (
          <Skeleton height="60px" />
        ) : (
          <>
            <Trans i18nKey="withConfidenceSubject" />{" "}
            <Typography
              component="span"
              variant="titleLarge"
              sx={{ color: "#3596A1" }}
            >
              <Trans
                i18nKey={"clOf"}
                values={{
                  cl: Math.ceil(confidenceValue),
                  clDivider: 100,
                }}
              />
            </Typography>{" "}
            <Trans i18nKey="wasEstimate" values={{ title }} />{" "}
            <Typography
              component="span"
              variant="titleLarge"
              sx={{ color: "#6035A1" }}
            >
              <Trans
                i18nKey={"divider"}
                values={{
                  cl: Math.ceil(maturityLevel.index),
                  clDivider: Math.ceil(maturityLevelsCount),
                }}
              />
            </Typography>{" "}
            <Trans i18nKey="meaning" values={{ title }} />{" "}
            <Typography component="span" variant="titleLarge">
              <Trans i18nKey={`${maturityLevel.title}`} />
            </Typography>
            <Trans i18nKey="is" />{" "}
            <Box>
              <Typography variant="body2">
                <Trans
                  i18nKey="attributesAreConsidered"
                  values={{ length: attributes?.length }}
                />
              </Typography>
            </Box>
          </>
        )}
      </Typography>
      <Box sx={{ ...styles.centerV, mt: 4, mb: 2, marginInlineStart: 3 }}>
        <Typography variant="headlineSmall">
          <Trans i18nKey="subjectBriefConclusion" />
        </Typography>
        <Box sx={{ ...styles.centerV, marginInlineStart: "auto", gap: 1 }}>
          {!isApproved && (
            <LoadingButton
              variant={"contained"}
              onClick={(event) => ApproveSubject(event)}
              loading={ApproveAISubject.loading}
              size="small"
            >
              <Trans i18nKey={"approve"} />
            </LoadingButton>
          )}
          {editable && isAccessorInsight && (
            <LoadingButton
              onClick={(event) => {
                event.stopPropagation();
                InitInsight.query().then(() => fetchAssessment());
              }}
              variant={"contained"}
              loading={InitInsight.loading}
              size="small"
            >
              <Trans i18nKey={"generate"} />
            </LoadingButton>
          )}
        </Box>
      </Box>
      <SubjectInsight
        AssessmentLoading={AssessmentLoading}
        fetchAssessment={fetchAssessment}
        editable={editable}
        insight={insight}
      />
    </Box>
  );
};
export default SubjectOverallInsight;
