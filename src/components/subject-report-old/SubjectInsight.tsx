import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { useServiceContext } from "@/providers/ServiceProvider";
import { format } from "date-fns";
import { convertToRelativeTime } from "@/utils/convertToRelativeTime";
import { styles } from "@styles";
import { theme } from "@/config/theme";
import { t } from "i18next";
import { OnHoverRichEditor } from "../assessment-report/AssessmentInsight";

interface ISubjectInsight {
  AssessmentLoading: boolean;
  isApproved: boolean;
  fetchAssessment: () => void;
  editable: boolean;
  insight: any;
  isSystemic: any;
}

export const SubjectInsight = (props: ISubjectInsight) => {
  const {
    AssessmentLoading,
    fetchAssessment,
    editable,
    insight,
    isSystemic,
    isApproved,
  } = props;
  const { service } = useServiceContext();
  const { subjectId = "" } = useParams();

  useEffect(() => {
    fetchAssessment();
  }, [subjectId, service, editable]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      maxHeight="100%"
      gap={0.5}
      ml={3}
    >
      {AssessmentLoading ? (
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
          <OnHoverRichEditor
            data={insight?.insight}
            editable={editable}
            infoQuery={fetchAssessment}
            placeholder={t("writeHere", {
              title: t("insight").toLowerCase(),
            })}
          />
          {insight?.creationTime && (
            <Typography variant="bodyMedium" mx={1}>
              {format(
                new Date(
                  new Date(insight?.creationTime).getTime() -
                    new Date(insight?.creationTime).getTimezoneOffset() * 60000,
                ),
                "yyyy/MM/dd HH:mm",
              ) +
                " (" +
                t(convertToRelativeTime(insight?.creationTime)) +
                ")"}
            </Typography>
          )}
          {!isApproved && insight && (
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
    </Box>
  );
};