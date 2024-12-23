import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { Trans } from "react-i18next";
import { theme } from "@config/theme";
import InfoIcon from "@mui/icons-material/Info";
import data from "../data";
import StepperSection from "@components/dashboard/dashboard_Tab/StepperSection";
import TodoBox from "@components/dashboard/dashboard_Tab/todoBox";
import { useEffect, useState } from "react";
const DashboardTab = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [todoBoxData,setTodoBoxData] = useState([])
  const mappedData = [
    { category: "questions", metrics: data.questions },
    { category: "insights", metrics: data.insights },
    { category: "advices", metrics: data.advices },
  ];

  useEffect(() => {
    const preparedData = () => {
      const todoData: any = { now: [], next: [] };

      const updatedData = mappedData.map((item) => {
        return {
          category: item.category,
          metrics: Object.fromEntries(
            Object.entries(item.metrics).filter(
              ([key, value]) =>
                (key !== "total" && key !== "answered" && value !== 0) ||
               (key === "total" && item.category === "advices" && value === 0),
            ),
          ),
        };
      });
     updatedData.map((item) => {
         if(Object.keys(item.metrics).length > 0){
             if (activeStep == 0) {
                 if (item.category == "questions" && item.metrics.unanswered) {
                     todoData.now.push(item.metrics);
                 } else {
                     todoData.next.push(item.metrics);
                 }
             } else if (activeStep == 1) {
                 if (item.category == "insights" && item.metrics.notGenerated || item.category == "questions") {
                     todoData.now.push(item.metrics);
                 } else {
                     todoData.next.push(item.metrics);
                 }
             }else {
                     todoData.now.push(item.metrics);
             }
         }

      });
        setTodoBoxData(todoData)
    };
    preparedData();
  }, [activeStep]);

  return (
    <Box sx={{ p: "80px 45px", height: "100%", width: "100%" }}>
      <Typography
        sx={{
          ...theme.typography.headlineSmall,
          display: "flex",
          alignItems: "center",
          textAlign: "center",
          color: "#3D4D5C80",
          gap: 2,
          mb: 4,
        }}
      >
        <Trans i18nKey={"assessmentSteps"} />
        <InfoIcon sx={{ cursor: "pointer" }} fontSize={"small"} />
      </Typography>
      <StepperSection
        setActiveStep={setActiveStep}
        activeStep={activeStep}
        mappedData={mappedData}
      />
      <TodoBox activeStep={activeStep} todoBoxData={todoBoxData} />
    </Box>
  );
};

export default DashboardTab;
