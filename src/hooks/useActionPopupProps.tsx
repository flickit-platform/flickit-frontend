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
  const getInsightStatus = useCallback(() => {
    if (data?.assessorInsight || data?.aiInsight) {
      if (
        (data.assessorInsight && !data.assessorInsight.isValid) ||
        (data.aiInsight && !data.aiInsight.isValid)
      ) {
        return "expired";
      }
      if (
        !(
          (data.assessorInsight && !data.assessorInsight.isValid) ||
          (data.aiInsight && !data.aiInsight.isValid) ||
          ((data.aiInsight || data.assessorInsight) && !data.approved)
        )
      ) {
        return "approved";
      }
      return "pending";
    }
    return "default";
  }, [data]);

  const shouldDisablePrimaryButton = useCallback(() => progress !== 100, [progress]);

  const getDisablePrimaryButtonText = useCallback(
    () => t("insightPage.questionsArentCompleteSoAICantBeGenerated") ?? "",
    [t]
  );

  const handlePrimaryAction = useCallback(
    (event: React.SyntheticEvent) => {
      generateAIInsight.query().then(() => loadAttributeInsight.query());
    },
    [generateAIInsight, loadAttributeInsight]
  );

  const getColorScheme = useCallback((): ColorScheme => {
    if (!(data?.assessorInsight || data?.aiInsight)) {
      return {
        muiColor: "primary",
        main: theme.palette.primary.main,
        light: theme.palette.primary.light,
      };
    }
    if (
      !(
        (data.assessorInsight && !data.assessorInsight.isValid) ||
        (data.aiInsight && !data.aiInsight.isValid) ||
        ((data.aiInsight || data.assessorInsight) && !data.approved)
      )
    ) {
      return {
        muiColor: "success",
        main: theme.palette.success.main,
        light: theme.palette.success.light,
      };
    }
    return {
      muiColor: "error",
      main: theme.palette.error.main,
      light: theme.palette.error.light,
    };
  }, [data]);

  const getPopupTexts = useCallback((): PopupTexts => {
    const buttonLabel = (
      <Typography variant="labelMedium" sx={{ ...styles.centerVH, gap: 1 }}>
        <FaWandMagicSparkles />{" "}
        {t(
          data?.assessorInsight || data?.aiInsight
            ? (data.assessorInsight && !data.assessorInsight.isValid) ||
              (data.aiInsight && !data.aiInsight.isValid)
              ? "insightPage.insightIsExpired"
              : !(
                  (data.assessorInsight && !data.assessorInsight.isValid) ||
                  (data.aiInsight && !data.aiInsight.isValid) ||
                  ((data.aiInsight || data.assessorInsight) && !data.approved)
                )
              ? "insightPage.insightIsApproved"
              : "insightPage.generatedByAppNeedsApproval"
            : "insightPage.generateInsight",
          { title: config.appTitle }
        )}
      </Typography>
    );

    const description = t(
      data?.assessorInsight || data?.aiInsight
        ? (data.assessorInsight && !data.assessorInsight.isValid) ||
          (data.aiInsight && !data.aiInsight.isValid)
          ? "insightPage.insightIsExpiredDescription"
          : !(
              (data.assessorInsight && !data.assessorInsight.isValid) ||
              (data.aiInsight && !data.aiInsight.isValid) ||
              ((data.aiInsight || data.assessorInsight) && !data.approved)
            )
          ? "insightPage.AIinsightIsApprovedDescription"
          : "insightPage.AIGeneratedNeedsApprovalDescription"
        : "insightPage.generateInsightDescription",
      { title: config.appTitle }
    );

    return {
      buttonLabel,
      description,
      primaryAction:
        data?.assessorInsight || data?.aiInsight
          ? t("insightPage.regenerate")
          : t("insightPage.generateInsight"),
      secondaryAction: t("insightPage.approveInsight"),
      confirmMessage: t("insightPage.regenerateDescription"),
      cancelMessage: t("insightPage.no"),
    };
  }, [data, config, t]);

  return {
    disablePrimaryButton: shouldDisablePrimaryButton(),
    disablePrimaryButtonText: getDisablePrimaryButtonText(),
    status: getInsightStatus(),
    onPrimaryAction: handlePrimaryAction,
    loadingPrimary: generateAIInsight.loading,
    onSecondaryAction: approveAction,
    loadingSecondary: ApprovedAIAttribute.loading,
    colorScheme: getColorScheme(),
    texts: getPopupTexts(),
  };
};

export default useActionPopupProps;