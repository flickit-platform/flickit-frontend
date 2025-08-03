import { useCallback } from "react";
import Typography from "@mui/material/Typography";
import { t } from "i18next";
import { styles } from "@styles";
import { useConfigContext } from "@/providers/ConfgProvider";
import FaWandMagicSparkles from "@/components/common/icons/FaWandMagicSparkles";
import { useTheme } from "@mui/material";

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
  const theme = useTheme();

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
    if (!insight) return t("assessment.insightIsNotGenerated");

    if (isExpired) return t("assessment.insightIsExpired");
    if (isApproved) return t("assessment.insightIsApproved");

    if (AIEnabled) return t("assessment.AIGeneratedNeedsApproval");
    return t("assessment.generatedByAppNeedsApproval", {
      title: config.appTitle,
    });
  }, [insight, isExpired, isApproved]);

  const getDescription = () => {
    if (isExpired) {
      return AIEnabled
        ? t("assessment.AIinsightIsExpiredDescription")
        : t("assessment.insightIsExpiredDescription");
    }

    if (insight) {
      if (isApproved) {
        return AIEnabled
          ? t("assessment.AIinsightIsApprovedDescription")
          : t("assessment.insightIsApprovedDescription", {
              title: config.appTitle,
            });
      }
      return AIEnabled
        ? t("assessment.AIGeneratedNeedsApprovalDescription")
        : t("assessment.generatedByAppNeedsApprovalDescription", {
            title: config.appTitle,
          });
    }

    return AIEnabled
      ? t("assessment.generateInsightViaAIDescription")
      : t("assessment.generateInsightDescription", {
          title: config.appTitle,
        });
  };

  const getPrimaryAction = () => {
    if (insight) {
      return AIEnabled
        ? t("assessment.regenerateViaAI")
        : t("common.regenerate");
    }
    return AIEnabled
      ? t("assessment.generateInsightViaAI")
      : t("assessment.generateInsight");
  };

  const getConfirmMessage = () => {
    return AIEnabled
      ? t("assessment.regenerateViaAIDescription")
      : t("assessment.regenerateDescription");
  };

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

    return {
      buttonLabel,
      description: getDescription(),
      primaryAction: getPrimaryAction(),
      secondaryAction: t("assessment.approveInsight"),
      confirmMessage: getConfirmMessage(),
      confirmButtonLabel: t("assessment.regenerate"),
      cancelButtonLabel: t("assessment.no"),
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
