import LoadingSkeletonOfAssessmentRoles from "@/components/common/loadings/LoadingSkeletonOfAssessmentRoles";
import StepperSection from "./StepperSection";
import QueryData from "@/components/common/QueryData";
import PermissionControl from "@/components/common/PermissionControl";
import Box from "@mui/material/Box";
import TodoBox from "./todoBox";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useServiceContext } from "@/providers/ServiceProvider";
import { useQuery } from "@/utils/useQuery";

const DashboardTab = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [todoBoxData, setTodoBoxData] = useState({ now: [], next: [] });
  const [stepData, setStepData] = useState<
    { category: string; metrics: any }[]
  >([]);
  const { assessmentId = "" } = useParams();
  const { service } = useServiceContext();

  const fetchDashboard = useQuery({
    service: (args, config) =>
      service.fetchDashboard(args ?? { assessmentId }, config),
    runOnMount: true,
  });

  const data = fetchDashboard.data;

  useEffect(() => {
    if (!data) return;

    const { unpublished, ...rest } = data.report;
    const updateReport = { ...rest, unpublished };
    const { unanswered, unapprovedAnswers, ...others } = data.questions;
    const updateQuestion = { unanswered, unapprovedAnswers, ...others };

    const mappedData = [
      { category: "questions", metrics: updateQuestion },
      { category: "insights", metrics: data.insights },
      { category: "advices", metrics: data.advices },
      { category: "report", metrics: updateReport },
    ];

    const todoData: any = { now: [], next: [] };

    const updatedData = mappedData.map((item) => ({
      category: item.category,
      metrics: Object.fromEntries(
        Object.entries(item.metrics).filter(
          ([key, value]) =>
            (key !== "total" &&
              key !== "answered" &&
              key !== "expected" &&
              key !== "totalMetadata" &&
              key !== "providedMetadata" &&
              value) ||
            (key === "total" && item.category === "advices" && value === 0),
        ),
      ),
    }));

    updatedData.forEach(
      (item: { category: string; metrics: { [p: string]: any } }) => {
        if (Object.keys(item.metrics).length > 0) {
          item.metrics.name = item.category;
          if (activeStep == 0) {
            if (item.category == "questions" && item.metrics.unanswered) {
              todoData.now.push(item.metrics);
            } else {
              todoData.next.push(item.metrics);
            }
          } else if (activeStep == 1) {
            if (
              (item.category == "insights" && item.metrics.notGenerated) ||
              item.category == "questions"
            ) {
              todoData.now.push(item.metrics);
            } else {
              todoData.next.push(item.metrics);
            }
          } else if (activeStep == 2) {
            if (
              item.category == "advices" ||
              item.category == "insights" ||
              item.category == "questions"
            ) {
              todoData.now.push(item.metrics);
            } else {
              todoData.next.push(item.metrics);
            }
          } else {
            todoData.now.push(item.metrics);
          }
        }
      },
    );

    setTodoBoxData(todoData);
    setStepData(mappedData);
  }, [data, activeStep]);

  return (
    <PermissionControl error={[fetchDashboard.errorObject?.response?.data]}>
      <QueryData
        {...fetchDashboard}
        renderLoading={() => <LoadingSkeletonOfAssessmentRoles />}
        render={() => (
          <Box sx={{ mt: "32px", width: "100%" }}>
            <StepperSection
              setActiveStep={setActiveStep}
              activeStep={activeStep}
              stepData={stepData}
            />
            <TodoBox
              activeStep={activeStep}
              todoBoxData={todoBoxData}
              fetchDashboard={fetchDashboard}
            />
          </Box>
        )}
      />
    </PermissionControl>
  );
};

export default DashboardTab;
