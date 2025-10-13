import { useMemo } from "react";
import i18next from "i18next";
import { useQuery } from "@/hooks/useQuery";
import { formatLanguageCodes } from "@/utils/language-utils";
import { useServiceContext } from "@/providers/service-provider";
import { KitDetailsType, KitInfoType, KitStatsType } from "./types";

export function useKitDetailContainer(assessmentKitId: string | undefined) {
  const { service } = useServiceContext();

  const fetchKitInfoQuery = useQuery<KitInfoType>({
    service: (args, config) =>
      service.assessmentKit.info.getInfo(args ?? { assessmentKitId }, config),
    runOnMount: true,
  });

  const fetchKitStatsQuery = useQuery<KitStatsType>({
    service: (args, config) =>
      service.assessmentKit.info.getStats(args ?? { assessmentKitId }, config),
    runOnMount: true,
  });

  const fetchKitDetailQuery = useQuery<KitDetailsType>({
    service: (args, config) =>
      service.assessmentKit.details.getKit(args ?? { assessmentKitId }, config),
    runOnMount: true,
  });

  const derived = useMemo(() => {
    const info = fetchKitInfoQuery.data as
      | KitInfoType
      | undefined;
    const stats = fetchKitStatsQuery.data as
      | KitStatsType
      | undefined;
    const details = fetchKitDetailQuery.data;

    return {
      info,
      stats,
      details,
      languages: info
        ? formatLanguageCodes(info.languages, i18next.language)
        : [],
      expertGroupTitle: stats?.expertGroup?.title,
    } as const;
  }, [fetchKitInfoQuery.data, fetchKitStatsQuery.data]);

  return {
    fetchKitInfoQuery,
    fetchKitStatsQuery,
    fetchKitDetailQuery,
    ...derived,
  } as const;
}