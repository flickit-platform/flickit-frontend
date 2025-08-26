import { Box } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import ShareIcon from "@mui/icons-material/ShareOutlined";
import { styles } from "@styles";
import { t } from "i18next";

type SidebarQuickModeProps = Readonly<{
  show: boolean | null;
  lng: string;
  rtl: boolean;
  canShare: boolean;
  onShare: () => void;
  ContactBox: React.ReactNode;
}>;

export default function SidebarQuickMode({
  show,
  lng,
  rtl,
  canShare,
  onShare,
  ContactBox,
}: SidebarQuickModeProps) {
  if (!show) return null;
  return (
    <Box sx={{ ...styles.centerCV }} gap={3} width="100%">
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
      {ContactBox}
    </Box>
  );
}
