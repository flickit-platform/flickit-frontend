import { useCallback } from "react";
import Typography from "@mui/material/Typography";
import { t } from "i18next";
import { styles } from "@styles";
import { useConfigContext } from "@/providers/ConfgProvider";
import FaWandMagicSparkles from "@/components/common/icons/FaWandMagicSparkles";
import { useTheme } from "@mui/material";
import { isPromise } from "util/types";

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
  initQuery: () => Promise<void> | void;
  fetchQuery?: () => Promise<void>;
  approveAction: (event: React.SyntheticEvent) => Promise<void>;
  initLoading: boolean;
  approveLoading: boolean;
  AIEnabled?: boolean;
  label?: any;
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
  label = t("common.insight"),
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
      if (fetchQuery) {
        initQuery()?.then(() => fetchQuery());
      } else {
        initQuery();
      }
    },
    [initQuery, fetchQuery],
  );

  const getColorScheme = useCallback((): ColorScheme => {
    if (!insight) {
      return {
        muiColor: "primary",
        main: theme.palette.primary.main,
        light: theme.palette.primary.states.hover,
      };
    }
    if (isApproved && !isExpired) {
      return {
        muiColor: "success",
        main: theme.palette.success.main,
        light: theme.palette.success.states.hover,
      };
    }
    return {
      muiColor: "error",
      main: theme.palette.error.main,
      light: theme.palette.error.states.hover,
    };
  }, [insight, isApproved, isExpired, theme]);

  const getButtonLabelText = useCallback(() => {
    if (!insight) return t("assessment.isNotGenerated", { label: label });

    if (isExpired) return t("assessment.isExpired", { label: label });
    if (isApproved) return t("assessment.isApproved", { label: label });

    if (AIEnabled) return t("assessment.AIGeneratedNeedsApproval");
    return t("assessment.generatedByAppNeedsApproval", {
      title: config.appTitle,
    });
  }, [insight, isExpired, isApproved]);

  const getDescription = () => {
    if (isExpired) {
      return AIEnabled
        ? t("assessment.AIIsExpiredDescription", { label: label.toLowerCase() })
        : t("assessment.isExpiredDescription", { label: label.toLowerCase() });
    }

    if (insight) {
      if (isApproved) {
        return AIEnabled
          ? t("assessment.AIIsApprovedDescription", {
              label: label.toLowerCase(),
            })
          : t("assessment.isApprovedDescription", {
              title: config.appTitle,
              label: label.toLowerCase(),
            });
      }
      return AIEnabled
        ? t("assessment.AIGeneratedNeedsApprovalDescription", {
            label: label.toLowerCase(),
          })
        : t("assessment.generatedByAppNeedsApprovalDescription", {
            title: config.appTitle,
            label: label.toLowerCase(),
          });
    }

    return AIEnabled
      ? t("assessment.generateViaAIDescription", { label: label.toLowerCase() })
      : t("assessment.generateDescription", {
          title: config.appTitle,
          label: label.toLowerCase(),
        });
  };

  const getPrimaryAction = () => {
    if (insight) {
      return AIEnabled
        ? t("assessment.regenerateViaAI")
        : t("common.regenerate");
    }
    return AIEnabled
      ? t("assessment.generateViaAI", { label: label.toLowerCase() })
      : t("assessment.generate", { label: label.toLowerCase() });
  };

  const getConfirmMessage = () => {
    return AIEnabled
      ? t("assessment.regenerateViaAIDescription", {
          label: label.toLowerCase(),
        })
      : t("assessment.regenerateDescription", { label: label.toLowerCase() });
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
      secondaryAction: t("assessment.approveInsight", {
        label: label.toLowerCase(),
      }),
      confirmMessage: getConfirmMessage(),
      confirmButtonLabel: t("common.regenerate"),
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
