import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { Trans } from "react-i18next";
import { theme } from "@config/theme";
import InfoIcon from "@mui/icons-material/Info";
import StepperSection from "@/components/dashboard/dashboard-tab/StepperSection";
import TodoBox from "@/components/dashboard/dashboard-tab/todoBox";
import { useEffect, useState } from "react";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import { useParams } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import PermissionControl from "@/components/common/PermissionControl";
import LoadingSkeletonOfAssessmentRoles from "@common/loadings/LoadingSkeletonOfAssessmentRoles";

const DashboardTab = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [todoBoxData, setTodoBoxData] = useState({ now: [], next: [] });
  const [stepData, setStepData] = useState<
    { category: string; metrics: any }[]
  >([]);
  const { assessmentId = "" } = useParams();
  const { service } = useServiceContext();

  const fetchDashboard = useQuery({
    service: (args = { assessmentId }, config) =>
      service.fetchDashboard(args, config),
    runOnMount: false,
  });

  useEffect(() => {
    const preparedData = async () => {
      try {
        const data = await fetchDashboard.query();
        const mappedData = [
          { category: "questions", metrics: data.questions },
          { category: "insights", metrics: data.insights },
          { category: "advices", metrics: data.advices },
        ];
        const todoData: any = { now: [], next: [] };

        const updatedData = mappedData.map((item) => {
          return {
            category: item.category,
            metrics: Object.fromEntries(
              Object.entries(item.metrics).filter(
                ([key, value]) =>
                  (key !== "total" &&
                    key !== "answered" &&
                    key !== "expected" &&
                    value) ||
                  (key === "total" &&
                    item.category === "advices" &&
                    value === 0),
              ),
            ),
          };
        });
        updatedData.forEach(
          (item: { category: string; metrics: { [p: string]: any } }) => {
            if (Object.keys(item.metrics).length > 0) {
              if (activeStep == 0) {
                if (item.category == "questions" && item.metrics.unanswered) {
                  item.metrics.name = item.category;
                  todoData.now.push(item.metrics);
                } else {
                  item.metrics.name = item.category;
                  todoData.next.push(item.metrics);
                }
              } else if (activeStep == 1) {
                if (
                  (item.category == "insights" && item.metrics.notGenerated) ||
                  item.category == "questions"
                ) {
                  item.metrics.name = item.category;
                  todoData.now.push(item.metrics);
                } else {
                  item.metrics.name = item.category;
                  todoData.next.push(item.metrics);
                }
              } else {
                item.metrics.name = item.category;
                todoData.now.push(item.metrics);
              }
            }
          },
        );
        setTodoBoxData(todoData);
        setStepData(mappedData);
      } catch (e) {}
    };
    preparedData().then();
  }, [activeStep]);

  return (
    <PermissionControl error={[fetchDashboard.errorObject?.response?.data]}>
      {fetchDashboard.loading ? (
        <LoadingSkeletonOfAssessmentRoles />
      ) : (
        <Box
          sx={{
            p: "45px",
            height: "100%",
            width: "100%",
            background: "#F9FAFB",
            border: "2px solid #C7CCD1",
            borderRadius: "1rem",
          }}
        >
          <StepperSection
            setActiveStep={setActiveStep}
            activeStep={activeStep}
            stepData={stepData}
          />
          <TodoBox activeStep={activeStep} todoBoxData={todoBoxData} />
        </Box>
      )}
    </PermissionControl>
  );
};

export default DashboardTab;
