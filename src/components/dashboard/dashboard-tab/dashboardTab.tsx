import Box from "@mui/material/Box";
import StepperSection from "@/components/dashboard/dashboard-tab/StepperSection";
import TodoBox from "@/components/dashboard/dashboard-tab/todoBox";
import { useEffect, useState } from "react";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import { useParams } from "react-router-dom";
import PermissionControl from "@/components/common/PermissionControl";
import LoadingSkeletonOfAssessmentRoles from "@common/loadings/LoadingSkeletonOfAssessmentRoles";
import QueryData from "@/components/common/QueryData";

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

  return (
    <PermissionControl error={[fetchDashboard.errorObject?.response?.data]}>
      <QueryData
        {...fetchDashboard}
        renderLoading={() => <LoadingSkeletonOfAssessmentRoles />}
        render={(data) => {
          useEffect(() => {
            const data = fetchDashboard.data;
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
            const updatedData = mappedData.map((item) => {
              return {
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
                    if (
                      item.category == "questions" &&
                      item.metrics.unanswered
                    ) {
                      item.metrics.name = item.category;
                      todoData.now.push(item.metrics);
                    } else {
                      item.metrics.name = item.category;
                      todoData.next.push(item.metrics);
                    }
                  } else if (activeStep == 1) {
                    if (
                      (item.category == "insights" &&
                        item.metrics.notGenerated) ||
                      item.category == "questions"
                    ) {
                      item.metrics.name = item.category;
                      todoData.now.push(item.metrics);
                    } else {
                      item.metrics.name = item.category;
                      todoData.next.push(item.metrics);
                    }
                  } else if (activeStep == 2) {
                    if (
                      item.category == "advices" ||
                      item.category == "insights" ||
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
          }, [activeStep]);

          return (
            <Box
              sx={{
                mt: "32px",
                width: "100%",
              }}
            >
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
          );
        }}
      />
    </PermissionControl>
  );
};

export default DashboardTab;
