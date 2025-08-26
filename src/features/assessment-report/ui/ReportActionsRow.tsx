import { Box } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import ShareIcon from "@mui/icons-material/ShareOutlined";
import { styles } from "@styles";
import { t } from "i18next";

type Props = {
  rtl: boolean;
  lng: string;
  canShare: boolean;
  isQuickMode: boolean;
  onShare: () => void;
  onExpert: () => void;
  onQuestionnaires: () => void;
};

export default function ReportActionsRow({
  rtl,
  lng,
  canShare,
  isQuickMode,
  onShare,
  onExpert,
  onQuestionnaires,
}: Props) {
  return (
    <Box display="flex" gap={2} justifyContent="space-between">
      <LoadingButton
        variant="outlined"
        size="small"
        onClick={onQuestionnaires}
        sx={{ ...styles.rtlStyle(rtl) }}
      >
        {t("common.questionnaires", { lng })}
      </LoadingButton>

      <Box display="flex" gap={2}>
        <LoadingButton
          variant="contained"
          startIcon={
            <ShareIcon
              fontSize="small"
              sx={{ ...styles.iconDirectionStyle(lng) }}
            />
          }
          size="small"
          onClick={onShare}
          disabled={!canShare}
          sx={{ ...styles.rtlStyle(rtl) }}
        >
          {t("assessmentReport.shareReport", { lng })}
        </LoadingButton>

        {isQuickMode && (
          <LoadingButton
            variant="contained"
            size="small"
            onClick={onExpert}
            sx={{ ...styles.rtlStyle(rtl), height: "100%" }}
          >
            {t("assessmentReport.getMoreDetailedRecommendations", { lng })}
          </LoadingButton>
        )}
      </Box>
    </Box>
  );
}
