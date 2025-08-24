import { Box, Button, Typography } from "@mui/material";
import { Replay } from "@mui/icons-material";
import { styles } from "@styles";
import { t } from "i18next";
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
      <Typography
        variant="semiBoldLarge"
        color="error.contrastText"
        sx={{ ...styles.centerV }}
      >
        {t("notification.incompleteReportDueToDelay")}
      </Typography>
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
