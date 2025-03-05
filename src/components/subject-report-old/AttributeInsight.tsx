import { useServiceContext } from "@/providers/ServiceProvider";
import { memo } from "react";
import { useParams } from "react-router-dom";
import QueryData from "../common/QueryData";
import { Box, Skeleton, Typography } from "@mui/material";
import { Trans } from "react-i18next";
import ActionPopup from "../common/buttons/ActionPopup";
import { theme } from "@/config/theme";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { styles } from "@styles";
import { EditableRichEditor } from "../common/fields/EditableRichEditor";
import { t } from "i18next";
import useAttributeInsight from "@/hooks/useAttributeInsight";

export const AttributeInsight = memo(
  ({ id, progress }: { id: string; progress: any }) => {
    const { service } = useServiceContext();
    const { assessmentId = "" } = useParams();

    const {
      ApprovedAIAttribute,
      loadAttributeInsight,
      generateAIInsight,
      approveAttribute,
    } = useAttributeInsight({ id });

    const isInsightExpired = (data: any) => {
      const hasAssessorInsight = data?.assessorInsight;
      const hasAIInsight = data?.aiInsight;
      return (
        (hasAssessorInsight && !hasAssessorInsight?.isValid) ||
        (hasAIInsight && !hasAIInsight?.isValid)
      );
    };

    const isInsightApproved = (data: any) => {
      const hasAssessorInsight = data?.assessorInsight;
      const hasAIInsight = data?.aiInsight;
      return !(
        (hasAssessorInsight && !hasAssessorInsight?.isValid) ||
        (hasAIInsight && !hasAIInsight?.isValid) ||
        ((hasAIInsight || hasAssessorInsight) && !data.approved)
      );
    };

    const getInsightStatus = (data: any) => {
      if (data?.assessorInsight || data?.aiInsight) {
        if (isInsightExpired(data)) {
          return "expired";
        }
        if (isInsightApproved(data)) {
          return "approved";
        }
        return "pending";
      }
      return "default";
    };

    const getPrimaryButtonText = (data: any, t: any) => {
      if (data?.assessorInsight || data?.aiInsight) {
        if (isInsightExpired(data)) {
          return t("generateInsights.insightIsExpired");
        }
        if (isInsightApproved(data)) {
          return t("generateInsights.insightIsApproved");
        }
        return t("generateInsights.AIGeneratedNeedsApproval");
      }
      return t("generateInsights.insightIsNotGenerated");
    };

    const getDescriptionText = (data: any, t: any) => {
      if (data?.assessorInsight || data?.aiInsight) {
        if (isInsightExpired(data)) {
          return t("generateInsights.insightIsExpiredDescription");
        }
        if (isInsightApproved(data)) {
          return t("generateInsights.AIinsightIsApprovedDescription");
        }
        return t("generateInsights.AIGeneratedNeedsApprovalDescription");
      }
      return t("generateInsights.generateInsightViaAIDescription");
    };

    const getPrimaryActionText = (data: any, t: any) => {
      return data?.assessorInsight || data?.aiInsight
        ? t("generateInsights.regenerateViaAI")
        : t("generateInsights.generateInsightViaAI");
    };

    const getStatusColorScheme: any = (data: any, theme: any) => {
      if (!(data?.assessorInsight || data?.aiInsight)) {
        return {
          muiColor: "primary",
          main: theme.palette.primary.main,
          light: theme.palette.primary.light,
        };
      }
      if (isInsightApproved(data)) {
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
    };

    return (
      <QueryData
        {...loadAttributeInsight}
        renderLoading={() => (
          <Skeleton
            variant="rectangular"
            sx={{ borderRadius: 2, height: "60px", mb: 1 }}
          />
        )}
        errorComponent={<></>}
        render={(data) => (
          <>
            {(data.editable ||
              data?.assessorInsight?.insight ||
              data?.aiInsight?.insight) && (
              <>
                <Box
                  sx={{ display: "flex", justifyContent: "space-between" }}
                  onClick={(event) => event.stopPropagation()}
                >
                  <Typography variant="semiBoldLarge">
                    <Trans i18nKey="insight" />
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    {data?.editable && (
                      <ActionPopup
                        disablePrimaryButton={progress !== 100}
                        disablePrimaryButtonText={
                          t(
                            "generateInsights.questionsArentCompleteSoAICantBeGenerated",
                          ) ?? ""
                        }
                        status={getInsightStatus(data)}
                        onPrimaryAction={() => {
                          generateAIInsight
                            .query()
                            .then(() => loadAttributeInsight.query());
                        }}
                        loadingPrimary={generateAIInsight.loading}
                        onSecondaryAction={approveAttribute}
                        loadingSecondary={ApprovedAIAttribute.loading}
                        colorScheme={getStatusColorScheme(data, theme)}
                        texts={{
                          buttonLabel: (
                            <Typography
                              variant="labelMedium"
                              sx={{ ...styles.centerVH, gap: 1 }}
                            >
                              <FaWandMagicSparkles />{" "}
                              {getPrimaryButtonText(data, t)}
                            </Typography>
                          ),
                          description: getDescriptionText(data, t),
                          primaryAction: getPrimaryActionText(data, t),
                          secondaryAction: t("generateInsights.approveInsight"),
                          confirmMessage: t(
                            "generateInsights.regenerateViaAIDescription",
                          ),
                          confirmButtonLabel: t("generateInsights.regenerate"),
                          cancelButtonLabel: t("generateInsights.no"),
                        }}
                      />
                    )}
                  </Box>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  onClick={(event) => event.stopPropagation()}
                >
                  <EditableRichEditor
                    defaultValue={
                      data?.assessorInsight?.insight || data?.aiInsight?.insight
                    }
                    editable={data?.editable}
                    fieldName="title"
                    onSubmit={async (payload: any) => {
                      await service.createAttributeInsight({
                        assessmentId,
                        attributeId: id,
                        data: { assessorInsight: payload.title },
                      });
                    }}
                    infoQuery={loadAttributeInsight.query}
                    placeholder={
                      t("writeHere", { title: t("insight").toLowerCase() }) ??
                      ""
                    }
                  />
                </Box>
              </>
            )}
          </>
        )}
      />
    );
  },
);
