import { useMemo } from "react";
import i18next from "i18next";
import { useQuery } from "@/hooks/useQuery";
import { formatLanguageCodes } from "@/utils/language-utils";
import { AssessmentKitDetailsType, AssessmentKitInfoType, AssessmentKitStatsType } from "@/types";
import { useServiceContext } from "@/providers/service-provider";

export function useAssessmentKitDetail(assessmentKitId: string | undefined) {
  const { service } = useServiceContext();

  const fetchAssessmentKitInfoQuery = useQuery<AssessmentKitInfoType>({
    service: (args, config) =>
      service.assessmentKit.info.getInfo(args ?? { assessmentKitId }, config),
    runOnMount: true,
  });

  const fetchAssessmentKitStatsQuery = useQuery<AssessmentKitStatsType>({
    service: (args, config) =>
      service.assessmentKit.info.getStats(args ?? { assessmentKitId }, config),
    runOnMount: true,
  });

  const fetchAssessmentKitDetailsQuery = useQuery<AssessmentKitDetailsType>({
    service: (args, config) =>
      service.assessmentKit.details.getKit(args ?? { assessmentKitId }, config),
    runOnMount: true,
  });

  const derived = useMemo(() => {
    const info = fetchAssessmentKitInfoQuery.data as
      | AssessmentKitInfoType
      | undefined;
    const stats = fetchAssessmentKitStatsQuery.data as
      | AssessmentKitStatsType
      | undefined;
    const details = fetchAssessmentKitDetailsQuery.data;

    return {
      info,
      stats,
      details,
      languages: info
        ? formatLanguageCodes(info.languages, i18next.language)
        : [],
      expertGroupTitle: stats?.expertGroup?.title,
    } as const;
  }, [fetchAssessmentKitInfoQuery.data, fetchAssessmentKitStatsQuery.data]);

  return {
    fetchAssessmentKitInfoQuery,
    fetchAssessmentKitStatsQuery,
    fetchAssessmentKitDetailsQuery,
    ...derived,
  } as const;
}
