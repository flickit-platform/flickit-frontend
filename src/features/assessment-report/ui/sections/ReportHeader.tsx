import { Box, Typography } from "@mui/material";
import ChipsRow from "@/components/common/fields/ChipsRow";
import { styles } from "@styles";
import { t } from "i18next";

export default function ReportHeader({
  rtl,
  lng,
  infoItems,
}: Readonly<{
  rtl: boolean;
  lng: string;
  infoItems: ReadonlyArray<any>;
}>) {
  return (
    <Box justifyContent="space-between" width="100%" sx={{ ...styles.centerV }}>
      <Typography
        variant="headlineMedium"
        color="primary"
        sx={{ ...styles.rtlStyle(rtl) }}
      >
        {t("assessmentReport.assessmentResult", { lng })}
      </Typography>
      <ChipsRow items={infoItems} lng={lng} />
    </Box>
  );
}
