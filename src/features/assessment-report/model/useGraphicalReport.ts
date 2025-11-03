import { useEffect } from "react";
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

  const { calculate, calculateConfidence } = useCalculate();

  useEffect(() => {
    if (
      fetchGraphicalReport.errorObject?.response?.data?.code ==
      "CALCULATE_NOT_VALID"
    ) {
      calculate().then(() => {
        reload();
      });
    }
    if (
      fetchGraphicalReport.errorObject?.response?.data?.code ==
      "CONFIDENCE_CALCULATION_NOT_VALID"
    ) {
      calculateConfidence().then(() => {
        reload();
      });
    }
    if (
      fetchGraphicalReport?.errorObject?.response?.data?.code === "DEPRECATED"
    ) {
      service.assessments.info.migrateKitVersion({ assessmentId }).then(() => {
        reload();
      });
    }
  }, [fetchGraphicalReport.errorObject]);

  const reload = () => {
    fetchGraphicalReport.query();
  };
  return {
    fetchPathInfo,
    fetchGraphicalReport,
    reload,
  };
};
