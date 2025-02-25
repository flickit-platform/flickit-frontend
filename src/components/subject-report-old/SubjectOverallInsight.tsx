import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import SubjectOverallStatusLevelChart from "./SubjectOverallStatusLevelChart";
import { LoadingButton } from "@mui/lab";
import { useEffect, useRef, useState } from "react";
import { ICustomError } from "@utils/CustomError";
import toastError from "@utils/toastError";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import { useParams } from "react-router-dom";
import { styles } from "@styles";
import CircularProgress from "@mui/material/CircularProgress";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { format } from "date-fns";
import { convertToRelativeTime } from "@/utils/convertToRelativeTime";
import { theme } from "@/config/theme";
import { t } from "i18next";
import { EditableRichEditor } from "../common/fields/EditableRichEditor";

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
  const abortController = useRef(new AbortController());

  const [isApproved, setIsApproved] = useState(true);
  const [insight, setInsight] = useState<any>(null);
  const [editable, setEditable] = useState(false);
  const [isSystemic, setIsSystemic] = useState(true);

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

  const fetchSubjectInsight = useQuery<any>({
    service: (args, config) =>
      service.fetchSubjectInsight({ assessmentId, subjectId }, {}),
    toastError: false,
  });

  const ApproveSubject = async (event: React.SyntheticEvent) => {
    try {
      event.stopPropagation();
      await ApproveAISubject.query();
      fetchSubjectInsight.query();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  useEffect(() => {
    const data = fetchSubjectInsight.data;
    const selectedInsight = data?.assessorInsight || data?.defaultInsight;

    if (selectedInsight) {
      setIsSystemic(data?.defaultInsight ?? false);
      setInsight(selectedInsight);
      setIsApproved(data?.approved);
    }
    setEditable(data?.editable ?? false);
  }, [fetchSubjectInsight.data]);
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
      <Box
        sx={{
          ...styles.centerV,
          mt: 4,
          mb: 2,
          marginInline: 3,
          justifyContent: "space-between",
        }}
      >
        <Typography variant="headlineSmall">
          <Trans i18nKey="subjectBriefConclusion" />
        </Typography>
        <Box sx={{ ...styles.centerV, gap: 1 }}>
          {(!isApproved || (!insight?.isValid && insight)) && editable && (
            <LoadingButton
              variant={"contained"}
              onClick={(event) => ApproveSubject(event)}
              loading={ApproveAISubject.loading}
              size="small"
            >
              <Trans i18nKey={"approve"} />
            </LoadingButton>
          )}
          {editable && (
            <LoadingButton
              onClick={(event) => {
                event.stopPropagation();
                InitInsight.query().then(() => fetchSubjectInsight.query());
              }}
              variant={"contained"}
              loading={InitInsight.loading}
              size="small"
            >
              <Trans i18nKey={!insight ? "generate" : "regenerate"} />
            </LoadingButton>
          )}
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        maxHeight="100%"
        gap={0.5}
        ml={3}
      >
        {fetchSubjectInsight.loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <EditableRichEditor
              defaultValue={insight?.insight}
              editable={editable}
              fieldName="insight"
              onSubmit={async (payload: any, event: any) => {
                await service.updateSubjectInsight(
                  {
                    assessmentId,
                    data: { insight: payload?.insight },
                    subjectId,
                  },
                  { signal: abortController.current.signal },
                );
              }}
              infoQuery={fetchSubjectInsight.query}
              placeholder={
                t("writeHere", {
                  title: t("insight").toLowerCase(),
                }) ?? ""
              }
            />
            {insight?.creationTime && (
              <Typography variant="bodyMedium" mx={1}>
                {format(
                  new Date(
                    new Date(insight?.creationTime).getTime() -
                      new Date(insight?.creationTime).getTimezoneOffset() *
                        60000,
                  ),
                  "yyyy/MM/dd HH:mm",
                ) +
                  " (" +
                  t(convertToRelativeTime(insight?.creationTime)) +
                  ")"}
              </Typography>
            )}
            {(!isApproved || (!insight?.isValid && insight)) && (
              <Box sx={{ ...styles.centerV }} gap={2} my={1}>
                <Box
                  sx={{
                    zIndex: 1,
                    display: "flex",
                    justifyContent: "flex-start",
                    ml: { xs: 0.75, sm: 0.75, md: 1 },
                  }}
                >
                  <Typography
                    variant="labelSmall"
                    sx={{
                      backgroundColor: "#d85e1e",
                      color: "white",
                      padding: "0.35rem 0.35rem",
                      borderRadius: "4px",
                      fontWeight: "bold",
                    }}
                  >
                    <Trans i18nKey={isSystemic ? "note" : "outdated"} />
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    backgroundColor: "rgba(255, 249, 196, 0.31)",
                    padding: 1,
                    borderRadius: 2,
                    maxWidth: "100%",
                  }}
                >
                  <InfoOutlined
                    color="primary"
                    sx={{
                      marginRight: theme.direction === "ltr" ? 1 : "unset",
                      marginLeft: theme.direction === "rtl" ? 1 : "unset",
                    }}
                  />
                  <Typography
                    variant="titleMedium"
                    fontWeight={400}
                    textAlign="left"
                  >
                    <Trans
                      i18nKey={
                        isSystemic ? "defaultInsightTemplate" : "invalidInsight"
                      }
                    />
                  </Typography>
                </Box>
              </Box>
            )}
          </>
        )}
      </Box>{" "}
    </Box>
  );
};
export default SubjectOverallInsight;
