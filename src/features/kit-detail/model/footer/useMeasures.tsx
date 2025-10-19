import { useMemo } from "react";
import { useQuery } from "@/hooks/useQuery";
import { useServiceContext } from "@/providers/service-provider";
import { TId } from "@/types";
import { MeasureDetails } from "../types";

export function useMeasures(
  assessmentKitId: string | undefined,
  measureId?: TId,
) {
  const { service } = useServiceContext();

  const fetcMeasureDetailslQuery = useQuery<MeasureDetails>({
    service: (args, config) =>
      service.assessmentKit.details.getMeasures(
        args ?? { assessmentKitId, measureId },
        config,
      ),
    runOnMount: true,
  });

  const derived = useMemo(() => {
    const measureDetails = fetcMeasureDetailslQuery.data;

    return {
      measureDetails,
    } as const;
  }, [fetcMeasureDetailslQuery.data]);

  return {
    fetcMeasureDetailslQuery,
    ...derived,
  } as const;
}
