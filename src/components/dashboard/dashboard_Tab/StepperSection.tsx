import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useState } from "react";
import { Trans } from "react-i18next";
import { theme } from "@config/theme";
import Grid from "@mui/material/Grid";

const StepperSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const steps = Array.from(Array(3).keys());
  return (
    <Box
      sx={{
        background: "#fff",
        borderRadius: "1rem",
        width: "100%",
        p: 3,
        backgroundColor: "#fff",
        boxShadow: "0 0 8px 0 #0A234240",
      }}
    >
      <Stepper sx={{ width: "70%", mx: "auto" }} activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}></StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <Grid container columns={12} >

          {steps.map((item,index) => {
            return <StepBox key={index} indexNum={index} />;
          })}

      </Grid>
    </Box>
  );
};

const StepBox = (props: any) => {
    const {indexNum} = props
  return (
      <Grid item md={4}>
      <Typography
        sx={{
          ...theme.typography.semiBoldLarge,
          color: "#6C8093",
          textAlign: "center",
          width: "100%",
          height: "300px",
            borderRight: indexNum == 1 ? "1px solid red" : "",
            borderLeft: indexNum == 1 ? "1px solid red" : ""
        }}
      >
        <Trans i18nKey={"answeredQuestions"} />
      </Typography>
      </Grid>
  );
};
export default StepperSection;
