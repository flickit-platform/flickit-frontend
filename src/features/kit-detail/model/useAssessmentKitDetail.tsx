import { useMemo } from "react";
import i18next from "i18next";
import { useQuery } from "@/hooks/useQuery";
import { formatLanguageCodes } from "@/utils/language-utils";
import { AssessmentKitInfoType, AssessmentKitStatsType } from "@/types";

export function useAssessmentKitDetail(
  assessmentKitId: string | undefined,
  service: any,
) {
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
  const fetchAssessmentKitDetailQuery = useQuery<AssessmentKitStatsType>({
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

    return {
      info,
      stats,
      languages: info
        ? formatLanguageCodes(info.languages, i18next.language)
        : [],
      expertGroupTitle: stats?.expertGroup?.title,
    } as const;
  }, [fetchAssessmentKitInfoQuery.data, fetchAssessmentKitStatsQuery.data]);

  return {
    fetchAssessmentKitInfoQuery,
    fetchAssessmentKitStatsQuery,
    fetchAssessmentKitDetailQuery,
    ...derived,
  } as const;
}
