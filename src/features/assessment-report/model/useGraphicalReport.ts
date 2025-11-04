import { useParams } from "react-router-dom";
import { useQuery } from "@/hooks/useQuery";
import { IGraphicalReport, PathInfo } from "@/types";
import { useAuthContext } from "@/providers/auth-provider";
import { useServiceContext } from "@/providers/service-provider";
import useCalculate from "@/hooks/useCalculate";

export const useGraphicalReport = () => {
  const { isAuthenticatedUser } = useAuthContext();
  const { service } = useServiceContext();

  const { assessmentId = "", linkHash = "" } = useParams();

  const fetchPathInfo = useQuery<PathInfo>({
    service: (args, config) =>
      service.common.getPathInfo({ assessmentId, ...(args ?? {}) }, config),
    runOnMount: false,
  });

  const fetchGraphicalReport = useQuery<IGraphicalReport>({
    service: (args, config) =>
      isAuthenticatedUser
        ? service.assessments.report.getGraphical(
            { assessmentId, ...(args ?? {}) },
            config,
          )
        : service.assessments.report.getPublicGraphicalReport(
            { linkHash, ...(args ?? {}) },
            { skipAuth: true, ...config },
          ),
    runOnMount: true,
  });

  const fetchData = () => {
    fetchGraphicalReport.query();
  };

  useCalculate(
    fetchGraphicalReport.errorObject?.response?.data.code,
    fetchData,
  );

  return {
    fetchPathInfo,
    fetchGraphicalReport,
    fetchData,
  };
};
