import React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { Trans } from "react-i18next";
import { theme } from "@config/theme";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Grid from "@mui/material/Grid";
import {uniqueId} from "lodash";
import Tooltip from "@mui/material/Tooltip";

const TodoBox = (props: any) => {
  const { todoBoxData } = props;
  const { now, next } = todoBoxData;
  return (
    <Box sx={{ mt: "90px" }}>
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
              <Tooltip
                  slotProps={{
                      tooltip: {
                          sx: {
                              color: "#FFFFFF",
                              backgroundColor: "#576675E6",
                          },
                      },
                  }}
                  title={<Trans i18nKey={"whatToDoNowTooltip"} />} >
                  <InfoOutlinedIcon sx={{ cursor: "pointer" }} fontSize={"small"} />
              </Tooltip>
          </Typography>
          {now.map((item: any) => {
            return (
              <React.Fragment key={uniqueId()}>
                <Box
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
                  </Typography>
                </Box>
                <Grid container columns={12} spacing={2} mb={"40px"}>
                  {Object.entries(item)
                    .filter(([key]) => key !== "name")
                    .map(([key, value]) => {
                      return (
                        <Grid item xs={12} md={6} key={uniqueId()}>
                          <IssuesItem key={key} name={key} value={value} />
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
              <Tooltip
                  slotProps={{
                      tooltip: {
                          sx: {
                              color: "#FFFFFF",
                              backgroundColor: "#576675E6",
                          },
                      },
                  }}
                  title={<Trans i18nKey={"whatToDoNextTooltip"} />} >
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
  const { name, value, now, next } = props;
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        border: "1px solid #C7CCD1",
        background: now?.length > 0 && next?.length > 0 ? "#F3F5F6" : "#EAF2FB",
        display: "flex",
        alignItems: "center",
        gap: 1,
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
        {name == "unanswered" && <Trans i18nKey={"waitingForAnswers"} />}
        {name == "hasLowConfidence" && (
          <Trans i18nKey={"waitingVeryLowConfidence"} />
        )}
        {name == "hasNoEvidence" && <Trans i18nKey={"waitingForEvidences"} />}
        {name == "hasUnresolvedComments" && (
          <Trans i18nKey={"waitingUnresolvedComments"} />
        )}
        {name == "notGenerated" && <Trans i18nKey={"insightsNeedToBeGenerated"} />}
        {name == "unapproved" && <Trans i18nKey={"insightsNeedApprovement"} />}
        {name == "expired" && <Trans i18nKey={"expiredDueToNewAnswers"} />}
        {name == "total" && <Trans i18nKey={"suggestAnyAdvicesSoFar"} />}
      </Typography>
    </Box>
  );
};

export default TodoBox;
