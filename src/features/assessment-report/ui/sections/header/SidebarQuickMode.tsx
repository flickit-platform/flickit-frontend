import { Box } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import ShareIcon from "@mui/icons-material/ShareOutlined";
import { styles } from "@styles";
import { t } from "i18next";
import ChecklistRtlRoundedIcon from "@mui/icons-material/ChecklistRtlRounded";
import ChecklistRoundedIcon from "@mui/icons-material/ChecklistRounded";

type SidebarQuickModeProps = Readonly<{
  show: boolean | null;
  lng: string;
  rtl: boolean;
  canShare: boolean;
  onShare: () => void;
  navigate: any;
  ContactBox: React.ReactNode;
  canViewQuestionnaires: boolean;
}>;

export default function SidebarQuickMode({
  show,
  lng,
  rtl,
  canShare,
  onShare,
  navigate,
  ContactBox,
  canViewQuestionnaires,
}: SidebarQuickModeProps) {
  if (!show) return null;
  return (
    <Box sx={{ ...styles.centerCV }} gap={2} width="100%">
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
      {canViewQuestionnaires && (
        <LoadingButton
          variant="outlined"
          size="small"
          startIcon={
            rtl ? (
              <ChecklistRoundedIcon fontSize="small" />
            ) : (
              <ChecklistRtlRoundedIcon fontSize="small" />
            )
          }
          onClick={() => navigate("questionnaire")}
          sx={{
            ...styles.rtlStyle(rtl),
          }}
        >
          {t("common.questionnaires", { lng })}
        </LoadingButton>
      )}
      {ContactBox}
    </Box>
  );
}
