import { useCallback } from "react";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { Typography } from "@mui/material";
import { theme } from "@/config/theme";
import { t } from "i18next";
import { styles } from "@styles";
import { useConfigContext } from "@/providers/ConfgProvider";

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
  cancelMessage: string;
}

interface UseInsightPopupProps {
  insight: boolean;
  isExpired: boolean;
  isApproved: boolean;
  initQuery: () => Promise<void>;
  fetchQuery: () => Promise<void>;
  approveAction: (event: any) => void;
  initLoading: boolean;
  approveLoading: boolean;
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

  const getPopupTexts = useCallback((): PopupTexts => {
    const buttonLabel = (
      <Typography variant="labelMedium" sx={{ ...styles.centerVH, gap: 1 }}>
        <FaWandMagicSparkles />
        {t(
          insight
            ? isExpired
              ? "insightPage.insightIsExpired"
              : isApproved
                ? "insightPage.insightIsApproved"
                : "insightPage.generatedByAppNeedsApproval"
            : "insightPage.generateInsight",
          { title: config.appTitle },
        )}
      </Typography>
    );

    const description = isExpired
      ? t("insightPage.insightIsExpiredDescription")
      : insight
        ? isApproved
          ? t("insightPage.insightIsApprovedDescription", {
              title: config.appTitle,
            })
          : t("insightPage.generatedByAppNeedsApprovalDescription", {
              title: config.appTitle,
            })
        : t("insightPage.generateInsightDescription", {
            title: config.appTitle,
          });

    return {
      buttonLabel,
      description,
      primaryAction: insight
        ? t("insightPage.regenerate")
        : t("insightPage.generateInsight"),
      secondaryAction: t("insightPage.approveInsight"),
      confirmMessage: t("insightPage.regenerateDescription"),
      cancelMessage: t("insightPage.no"),
    };
  }, [insight, isExpired, isApproved, config, t, styles]);

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
