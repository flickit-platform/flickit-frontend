import { useCallback } from "react";
import { theme } from "@/config/theme";
import { t } from "i18next";
import { Typography } from "@mui/material";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { styles } from "@styles";
import { useQuery } from "@/utils/useQuery";
import { useConfigContext } from "@/providers/ConfgProvider";

interface UseActionPopupProps {
  data: {
    assessorInsight?: { isValid: boolean; insight?: string };
    aiInsight?: { isValid: boolean; insight?: string };
    approved?: boolean;
    editable?: boolean;
  };
  progress: number;
  generateAIInsight: ReturnType<typeof useQuery>;
  loadAttributeInsight: ReturnType<typeof useQuery>;
  approveAction: (event: React.SyntheticEvent) => Promise<void>;
  ApprovedAIAttribute: ReturnType<typeof useQuery>;
}

interface ColorScheme {
  muiColor: "primary" | "success" | "error";
  main: string;
  light: string;
}

interface PopupTexts {
  buttonLabel: JSX.Element;
  description: string;
  primaryAction: string;
  secondaryAction: string;
  confirmMessage: string;
  cancelButtonLabel: string;
}

const useActionPopupProps = ({
  data,
  progress,
  generateAIInsight,
  loadAttributeInsight,
  approveAction,
  ApprovedAIAttribute,
}: UseActionPopupProps) => {
  const { config } = useConfigContext();
  const getInsightValidity = useCallback(() => {
    const hasAssessorInsight = data?.assessorInsight?.isValid;
    const hasAIInsight = data?.aiInsight?.isValid;

    return {
      isExpired: !hasAssessorInsight || !hasAIInsight,
      isApproved: data?.approved,
    };
  }, [data]);

  const getInsightStatus = useCallback(() => {
    const { isExpired, isApproved } = getInsightValidity();
    if (isExpired) return "expired";
    if (isApproved) return "approved";
    return "pending";
  }, [getInsightValidity]);

  const shouldDisablePrimaryButton = progress !== 100;

  const getColorScheme = useCallback((): ColorScheme => {
    const { isApproved } = getInsightValidity();
    if (!data?.assessorInsight && !data?.aiInsight) {
      return {
        muiColor: "primary",
        main: theme.palette.primary.main,
        light: theme.palette.primary.light,
      };
    }
    return isApproved
      ? {
          muiColor: "success",
          main: theme.palette.success.main,
          light: theme.palette.success.light,
        }
      : {
          muiColor: "error",
          main: theme.palette.error.main,
          light: theme.palette.error.light,
        };
  }, [data, getInsightValidity]); // Extracted logic for button text determination

  const getButtonLabelText = useCallback(() => {
    const { isExpired, isApproved } = getInsightValidity();
    if (isExpired) return t("generateInsights.insightIsExpired");
    if (isApproved) return t("generateInsights.insightIsApproved");
    return t("generateInsights.generatedByAppNeedsApproval");
  }, [data, getInsightValidity, t]);

  const getPopupTexts = useCallback((): PopupTexts => {
    const { isExpired, isApproved } = getInsightValidity();

    const buttonLabel = (
      <Typography variant="labelMedium" sx={{ ...styles.centerVH, gap: 1 }}>
        <FaWandMagicSparkles />
        {getButtonLabelText()}
      </Typography>
    );

    const description = t(
      isExpired
        ? "generateInsights.insightIsExpiredDescription"
        : isApproved
          ? "generateInsights.AIinsightIsApprovedDescription"
          : "generateInsights.AIGeneratedNeedsApprovalDescription",
      { title: config.appTitle },
    );

    return {
      buttonLabel,
      description,
      primaryAction:
        isExpired || isApproved
          ? t("generateInsights.regenerate")
          : t("generateInsights.generateInsight"),
      secondaryAction: t("generateInsights.approveInsight"),
      confirmMessage: t("generateInsights.regenerateDescription"),
      cancelButtonLabel: t("generateInsights.no"),
    };
  }, [data, getInsightValidity, getButtonLabelText]);

  return {
    disablePrimaryButton: shouldDisablePrimaryButton,
    disablePrimaryButtonText:
      t("generateInsights.questionsArentCompleteSoAICantBeGenerated") ?? "",
    status: getInsightStatus(),
    onPrimaryAction: () =>
      generateAIInsight.query().then(() => loadAttributeInsight.query()),
    loadingPrimary: generateAIInsight.loading,
    onSecondaryAction: approveAction,
    loadingSecondary: ApprovedAIAttribute.loading,
    colorScheme: getColorScheme(),
    texts: getPopupTexts(),
  };
};

export default useActionPopupProps;
