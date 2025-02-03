import React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { Trans } from "react-i18next";
import { theme } from "@config/theme";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Grid from "@mui/material/Grid";
import { uniqueId } from "lodash";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";

const TodoBox = (props: any) => {
  const { todoBoxData } = props;
  const { now, next } = todoBoxData;
  return (
    <Box sx={{ mt: "50px" }}>
      {now?.length > 0 && (
        <Box sx={{ mb: "30px" }}>
          <Typography
            sx={{
              ...theme.typography.headlineSmall,
              display: "flex",
              alignItems: "center",
              color: "#2B333B",
              gap: 1,
              mb: "40px",
            }}
          >
            <Trans i18nKey={"whatToDoNow"} />
            <Tooltip title={<Trans i18nKey={"whatToDoNowTooltip"} />}>
              <InfoOutlinedIcon sx={{ cursor: "pointer" }} fontSize={"small"} />
            </Tooltip>
          </Typography>
          {now.map((item: any) => {
            return (
              <React.Fragment key={uniqueId()}>
                <Box
                  id={item.name}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: "23px",
                  }}
                >
                  <Typography
                    sx={{ ...theme.typography.semiBoldLarge, color: "#2B333B" }}
                  >
                    {item.name == "questions" && (
                      <Trans i18nKey={"questionsIssues"} />
                    )}
                    {item.name == "insights" && (
                      <Trans i18nKey={"insightsIssues"} />
                    )}
                    {item.name == "advices" && (
                      <Trans i18nKey={"advicesIssues"} />
                    )}
                    {item.name == "report" && (
                      <Trans i18nKey={"reportIssues"} />
                    )}
                  </Typography>
                </Box>
                <Grid container columns={12} spacing={2} mb={"40px"}>
                  {Object.entries(item)
                    .filter(([key]) => key !== "name")
                    .map(([key, value]) => {
                      return (
                        <Grid item xs={12} md={6} key={uniqueId()}>
                          <IssuesItem
                            originalName={item.name}
                            key={key}
                            name={key}
                            value={value}
                          />
                        </Grid>
                      );
                    })}
                </Grid>
              </React.Fragment>
            );
          })}
        </Box>
      )}
      {next?.length > 0 && (
        <>
          <Typography
            sx={{
              ...theme.typography.headlineSmall,
              display: "flex",
              alignItems: "center",
              color: now.length < 0 ? "#2B333B" : "#3D4D5C80",
              gap: 1,
              mb: "40px",
            }}
          >
            <Trans i18nKey={"whatToDoNext"} />
            <Tooltip title={<Trans i18nKey={"whatToDoNextTooltip"} />}>
              <InfoOutlinedIcon sx={{ cursor: "pointer" }} fontSize={"small"} />
            </Tooltip>
          </Typography>
          {next.map((item: any, index: number) => {
            return (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: "23px",
                  }}
                  id={item.name}
                >
                  <Typography
                    sx={{
                      ...theme.typography.semiBoldLarge,
                      color: now.length < 0 ? "#2B333B" : "#3D4D5C80",
                    }}
                  >
                    {item.name == "questions" && (
                      <Trans i18nKey={"questionsIssues"} />
                    )}
                    {item.name == "insights" && (
                      <Trans i18nKey={"insightsIssues"} />
                    )}
                    {item.name == "advices" && (
                      <Trans i18nKey={"advicesIssues"} />
                    )}
                    {item.name == "report" && (
                      <Trans i18nKey={"reportIssues"} />
                    )}
                  </Typography>
                </Box>
                <Grid container columns={12} spacing={2} mb={"40px"}>
                  {Object.entries(item)
                    .filter(([key]) => key !== "name")
                    .map(([key, value], index: number) => {
                      return (
                        <Grid key={uniqueId()} item xs={12} md={6}>
                          <IssuesItem
                            name={key}
                            value={value}
                            now={now}
                            next={next}
                            originalName={item.name}
                          />
                        </Grid>
                      );
                    })}
                </Grid>
              </>
            );
          })}
        </>
      )}
    </Box>
  );
};

const IssuesItem = (props: any) => {
  const { name, value, now, next, originalName } = props;
  const navigate = useNavigate();
  const link = originalName == "questions" && "questionnaires";

  const filteredQuestionnaire = (name: string) => {
    let newName = name;
    if (name == "withoutEvidence") {
      newName = "answeredWithoutEvidence";
    }
    if (originalName == "questions") {
      navigate(`../${link}`, { state: newName });
    }
  };

  return (
    <Box
      onClick={() => filteredQuestionnaire(name)}
      sx={{
        p: 2,
        borderRadius: 2,
        border: "1px solid #C7CCD1",
        background: now?.length > 0 && next?.length > 0 ? "#F3F5F6" : "#EAF2FB",
        display: "flex",
        alignItems: "center",
        gap: 1,
        textDecoration: "none",
        cursor: originalName == "questions" ? "pointer" : "unset",
      }}
    >
      <InfoOutlinedIcon
        style={
          now?.length > 0 && next?.length > 0
            ? { fill: "#8A0F24" }
            : { fill: "#0072ea" }
        }
      />
      <Typography
        sx={{
          ...theme.typography.semiBoldMedium,
          color: now?.length > 0 && next?.length > 0 ? "#6C8093" : "#2B333B",
          display: "flex",
          gap: 1,
        }}
      >
        {value != 0 ? <Box>{value}</Box> : null}
        {name == "unanswered" &&
          (value > 1 ? (
            <Trans i18nKey={"needForAnswers"} />
          ) : (
            <Trans i18nKey={"needsForAnswer"} />
          ))}
        {name == "answeredWithLowConfidence" &&
          (value > 1 ? (
            <Trans i18nKey={"questionsConfidenceAnswers"} />
          ) : (
            <Trans i18nKey={"questionConfidenceAnswer"} />
          ))}
        {name == "withoutEvidence" &&
          (value > 1 ? (
            <Trans i18nKey={"lackForEvidences"} />
          ) : (
            <Trans i18nKey={"lackForEvidence"} />
          ))}
        {name == "unresolvedComments" &&
          (value > 1 ? (
            <Trans i18nKey={"UnresolvedComments"} />
          ) : (
            <Trans i18nKey={"UnresolvedComment"} />
          ))}
        {name == "notGenerated" && (
          <Trans i18nKey={"insightsNeedToBeGenerated"} />
        )}
        {name == "unapproved" &&
          (value > 1 ? (
            <Trans i18nKey={"insightsNeedApprovement"} />
          ) : (
            <Trans i18nKey={"insightNeedApprovement"} />
          ))}
        {name == "expired" &&
          (value > 1 ? (
            <Trans i18nKey={"expiredDueToNewAnswers"} />
          ) : (
            <Trans i18nKey={"expiredDueToNewAnswer"} />
          ))}
        {name == "unprovidedMetadata" &&
          (value > 1 ? (
            <Trans i18nKey={"metadataAreNotProvider"} />
          ) : (
            <Trans i18nKey={"metadataIsNotProvider"} />
          ))}
        {name == "unpublished" && <Trans i18nKey={"unpublishedReport"} />}
        {name == "total" && <Trans i18nKey={"suggestAnyAdvicesSoFar"} />}
      </Typography>
    </Box>
  );
};

export default TodoBox;
