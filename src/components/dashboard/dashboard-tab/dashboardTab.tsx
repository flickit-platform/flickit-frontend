import LoadingSkeletonOfAssessmentRoles from "@/components/common/loadings/LoadingSkeletonOfAssessmentRoles";
import StepperSection from "./StepperSection";
import QueryData from "@/components/common/QueryData";
import PermissionControl from "@/components/common/PermissionControl";
import Box from "@mui/material/Box";
import TodoBox from "./todoBox";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useServiceContext } from "@/providers/service-provider";
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
      service.assessments.info.getDashboard(args ?? { assessmentId }, config),
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
      (item: { category: string; metrics: Record<string, any> }) => {
        if (Object.keys(item.metrics).length === 0) return;

        item.metrics.name = item.category;

        if (item.category === "advices" && item.metrics) {
          const renameMap: Record<string, string> = {
            unapproved: "unapprovedAdvices",
            expired: "expiredAdvices",
          };

          Object.entries(renameMap).forEach(([oldKey, newKey]) => {
            if (item.metrics[oldKey] !== undefined) {
              item.metrics[newKey] = item.metrics[oldKey];
              delete item.metrics[oldKey];
            }
          });
        }

        const stepConditions: Record<
          number,
          (cat: string, metrics: Record<string, any>) => boolean
        > = {
          0: (cat, m) => cat === "questions" && m.unanswered,
          1: (cat, m) =>
            (cat === "insights" && m.notGenerated) || cat === "questions",
          2: (cat) => ["advices", "insights", "questions"].includes(cat),
        };

        const isNow =
          stepConditions[activeStep]?.(item.category, item.metrics) ?? true;

        (isNow ? todoData.now : todoData.next).push(item.metrics);
      }
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
          <Box sx={{ width: "100%" }}>
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
