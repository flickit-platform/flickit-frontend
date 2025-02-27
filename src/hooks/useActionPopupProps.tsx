import { useCallback } from "react";
import { theme } from "@/config/theme";
import { t } from "i18next";
import { Typography } from "@mui/material";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { styles } from "@styles";
import { useQuery } from "@/utils/useQuery";

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
  config: {
    appTitle: string;
  };
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
  cancelMessage: string;
}

const useActionPopupProps = ({
  data,
  progress,
  generateAIInsight,
  loadAttributeInsight,
  approveAction,
  ApprovedAIAttribute,
  config,
}: UseActionPopupProps) => {
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
  }, [data, getInsightValidity]);

  const getPopupTexts = useCallback((): PopupTexts => {
    const { isExpired, isApproved } = getInsightValidity();

    const buttonLabel = (
      <Typography variant="labelMedium" sx={{ ...styles.centerVH, gap: 1 }}>
        <FaWandMagicSparkles />
        {t(
          isExpired
            ? "insightPage.insightIsExpired"
            : isApproved
              ? "insightPage.insightIsApproved"
              : "insightPage.generatedByAppNeedsApproval",
          { title: config.appTitle },
        )}
      </Typography>
    );

    const description = t(
      isExpired
        ? "insightPage.insightIsExpiredDescription"
        : isApproved
          ? "insightPage.AIinsightIsApprovedDescription"
          : "insightPage.AIGeneratedNeedsApprovalDescription",
      { title: config.appTitle },
    );

    return {
      buttonLabel,
      description,
      primaryAction:
        isExpired || isApproved
          ? t("insightPage.regenerate")
          : t("insightPage.generateInsight"),
      secondaryAction: t("insightPage.approveInsight"),
      confirmMessage: t("insightPage.regenerateDescription"),
      cancelMessage: t("insightPage.no"),
    };
  }, [data, config, getInsightValidity, t]);

  return {
    disablePrimaryButton: shouldDisablePrimaryButton,
    disablePrimaryButtonText:
      t("insightPage.questionsArentCompleteSoAICantBeGenerated") ?? "",
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
