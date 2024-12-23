import React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { Trans } from "react-i18next";
import { theme } from "@config/theme";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

const TodoBox = (props: any) => {
  const { activeStep, todoBoxData } = props;
  const { now, next } = todoBoxData;
  return (
    <Box sx={{ mt: "90px" }}>
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
        <InfoOutlinedIcon sx={{ cursor: "pointer" }} fontSize={"small"} />
      </Typography>
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
          <Trans i18nKey={"questionsIssues"} />
        </Typography>
        <Button variant="contained">
          <Trans i18nKey={"goToQuestions"} />
        </Button>
      </Box>
      <Grid container columns={12} spacing={2}>
        <Grid item xs={12} md={6}>
          <IssuesItem />
        </Grid>
      </Grid>
    </Box>
  );
};

const IssuesItem = (props: any) => {
  const { count, title } = props;
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        border: "1px solid #C7CCD1",
        background: "#EAF2FB",
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <InfoOutlinedIcon style={{ fill: "#0072ea" }} />
      <Typography sx={{ ...theme.typography.semiBoldMedium, color: "#2B333B" }}>
        {count}
        <Trans i18nKey={"hi"} />
      </Typography>
    </Box>
  );
};

export default TodoBox;
