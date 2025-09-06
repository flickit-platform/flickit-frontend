import { useMemo } from "react";
import { t } from "i18next";

export function useScoreSection({
  assessment,
  isQuickMode,
  lng,
}: {
  assessment: any;
  isQuickMode: boolean;
  lng: string;
}) {
  const introHtml = useMemo(
    () => assessment?.intro ?? t("common.unavailable", { lng }),
    [assessment?.intro, lng],
  );

  const overallInsightHtml = useMemo(
    () => assessment?.overallInsight ?? t("common.unavailable", { lng }),
    [assessment?.overallInsight, lng],
  );

  const gaugeProps = useMemo(
    () => ({
      level_value: assessment?.maturityLevel?.value ?? 0,
      maturity_level_status: assessment?.maturityLevel?.title,
      maturity_level_number: assessment?.assessmentKit?.maturityLevelCount,
      confidence_value: assessment?.confidenceValue,
      confidence_text: isQuickMode ? "" : t("common.confidence", { lng }) + ":",
    }),
    [
      assessment?.maturityLevel?.value,
      assessment?.maturityLevel?.title,
      assessment?.assessmentKit?.maturityLevelCount,
      assessment?.confidenceValue,
      isQuickMode,
      lng,
    ],
  );

  return { introHtml, overallInsightHtml, gaugeProps };
}
