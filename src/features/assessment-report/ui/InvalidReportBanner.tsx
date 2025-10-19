import { Box, Button } from "@mui/material";
import { Replay } from "@mui/icons-material";
import { styles } from "@styles";
import { t } from "i18next";
import { Text } from "@/components/common/Text";
type Props = Readonly<{
  onRetry: () => void;
}>;

export default function InvalidReportBanner({ onRetry }: Props) {
  return (
    <Box
      bgcolor="error.main"
      height={48}
      gap={6}
      sx={{ ...styles.centerVH }}
      role="alert"
      aria-live="polite"
    >
      <Text
        variant="semiBoldLarge"
        color="error.contrastText"
        sx={{ ...styles.centerV }}
      >
        {t("notification.incompleteReportDueToDelay")}
      </Text>
      <Box bgcolor="background.container" color="error.main" borderRadius="4px">
        <Button
          onClick={onRetry}
          size="small"
          variant="contained"
          color="inherit"
          endIcon={<Replay />}
        >
          {t("common.retry")}
        </Button>
      </Box>
    </Box>
  );
}
