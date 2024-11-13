import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Title from "@common/Title";
import Typography from "@mui/material/Typography";
import SubjectOverallStatusLevelChart from "./SubjectOverallStatusLevelChart";
import { SubjectInsight } from "./SubjectInsight";

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
  const {
    subject,
    attributes,
    topStrengths,
    topWeaknesses,
    maturityLevelsCount,
  } = data;
  const { title, maturityLevel, confidenceValue } = subject;
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
      <Typography variant="headlineSmall" mx={4} mt={4}>
        <Trans i18nKey="subjectBriefConclusion" />
      </Typography>
      <SubjectInsight />
      <Grid container pt={5} spacing={4}>
        <Grid item xs={12} sm={6} md={5} lg={4}>
          <MostSigItems
            color="#005e00"
            text="strengths"
            loading={loading}
            att={topStrengths}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={5} lg={4}>
          <MostSigItems
            color="#b10202"
            text="weaknesses"
            loading={loading}
            att={topWeaknesses}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export const MostSigItems = ({
  loading,
  att,
  items,
  color,
  text,
}: {
  loading: boolean;
  att?: any[];
  items?: string[];
  color: string;
  text: string;
}) => {
  return (
    <>
      <Title
        fontSize={"1.1rem"}
        borderBottom={true}
        color={color}
        letterSpacing={".08em"}
      >
        <Trans i18nKey={text} />
      </Title>
      <ul style={{ marginBlockStart: "8px", paddingInlineStart: "26px" }}>
        {loading ? (
          <MostSigItemLoadingSkeleton />
        ) : (
          (att || items)?.map((item: any, index: any) => {
            return <li key={item?.id}>{att ? item?.title : item}</li>;
          })
        )}
      </ul>
    </>
  );
};

const MostSigItemLoadingSkeleton = () => {
  return (
    <>
      {[1, 2, 3].map((k) => (
        <Skeleton key={k} />
      ))}
    </>
  );
};

export default SubjectOverallInsight;
