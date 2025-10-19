import { Box } from "@mui/material";
import ChipsRow from "@/components/common/fields/ChipsRow";
import { styles } from "@styles";
import { t } from "i18next";
import { Text } from "@/components/common/Text";

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
      <Text
        variant="headlineMedium"
        color="primary"
        sx={{ ...styles.rtlStyle(rtl) }}
      >
        {t("assessmentReport.assessmentResult", { lng })}
      </Text>
      <ChipsRow items={infoItems} lng={lng} />
    </Box>
  );
}
