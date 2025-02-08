import React from "react";
import Box from "@mui/material/Box";
import { IconButton, Typography } from "@mui/material";
import { Trans } from "react-i18next";
import { theme } from "@config/theme";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Grid from "@mui/material/Grid";
import { uniqueId } from "lodash";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import { styles } from "@styles";

const TodoBox = (props: any) => {
  const { todoBoxData } = props;
  const { now, next } = todoBoxData;
  return (
    <Box sx={{ mt: "40px" }}>
      {now?.length > 0 && (
        <Box
          sx={{
            ...styles.boxStyle,
          }}
        >
          {" "}
          <Box sx={{ ...styles.centerV, mt: "-6px" }}>
            <Typography
              sx={{
                ...theme.typography.headlineSmall,
              }}
            >
              <Trans i18nKey="whatToDoNow" />
            </Typography>
            <Tooltip title={<Trans i18nKey="whatToDoNowTooltip" />}>
              <IconButton size="small" color="primary">
                <InfoOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Box>
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
                    mt: "32px",
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
                <Grid container columns={12} spacing={2}>
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
        <Box
          sx={{
            ...styles.boxStyle,
          }}
        >
          {" "}
          <Box sx={{ ...styles.centerV, mt: "-6px" }}>
            <Typography
              sx={{
                ...theme.typography.headlineSmall,
                color: now.length < 0 ? "#2B333B" : "#3D4D5C80",
              }}
            >
              <Trans i18nKey="whatToDoNext" />
            </Typography>
            <Tooltip title={<Trans i18nKey="whatToDoNextTooltip" />}>
              <IconButton
                size="small"
                color={now.length < 0 ? "primary" : "default"}
              >
                <InfoOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Box>
          {next.map((item: any, index: number) => {
            return (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: "23px",
                    mt: "32px",
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
                <Grid container columns={12} spacing={2}>
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
        </Box>
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
        py: 1,
        px: 2,
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
