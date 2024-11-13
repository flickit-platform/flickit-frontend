import Box from "@mui/material/Box";
import { TStatus, IMaturityLevel } from "@types";
import { Gauge } from "@common/charts/Gauge";
import { getNumberBaseOnScreen } from "@/utils/returnBasedOnScreen";
import { t } from "i18next";

interface IAssessmentOverallStatusProps {
  status?: TStatus;
  maturity_level: IMaturityLevel;
  maturity_level_count: number;
  confidence_value?: number;
}

export const AssessmentOverallStatus = (
  props: IAssessmentOverallStatusProps,
) => {
  const { maturity_level, maturity_level_count, confidence_value } = props;

  return (
    <Box
      height="100%"
      sx={{
        background: "#fff",
        boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.25)",
        borderRadius: "12px",
      }}
    >
      <Gauge
        level_value={maturity_level?.index ?? 0}
        maturity_level_status={maturity_level?.title}
        maturity_level_number={maturity_level_count}
        confidence_value={confidence_value}
        confidence_text={t("withPercentConfidence")}
        isMobileScreen={false}
        hideGuidance={true}
        height={getNumberBaseOnScreen(340, 440, 440, 360, 360)}
        mb="-36px"
        className="insight--report__gauge"
        maturity_status_guide={t("overallMaturityLevelIs")}
      />
    </Box>
  );
};
