import { useCallback } from "react";
import Typography from "@mui/material/Typography";
import { theme } from "@/config/theme";
import { t } from "i18next";
import { styles } from "@styles";
import { useConfigContext } from "@/providers/ConfgProvider";
import FaWandMagicSparkles from "@/components/common/icons/FaWandMagicSparkles";

interface InsightStatus {
  status: "default" | "expired" | "approved" | "pending";
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
  confirmButtonLabel: string;
  cancelButtonLabel: string;
}

interface UseInsightPopupProps {
  insight: boolean;
  isExpired: boolean;
  isApproved: boolean;
  initQuery: () => Promise<void>;
  fetchQuery: () => Promise<void>;
  approveAction: (event: React.SyntheticEvent) => Promise<void>;
  initLoading: boolean;
  approveLoading: boolean;
  AIEnabled?: boolean;
}

const useInsightPopup = ({
  insight,
  isExpired,
  isApproved,
  initQuery,
  fetchQuery,
  approveAction,
  initLoading,
  approveLoading,
  AIEnabled,
}: UseInsightPopupProps) => {
  const { config } = useConfigContext();

  const getInsightStatus = useCallback((): InsightStatus["status"] => {
    if (!insight) return "default";
    if (isExpired) return "expired";
    if (isApproved) return "approved";
    return "pending";
  }, [insight, isExpired, isApproved]);

  const shouldHidePrimaryButton = useCallback((): boolean => {
    return insight && !isExpired && !isApproved;
  }, [insight, isExpired, isApproved]);

  const handlePrimaryAction = useCallback(
    (event: React.MouseEvent) => {
      initQuery().then(() => fetchQuery());
    },
    [initQuery, fetchQuery],
  );

  const getColorScheme = useCallback((): ColorScheme => {
    if (!insight) {
      return {
        muiColor: "primary",
        main: theme.palette.primary.main,
        light: theme.palette.primary.light,
      };
    }
    if (isApproved && !isExpired) {
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
  }, [insight, isApproved, isExpired, theme]);

  const getButtonLabelText = useCallback(() => {
    if (!insight) return t("generateInsights.insightIsNotGenerated");

    if (isExpired) return t("generateInsights.insightIsExpired");
    if (isApproved) return t("generateInsights.insightIsApproved");

    if (AIEnabled) return t("generateInsights.AIGeneratedNeedsApproval");
    return t("generateInsights.generatedByAppNeedsApproval", {
      title: config.appTitle,
    });
  }, [insight, isExpired, isApproved]);

  const getPopupTexts = useCallback((): PopupTexts => {
    const buttonLabel = (
      <Typography variant="labelMedium" sx={{ ...styles.centerVH, gap: 1 }}>
        <FaWandMagicSparkles
          styles={{
            color: getColorScheme().main,
          }}
        />{" "}
        {getButtonLabelText()}
      </Typography>
    );

    const description = isExpired
      ? AIEnabled
        ? t("generateInsights.AIinsightIsExpiredDescription")
        : t("generateInsights.insightIsExpiredDescription")
      : insight
        ? isApproved
          ? AIEnabled
            ? t("generateInsights.AIinsightIsApprovedDescription")
            : t("generateInsights.insightIsApprovedDescription", {
                title: config.appTitle,
              })
          : AIEnabled
            ? t("generateInsights.AIGeneratedNeedsApprovalDescription")
            : t("generateInsights.generatedByAppNeedsApprovalDescription", {
                title: config.appTitle,
              })
        : AIEnabled
          ? t("generateInsights.generateInsightViaAIDescription")
          : t("generateInsights.generateInsightDescription", {
              title: config.appTitle,
            });

    return {
      buttonLabel,
      description,
      primaryAction: insight
        ? AIEnabled
          ? t("generateInsights.regenerateViaAI")
          : t("generateInsights.regenerate")
        : AIEnabled
          ? t("generateInsights.generateInsightViaAI")
          : t("generateInsights.generateInsight"),
      secondaryAction: t("generateInsights.approveInsight"),
      confirmMessage: AIEnabled
        ? t("generateInsights.regenerateViaAIDescription")
        : t("generateInsights.regenerateDescription"),
      confirmButtonLabel: t("generateInsights.regenerate"),
      cancelButtonLabel: t("generateInsights.no"),
    };
  }, [insight, isExpired, isApproved, getButtonLabelText]);

  return {
    status: getInsightStatus(),
    hidePrimaryButton: shouldHidePrimaryButton(),
    onPrimaryAction: handlePrimaryAction,
    loadingPrimary: initLoading,
    onSecondaryAction: approveAction,
    loadingSecondary: approveLoading,
    colorScheme: getColorScheme(),
    texts: getPopupTexts(),
  };
};

export default useInsightPopup;
